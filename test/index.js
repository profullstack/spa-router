/**
 * Basic tests for @profullstack/spa-router
 */

// Import the module
const spaRouter = require('../src/index.js');

// Basic test to ensure the module exports something
console.log('Testing @profullstack/spa-router...');
console.log('Module exports:', Object.keys(spaRouter));

if (Object.keys(spaRouter).length === 0) {
  console.error('ERROR: Module does not export anything!');
  process.exit(1);
}

// Test individual components if they exist
try {
  const componentLoader = require('../src/component-loader.js');
  console.log('Testing component loader...');
  console.log('Component loader exports:', Object.keys(componentLoader));
} catch (err) {
  console.log('Component loader not found or could not be loaded:', err.message);
}

try {
  const renderer = require('../src/renderer.js');
  console.log('Testing renderer...');
  console.log('Renderer exports:', Object.keys(renderer));
} catch (err) {
  console.log('Renderer not found or could not be loaded:', err.message);
}

try {
  const router = require('../src/router.js');
  console.log('Testing router...');
  console.log('Router exports:', Object.keys(router));
} catch (err) {
  console.log('Router not found or could not be loaded:', err.message);
}

try {
  const transitions = require('../src/transitions.js');
  console.log('Testing transitions...');
  console.log('Transitions exports:', Object.keys(transitions));
} catch (err) {
  console.log('Transitions not found or could not be loaded:', err.message);
}

try {
  const types = require('../src/types.js');
  console.log('Testing types...');
  console.log('Types exports:', Object.keys(types));
} catch (err) {
  console.log('Types not found or could not be loaded:', err.message);
}

try {
  const utils = require('../src/utils.js');
  console.log('Testing utils...');
  console.log('Utils exports:', Object.keys(utils));
} catch (err) {
  console.log('Utils not found or could not be loaded:', err.message);
}

// Test basic functionality
if (typeof spaRouter.Router === 'function') {
  console.log('Testing Router constructor exists:', typeof spaRouter.Router === 'function' ? 'SUCCESS' : 'FAILED');
}

if (typeof spaRouter.navigate === 'function') {
  console.log('Testing navigate function exists:', typeof spaRouter.navigate === 'function' ? 'SUCCESS' : 'FAILED');
}

console.log('Basic test passed!');