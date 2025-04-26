/**
 * @profullstack/spa-router
 * A lightweight, feature-rich SPA router with smooth transitions and Shadow DOM support
 */

import Router from './router.js';
import * as transitions from './transitions.js';
import * as utils from './utils.js';

// Export the main components
export { Router, transitions, utils };

// Export a default object for UMD builds
export default {
  Router,
  transitions,
  utils
};