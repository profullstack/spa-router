/**
 * Basic usage example for @profullstack/spa-router
 */

import { Router, transitions } from '../dist/index.esm.js';

// Initialize router with fade transition
const router = new Router({
  rootElement: '#app',
  transition: transitions.fade({ duration: 150 }),
  errorHandler: (path) => `
    <div class="error-page">
      <h1>404 - Page Not Found</h1>
      <p>The page "${path}" could not be found.</p>
      <a href="/" class="back-link">Go back to home</a>
    </div>
  `
});

// Define routes
router.registerRoutes({
  '/': {
    view: () => `
      <div class="page home-page">
        <h1>Home Page</h1>
        <p>Welcome to the SPA Router example!</p>
        <nav>
          <a href="/about">About</a>
          <a href="/users">Users</a>
        </nav>
      </div>
    `
  },
  '/about': {
    view: () => `
      <div class="page about-page">
        <h1>About Page</h1>
        <p>This is a simple SPA router with smooth transitions.</p>
        <a href="/">Back to Home</a>
      </div>
    `
  },
  '/users': {
    view: () => `
      <div class="page users-page">
        <h1>Users Page</h1>
        <p>List of users:</p>
        <ul>
          <li><a href="/users/1">User 1</a></li>
          <li><a href="/users/2">User 2</a></li>
          <li><a href="/users/3">User 3</a></li>
        </ul>
        <a href="/">Back to Home</a>
      </div>
    `
  },
  '/users/:id': {
    view: (params) => `
      <div class="page user-page">
        <h1>User Profile</h1>
        <p>User ID: ${params.id}</p>
        <a href="/users">Back to Users</a>
      </div>
    `
  },
  '/admin': {
    view: () => `
      <div class="page admin-page">
        <h1>Admin Dashboard</h1>
        <p>Welcome to the admin dashboard!</p>
        <a href="/">Back to Home</a>
      </div>
    `,
    beforeEnter: (to, from, next) => {
      // Check if user is authenticated
      const isAuthenticated = localStorage.getItem('authenticated') === 'true';
      
      if (!isAuthenticated) {
        alert('You must be logged in to access the admin page');
        return next('/');
      }
      
      next();
    }
  }
});

// Add middleware for logging
router.use(async (to, from, next) => {
  console.log(`Navigating from ${from || 'initial'} to ${to.path}`);
  next();
});

// Expose router globally for debugging
window.router = router;

// Add login/logout buttons for testing the admin route
document.addEventListener('DOMContentLoaded', () => {
  const loginButton = document.createElement('button');
  loginButton.textContent = 'Login';
  loginButton.style.position = 'fixed';
  loginButton.style.top = '10px';
  loginButton.style.right = '80px';
  loginButton.addEventListener('click', () => {
    localStorage.setItem('authenticated', 'true');
    alert('You are now logged in');
  });
  
  const logoutButton = document.createElement('button');
  logoutButton.textContent = 'Logout';
  logoutButton.style.position = 'fixed';
  logoutButton.style.top = '10px';
  logoutButton.style.right = '10px';
  logoutButton.addEventListener('click', () => {
    localStorage.removeItem('authenticated');
    alert('You are now logged out');
  });
  
  const adminButton = document.createElement('button');
  adminButton.textContent = 'Admin';
  adminButton.style.position = 'fixed';
  adminButton.style.top = '10px';
  adminButton.style.right = '150px';
  adminButton.addEventListener('click', () => {
    router.navigate('/admin');
  });
  
  document.body.appendChild(loginButton);
  document.body.appendChild(logoutButton);
  document.body.appendChild(adminButton);
});