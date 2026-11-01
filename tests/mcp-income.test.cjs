const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
const z = require('zod');
const crypto = require('node:crypto');

const categoryId = '11111111-1111-4111-8111-111111111111';
const subCategoryId = '22222222-2222-4222-8222-222222222222';
const input = { amount: 1234.56, date: '2026-07-01', description: 'Monthly income', categoryId, currencyId: 1 };
const auth = owner => ({ authInfo: { scopes: ['transactions:read', 'transactions:write'], extra: { userId: owner } } });

function harness({ category = true, currency = true, duplicates = 0 } = {}) {
  const tools = {};
  const calls = [];
  const saved = new Map();
  const db = {
    users: {
      findUniqueOrThrow: async args => { calls.push(['user', args]); return { currency_id: 1 }; },
      update: async args => { calls.push(['updated', args]); },
    },
    earning_category: { findFirst: async args => {
      calls.push(['category', args]);
      return category ? { name: 'Salary', earning_subcategory: [{ id: subCategoryId, name: 'salary' }] } : null;
    } },
    currency: { findUnique: async () => currency ? { currencyCode: 'EUR' } : null },
    earning: {
      count: async args => { calls.push(['duplicates', args]); return duplicates; },
      createMany: async args => {
        calls.push(['create', args]);
        assert.equal(args.skipDuplicates, true);
        const row = args.data[0];
        if (saved.has(row.id)) return { count: 0 };
        saved.set(row.id, row);
        return { count: 1 };
      },
      findFirstOrThrow: async args => {
        const row = saved.get(args.where.id);
        assert.equal(row.user_id, args.where.user_id);
        return row;
      },
    },
    async $transaction(fn) { return fn(db); },
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
  process.env.MCP_REVIEW_SECRET = 'local-test-only-income-review-secret';
  module.exports.registerIncomeTools({ registerTool: (name, config, run) => { tools[name] = { config, run }; } }, db);
  return { tools, calls, saved, preview: (value = input) => tools.preview_income.run(value, auth('owner')),
    commit: token => tools.commit_income.run({ reviewToken: token }, auth('owner')) };
}

test('income previews are read-only, use scoped categories, and warn about duplicates', async () => {
  const h = harness({ duplicates: 1 });
  const preview = (await h.preview()).structuredContent;
  assert.equal(preview.income.amount, 1234.56);
  assert.equal(preview.income.currencyCode, 'EUR');
  assert.equal(preview.income.categoryName, 'Salary');
  assert.equal(preview.warnings.length, 1);
  assert.equal(h.saved.size, 0);
  assert.deepEqual(h.calls.find(x => x[0] === 'category')[1].where, { id: categoryId, user_id: 'owner' });
  assert.equal(h.calls.find(x => x[0] === 'duplicates')[1].where.user_id, 'owner');
});
test('income requires identity and read/write scopes before database access', async () => {
  for (const extra of [undefined, {}, { authInfo: { scopes: ['transactions:write'] } }]) {
    const h = harness();
    await assert.rejects(h.tools.preview_income.run(input, extra));
    assert.deepEqual(h.calls, []);
  }
  const h = harness();
  const preview = await h.preview();
  const before = h.calls.length;
  await assert.rejects(h.tools.commit_income.run({ reviewToken: preview.structuredContent.reviewToken }, {
    authInfo: { scopes: ['transactions:read'], extra: { userId: 'owner' } },
  }));
  assert.equal(h.calls.length, before);
});
test('income validates dates, precision, amounts, category ownership, subcategory parent and currency', async () => {
  const h = harness();
  const schema = z.object(h.tools.preview_income.config.inputSchema);
  for (const patch of [{ date: '2026-02-30' }, { date: '01 Nov 2026' }, { amount: 0 }, { amount: -1 },
    { amount: Infinity }, { amount: 0.001 }, { amount: 100000000 }, { categoryId: 'wrong' }]) {
    assert.equal(schema.safeParse({ ...input, ...patch }).success, false, JSON.stringify(patch));
  }
  assert.equal(schema.safeParse({ ...input, date: '2028-02-29' }).success, true);
  await assert.rejects(harness({ category: false }).preview(), /belonging/);
  await assert.rejects(harness({ currency: false }).preview(), /currency/);
  await assert.rejects(h.preview({ ...input, subCategoryId: crypto.randomUUID() }), /subcategory/);
});
test('confirmed income is saved once and read back; repeating the token does not duplicate it', async () => {
  const h = harness();
  const token = (await h.preview({ ...input, subCategoryId })).structuredContent.reviewToken;
  const first = (await h.commit(token)).structuredContent;
  const second = (await h.commit(token)).structuredContent;
  assert.equal(first.status, 'committed');
  assert.equal(first.createdCount, 1);
  assert.equal(second.status, 'already_committed');
  assert.equal(second.createdCount, 0);
  assert.equal(second.income.id, first.income.id);
  assert.deepEqual(first.income, { id: first.income.id, amount: 1234.56, date: '2026-07-01',
    description: 'Monthly income', categoryId, subCategoryId, currencyId: 1 });
  assert.equal(h.saved.size, 1);
  assert.equal(h.calls.filter(x => x[0] === 'updated').length, 1);
});
test('tampered, expired and other-user tokens cannot save income', async () => {
  const h = harness();
  const token = (await h.preview()).structuredContent.reviewToken;
  await assert.rejects(h.tools.commit_income.run({ reviewToken: token }, auth('someone-else')), /this user/);
  const [encoded, signature] = token.split('.');
  const payload = JSON.parse(Buffer.from(encoded, 'base64url').toString());
  payload.income.amount = 1;
  const tampered = Buffer.from(JSON.stringify(payload)).toString('base64url') + '.' + signature;
  await assert.rejects(h.commit(tampered), /signature/);
  payload.expiresAt = Date.now() - 1;
  const expiredData = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const expired = expiredData + '.' + crypto.createHmac('sha256', process.env.MCP_REVIEW_SECRET).update(expiredData).digest('base64url');
  await assert.rejects(h.commit(expired), /expired/);
  assert.equal(h.saved.size, 0);
});
test('commit rechecks category and currency references before writing', async () => {
  const token = (await harness().preview()).structuredContent.reviewToken;
  for (const options of [{ category: false }, { currency: false }]) {
    const h = harness(options);
    await assert.rejects(h.commit(token));
    assert.equal(h.saved.size, 0);
  }
});
test('concurrent retries share the same entry ID and use the default currency when omitted', async () => {
  const h = harness();
  const { currencyId, ...withoutCurrency } = input;
  const preview = (await h.preview(withoutCurrency)).structuredContent;
  assert.equal(preview.income.currencyId, 1);
  const receipts = await Promise.all([h.commit(preview.reviewToken), h.commit(preview.reviewToken)]);
  assert.equal(receipts.reduce((total, receipt) => total + receipt.structuredContent.createdCount, 0), 1);
  assert.equal(h.saved.size, 1);
});
