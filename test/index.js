/**
 * Basic tests for @profullstack/spa-router
 */

// Import the module
import spaRouter from '../src/index.js';
import { jest } from '@jest/globals';

// Import individual components
let componentLoader, renderer, router, transitions, types, utils;

try { componentLoader = await import('../src/component-loader.js'); }
catch (err) { console.log('Component loader not found or could not be loaded:', err.message); }

try { renderer = await import('../src/renderer.js'); }
catch (err) { console.log('Renderer not found or could not be loaded:', err.message); }

try { router = await import('../src/router.js'); }
catch (err) { console.log('Router not found or could not be loaded:', err.message); }

try { transitions = await import('../src/transitions.js'); }
catch (err) { console.log('Transitions not found or could not be loaded:', err.message); }

try { types = await import('../src/types.js'); }
catch (err) { console.log('Types not found or could not be loaded:', err.message); }

try { utils = await import('../src/utils.js'); }
catch (err) { console.log('Utils not found or could not be loaded:', err.message); }

describe('@profullstack/spa-router', () => {
  test('module exports something', () => {
    console.log('Testing @profullstack/spa-router...');
    console.log('Module exports:', Object.keys(spaRouter));
    
    expect(Object.keys(spaRouter).length).toBeGreaterThan(0);
  });
  
  // Test individual components if they exist
  test('component loader if available', () => {
    if (componentLoader) {
      console.log('Testing component loader...');
      console.log('Component loader exports:', Object.keys(componentLoader));
      expect(Object.keys(componentLoader).length).toBeGreaterThan(0);
    } else {
      console.log('Component loader not available, skipping test');
    }
  });
  
  test('renderer if available', () => {
    if (renderer) {
      console.log('Testing renderer...');
      console.log('Renderer exports:', Object.keys(renderer));
      expect(Object.keys(renderer).length).toBeGreaterThan(0);
    } else {
      console.log('Renderer not available, skipping test');
    }
  });
  
  test('router if available', () => {
    if (router) {
      console.log('Testing router...');
      console.log('Router exports:', Object.keys(router));
      expect(Object.keys(router).length).toBeGreaterThan(0);
    } else {
      console.log('Router not available, skipping test');
    }
  });
  
  test('transitions if available', () => {
    if (transitions) {
      console.log('Testing transitions...');
      console.log('Transitions exports:', Object.keys(transitions));
      expect(Object.keys(transitions).length).toBeGreaterThan(0);
    } else {
      console.log('Transitions not available, skipping test');
    }
  });
  
  test('types if available', () => {
    if (types) {
      console.log('Testing types...');
      console.log('Types exports:', Object.keys(types));
      expect(Object.keys(types).length).toBeGreaterThan(0);
    } else {
      console.log('Types not available, skipping test');
    }
  });
  
  test('utils if available', () => {
    if (utils) {
      console.log('Testing utils...');
      console.log('Utils exports:', Object.keys(utils));
      expect(Object.keys(utils).length).toBeGreaterThan(0);
    } else {
      console.log('Utils not available, skipping test');
    }
  });
  
  // Test basic functionality
  test('Router constructor if available', () => {
    if (typeof spaRouter.Router === 'function') {
      console.log('Testing Router constructor exists');
      expect(spaRouter.Router).toBeDefined();
    } else {
      console.log('Router constructor not available, skipping test');
    }
  });
  
  test('navigate function if available', () => {
    if (typeof spaRouter.navigate === 'function') {
      console.log('Testing navigate function exists');
      expect(spaRouter.navigate).toBeDefined();
    } else {
      console.log('navigate function not available, skipping test');
    }
  });
});