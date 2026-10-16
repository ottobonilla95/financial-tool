const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
const z = require('zod');

function harness(count = 1) {
  const tools = {};
  const calls = [];
  const tx = {
    expenses: {
      updateMany: async args => { calls.push(args); return { count }; },
      findFirstOrThrow: async args => {
        calls.push(args);
        return { id: args.where.id, date: new Date('2026-10-10T00:00:00Z'), description: 'Vercel', amount: 17.94 };
      },
    },
    users: { update: async args => { calls.push(args); } },
  };
  const dependencies = {
    'node:crypto': require('node:crypto'),
    zod: z,
    '@prisma/client': { PrismaClient: class { async $transaction(fn) { return fn(tx); } } },
    '@/src/mcp/oauth': {},
    'mcp-handler': {
      createMcpHandler: register => {
        register({ registerResource() {}, registerPrompt() {}, registerTool: (name, config, run) => { tools[name] = { config, run }; } });
        return () => {};
      },
      withMcpAuth: handler => handler,
    },
  };
  const code = ts.transpileModule(fs.readFileSync('app/api/[transport]/route.ts', 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText;
  const module = { exports: {} };
  new Function('require', 'module', 'exports', code)(name => {
    if (!(name in dependencies)) throw new Error(`Unexpected dependency ${name}`);
    return dependencies[name];
  }, module, module.exports);
  return { ...tools.update_expense_date, calls };
}
const input = { expenseId: 'a9b7d5c7-6df7-4d70-81c8-5c2f0e936da7', expectedDate: '2026-10-11', date: '2026-10-10' };
const auth = { authInfo: { scopes: ['transactions:write'], extra: { userId: 'owner' } } };

test('date edits require authenticated identity and write scope', async () => {
  for (const extra of [undefined, { authInfo: { scopes: [] } }, { authInfo: { scopes: ['transactions:write'] } }]) {
    const h = harness();
    await assert.rejects(h.run(input, extra));
    assert.deepEqual(h.calls, []);
  }
});
test('validates real calendar dates and expense IDs', () => {
  const schema = z.object(harness().config.inputSchema);
  for (const patch of [{ expenseId: 'invalid' }, { date: '2026-02-30' }, { expectedDate: '10/11/2026' }]) {
    assert.equal(schema.safeParse({ ...input, ...patch }).success, false);
  }
  assert.equal(schema.safeParse({ ...input, date: '2028-02-29' }).success, true);
});
test('updates only date with atomic owner and expected-date filters, then returns saved record', async () => {
  const h = harness();
  const result = await h.run(input, auth);
  assert.deepEqual(h.calls[0], {
    where: { id: input.expenseId, user_id: 'owner', date: new Date('2026-10-11T12:00:00Z') },
    data: { date: new Date('2026-10-10T12:00:00Z') },
  });
  assert.equal(h.calls[1].where.id, 'owner');
  assert.equal(h.calls[2].where.user_id, 'owner');
  assert.equal(result.structuredContent.expense.date, '2026-10-10');
  assert.equal(result.structuredContent.expense.amount, 17.94);
});
test('missing, foreign-owned, or stale expense does not update user metadata or return a record', async () => {
  const h = harness(0);
  await assert.rejects(h.run(input, auth), /not found or its date changed/);
  assert.equal(h.calls.length, 1);
});
