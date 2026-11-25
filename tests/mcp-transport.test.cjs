const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
const mcpHandler = require('mcp-handler');

test('warm MCP route handles initialize, initialized notification, and tool discovery', async () => {
  const code = ts.transpileModule(fs.readFileSync('app/api/[transport]/route.ts', 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText;
  const dependencies = {
    'node:crypto': require('node:crypto'),
    'mcp-handler': { ...mcpHandler, withMcpAuth: handler => handler },
    '@prisma/client': { PrismaClient: class {} },
    zod: require('zod'),
    '@/src/mcp/oauth': { MCP_ORIGIN: 'http://localhost:3005', MCP_RESOURCE: 'http://localhost:3005/api/mcp' },
    '@/src/mcp/income': { registerIncomeTools() {} },
  };
  const module = { exports: {} };
  new Function('require', 'module', 'exports', code)(name => {
    if (!(name in dependencies)) throw new Error(`Unexpected dependency ${name}`);
    return dependencies[name];
  }, module, module.exports);

  // mcp-handler starts a process-wide cleanup timer; it is not part of this test.
  const originalSetInterval = global.setInterval;
  global.setInterval = (...args) => originalSetInterval(...args).unref();
  try {
    const post = async body => module.exports.POST(new Request('http://localhost:3005/api/mcp', {
      method: 'POST',
      headers: { 'content-type': 'application/json', accept: 'application/json, text/event-stream' },
      body: JSON.stringify(body),
    }));
    const initialize = await post({ jsonrpc: '2.0', id: 1, method: 'initialize', params: {
      protocolVersion: '2025-03-26', capabilities: {}, clientInfo: { name: 'test', version: '1' },
    } });
    assert.equal(initialize.status, 200);
    const initialized = await post({ jsonrpc: '2.0', method: 'notifications/initialized' });
    assert.equal(initialized.status, 202);
    const tools = await post({ jsonrpc: '2.0', id: 2, method: 'tools/list', params: {} });
    assert.equal(tools.status, 200);
    assert.match(await tools.text(), /get_transaction_import_context/);
  } finally {
    global.setInterval = originalSetInterval;
  }
});
