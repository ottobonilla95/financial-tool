const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');

// Load server modules with explicit boundary doubles; never connect to a real database.
function load(file, dependencies) {
  const code = ts.transpileModule(fs.readFileSync(file, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText;
  const module = { exports: {} };
  new Function('require', 'module', 'exports', code)((name) => {
    if (!(name in dependencies)) throw new Error(`Unexpected dependency: ${name}`);
    return dependencies[name];
  }, module, module.exports);
  return module.exports;
}
const id = '11111111-1111-4111-8111-111111111111';
function actionHarness(userId = 'owner') {
  const calls = [];
  const labels = require('../src/translations/en.json').settings;
  const actions = load('src/form-actions/category-settings.ts', {
    '@/auth': { auth: async () => userId ? { user: { id: userId } } : null },
    '@/src/data/category/settings': { mutateManagedCategory: async (...args) => { calls.push(args); return 'success'; } },
    '@/src/translations': { getDictionary: async () => ({ settings: labels }) },
    'next/cache': { revalidatePath: (...args) => calls.push(args) },
    zod: require('zod'),
  });
  return { calls, run: (values) => {
    const data = new FormData();
    Object.entries(values).forEach(([key, value]) => data.set(key, value));
    return actions.saveCategorySettings('en', data);
  } };
}
test('unauthenticated requests cannot mutate categories', async () => {
  const h = actionHarness(null);
  assert.equal((await h.run({ kind: 'expense', operation: 'delete', id })).ok, false);
  assert.deepEqual(h.calls, []);
});
test('rejects malformed IDs, invalid kinds, blank/long names and invalid colors before mutation', async () => {
  for (const values of [
    { kind: 'expense', operation: 'delete' },
    { kind: 'income', operation: 'delete', id: 'invalid' },
    { kind: 'other', operation: 'create', name: 'Food', color: '#123456' },
    { kind: 'expense', operation: 'create', name: '   ', color: '#123456' },
    { kind: 'income', operation: 'create', name: 'x'.repeat(101), color: '#123456' },
    { kind: 'income', operation: 'update', id, name: 'Food', color: 'red' },
  ]) {
    const h = actionHarness();
    assert.equal((await h.run(values)).ok, false);
    assert.deepEqual(h.calls, []);
  }
});
test('uses session ownership, trims names and revalidates localized dashboards', async () => {
  const h = actionHarness();
  assert.equal((await h.run({ kind: 'income', operation: 'update', id, name: ' Salary ', color: '#123456', userId: 'attacker' })).ok, true);
  assert.deepEqual(h.calls, [ ['owner', 'income', 'update', id, { name: 'Salary', color: '#123456' }], ['/[lang]/dashboard', 'layout'] ]);
});
function dataHarness(count = 1) {
  const calls = [];
  const model = {
    updateMany: async (args) => { calls.push(args); return { count }; },
    deleteMany: async (args) => { calls.push(args); return { count }; },
  };
  const tx = { expense_category: model, earning_category: model };
  const data = load('src/data/category/settings.ts', {
    '@prisma/client': { PrismaClient: class { async $transaction(fn) { return fn(tx); } } },
    '@/src/constants/categories': { MAX_CATEGORIES_FREE_PLAN: 9 },
  });
  return { calls, mutate: data.mutateManagedCategory };
}
test('updates scope both category types to the authenticated owner', async () => {
  for (const kind of ['expense', 'income']) {
    const h = dataHarness(0);
    assert.equal(await h.mutate('owner', kind, 'update', id, { name: 'Food', color: '#123456' }), 'missing');
    assert.deepEqual(h.calls[0].where, { id, user_id: 'owner' });
  }
});
test('deletion requires ownership and no transaction or subcategory references', async () => {
  for (const kind of ['expense', 'income']) {
    const h = dataHarness(0);
    assert.equal(await h.mutate('owner', kind, 'delete', id), 'inUse');
    assert.deepEqual(h.calls[0].where, kind === 'expense'
      ? { id, user_id: 'owner', expenses: { none: {} }, expense_subcategory: { none: {} } }
      : { id, user_id: 'owner', earning: { none: {} }, earning_subcategory: { none: {} } });
  }
});
test('unused categories can be deleted', async () => {
  for (const kind of ['expense', 'income']) {
    const h = dataHarness();
    assert.equal(await h.mutate('owner', kind, 'delete', id), 'success');
  }
});
test('creates categories for the signed-in user and preserves the expense free-plan limit', async () => {
  for (const kind of ['expense', 'income']) {
    for (const premium of [false, true]) {
      const writes = [];
      const model = { count: async () => 9, create: async (args) => writes.push(args) };
      const tx = {
        expense_category: model, earning_category: model,
        users: { findUniqueOrThrow: async () => ({ subscription_plan: premium ? 'lifetime' : null }) },
      };
      const data = load('src/data/category/settings.ts', {
        '@prisma/client': { PrismaClient: class { async $transaction(fn) { return fn(tx); } } },
        '@/src/constants/categories': { MAX_CATEGORIES_FREE_PLAN: 9 },
      });
      const values = { name: 'Travel', color: '#123456' };
      const result = await data.mutateManagedCategory('owner', kind, 'create', undefined, values);
      const blocked = kind === 'expense' && !premium;
      assert.equal(result, blocked ? 'limit' : 'success');
      assert.deepEqual(writes, blocked ? [] : [{ data: { ...values, user_id: 'owner' } }]);
    }
  }
});
