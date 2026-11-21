const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
const z = require('zod');
const crypto = require('node:crypto');

const owner = '11111111-1111-4111-8111-111111111111';
const other = '22222222-2222-4222-8222-222222222222';
const auth = (userId = owner, scopes = ['transactions:read', 'transactions:write']) => ({
  authInfo: { scopes, extra: { userId } },
});

function harness(initial = [], userExists = true) {
  const tools = {};
  const calls = [];
  const categories = initial.map(category => ({ earning_subcategory: [], ...category }));
  let lock = Promise.resolve();
  const db = {
    users: {
      update: async args => { calls.push(['updated', args]); },
      findUniqueOrThrow: async () => ({ currency_id: 1 }),
    },
    earning_category: {
      findFirst: async args => {
        calls.push(['find', args]);
        return categories.find(category => category.user_id === args.where.user_id &&
          (args.where.id ? category.id === args.where.id
            : category.name.toLowerCase() === args.where.name.equals.toLowerCase())) || null;
      },
      create: async args => {
        calls.push(['create', args]);
        const category = { id: crypto.randomUUID(), earning_subcategory: [], ...args.data };
        categories.push(category);
        return category;
      },
    },
    currency: { findUnique: async () => ({ currencyCode: 'EUR' }) },
    earning: { count: async () => 0 },
    // Model the transaction-scoped row lock so concurrent duplicate checks
    // exercise the same wait-until-commit behavior as PostgreSQL FOR UPDATE.
    async $transaction(fn) {
      let unlock;
      const tx = { ...db, async $queryRaw(strings, userId) {
        calls.push(['lock', strings.join('?'), userId]);
        const previous = lock;
        lock = new Promise(resolve => { unlock = resolve; });
        await previous;
        return userExists ? [{ id: userId }] : [];
      } };
      try { return await fn(tx); } finally { unlock?.(); }
    },
  };
  const code = ts.transpileModule(fs.readFileSync('src/mcp/income.ts', 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText;
  const module = { exports: {} };
  new Function('require', 'module', 'exports', code)(name => {
    if (name === 'node:crypto') return crypto;
    if (name === 'zod') return z;
    throw new Error(`Unexpected dependency ${name}`);
  }, module, module.exports);
  process.env.MCP_REVIEW_SECRET = 'local-test-only-category-review-secret';
  module.exports.registerIncomeTools({ registerTool: (name, config, run) => {
    tools[name] = { config, run };
  } }, db);
  return { tools, calls, categories, create: (input, extra = auth()) =>
    tools.create_income_category.run(input, extra) };
}

test('creates a category for the authenticated account and returns a usable income category', async () => {
  const h = harness();
  const receipt = (await h.create({ name: ' Tax refund ' })).structuredContent;
  assert.equal(receipt.status, 'created');
  assert.equal(receipt.createdCount, 1);
  assert.deepEqual(receipt.category, { id: h.categories[0].id, name: 'Tax refund', color: '#10d61e', subcategories: [] });
  assert.equal(h.categories[0].user_id, owner);
  assert.equal(h.calls.find(call => call[0] === 'lock')[2], owner);
  assert.match(h.calls.find(call => call[0] === 'lock')[1], /FOR UPDATE/);
  assert.equal(h.calls.find(call => call[0] === 'find')[1].where.user_id, owner);
  assert.equal(h.calls.find(call => call[0] === 'updated')[1].where.id, owner);
  const preview = (await h.tools.preview_income.run({ amount: 123, date: '2026-07-01',
    description: 'Tax refund', categoryId: receipt.category.id }, auth())).structuredContent;
  assert.equal(preview.income.categoryName, 'Tax refund');
  assert.equal(preview.income.categoryId, receipt.category.id);
});

test('category creation requires identity and write scope before any database access', async () => {
  const h = harness();
  for (const extra of [undefined, {}, auth('', ['transactions:write']), auth(owner, ['transactions:read']),
    { authInfo: { scopes: ['transactions:write'] } }]) {
    await assert.rejects(h.tools.create_income_category.run({ name: 'Refunds' }, extra));
    assert.deepEqual(h.calls, []);
  }
});

test('rejects invalid names and colors before database access', async () => {
  const h = harness();
  const schema = z.object(h.tools.create_income_category.config.inputSchema);
  for (const input of [{}, { name: '' }, { name: '  ' }, { name: 'x'.repeat(101) },
    { name: 123 }, { name: 'Refunds', color: 'green' }, { name: 'Refunds', color: '#123' },
    { name: 'Refunds', color: '#1234567' }]) {
    assert.equal(schema.safeParse(input).success, false);
    await assert.rejects(h.create(input));
  }
  assert.deepEqual(h.calls, []);
  assert.equal(schema.safeParse({ name: 'Refunds', color: '#aBc123' }).success, true);
});

test('retries reuse case-insensitive names without changing existing data', async () => {
  const h = harness();
  const first = (await h.create({ name: 'Tax refund', color: '#123456' })).structuredContent;
  h.categories[0].earning_subcategory.push({ id: crypto.randomUUID(), name: 'Revenue' });
  const second = (await h.create({ name: ' TAX REFUND ', color: '#abcdef' })).structuredContent;
  assert.equal(second.status, 'already_exists');
  assert.equal(second.createdCount, 0);
  assert.equal(second.category.id, first.category.id);
  assert.equal(second.category.color, '#123456');
  assert.deepEqual(second.category.subcategories, h.categories[0].earning_subcategory);
  assert.equal(h.categories.length, 1);
  assert.equal(h.calls.filter(call => call[0] === 'updated').length, 1);
});

test('same category name in another account is neither reused nor modified', async () => {
  const foreign = { id: crypto.randomUUID(), user_id: other, name: 'Tax refund', color: '#abcdef' };
  const h = harness([foreign]);
  const receipt = (await h.create({ name: 'Tax refund', userId: other })).structuredContent;
  assert.equal(receipt.status, 'created');
  assert.notEqual(receipt.category.id, foreign.id);
  assert.equal(h.categories[1].user_id, owner);
  assert.equal(h.categories[0].color, foreign.color);
});

test('concurrent MCP retries create one category and return the same ID', async () => {
  const h = harness();
  const receipts = await Promise.all(['Tax refund', ' TAX REFUND ', 'tax refund'].map(name => h.create({ name })));
  assert.equal(receipts.reduce((count, r) => count + r.structuredContent.createdCount, 0), 1);
  assert.equal(new Set(receipts.map(r => r.structuredContent.category.id)).size, 1);
  assert.equal(h.categories.length, 1);
});

test('deleted accounts cannot create categories', async () => {
  const h = harness([], false);
  await assert.rejects(h.create({ name: 'Refunds' }), /no longer exists/);
  assert.equal(h.categories.length, 0);
  assert.equal(h.calls.length, 1);
});
