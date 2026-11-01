const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');

function load(path, dependencies) {
  const code = ts.transpileModule(fs.readFileSync(path, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, esModuleInterop: true },
  }).outputText;
  const module = { exports: {} };
  new Function('require', 'module', 'exports', code)(name => {
    if (!(name in dependencies)) throw new Error(`Unexpected eager dependency: ${name}`);
    return dependencies[name];
  }, module, module.exports);
  return module.exports;
}
test('reading a session does not load the native bcrypt module', async () => {
  let credentials;
  const session = { user: { id: 'owner' } };
  const loaded = load('auth.ts', {
    'next-auth': () => ({ auth: async () => session }),
    'next-auth/providers/credentials': config => { credentials = config; return config; },
    './auth.config': { authConfig: {} },
    zod: require('zod'),
    './src/data/user': { getDBUser: async () => ({ fullySignedUp: true, password: 'hash' }) },
  });
  assert.deepEqual(await loaded.auth(), session);
  await assert.rejects(credentials.authorize({ email: 'test@example.com', password: 'password' }), /bcrypt/);
});
for (const kind of ['income', 'expense']) {
  test(`${kind} category API rejects signed-out requests and only reads the session owner's categories`, async () => {
    let session = null;
    const calls = [];
    const categories = [{ id: 'category', name: 'Salary', subcategories: [] }];
    const route = load(`app/api/${kind}/category/get-all/route.ts`, {
      '@/src/auth/session': { sessionAuth: async () => session },
      [`@/src/data/${kind === 'income' ? 'income' : 'expense'}-category/fetch-categories`]: {
        [kind === 'income' ? 'fetchIncomeCategories' : 'fetchExpensesCategories']: async owner => { calls.push(owner); return categories; },
      },
    });
    assert.equal((await route.GET()).status, 401);
    assert.deepEqual(calls, []);
    session = { user: { id: 'owner' } };
    const response = await route.GET();
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), { categories });
    assert.deepEqual(calls, ['owner']);
  });
}
