/**
 * @profullstack/spa-router
 * A lightweight, feature-rich SPA router with smooth transitions and Shadow DOM support
 */

import Router from './router.js';
import * as transitions from './transitions.js';
import * as utils from './utils.js';
import * as renderer from './renderer.js';
import * as componentLoader from './component-loader.js';
import logger, { createLogger } from '../logger.js';

// Log module initialization
logger.info('Initializing spa-router module');

// Export the main components
export { Router, transitions, utils, renderer, componentLoader };

// Export logger for use in other module files
export { logger, createLogger };

// Export a default object for UMD builds
export default {
  Router,
  transitions,
  utils,
  renderer,
  componentLoader
};

// Log when the module is fully loaded
logger.debug('spa-router module fully loaded');