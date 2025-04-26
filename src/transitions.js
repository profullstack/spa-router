/**
 * Transition effects for page changes
 */

/**
 * No transition effect
 * @returns {Function} Transition function
 */
export const none = () => {
  return async (oldContent, newContent, rootElement) => {
    rootElement.innerHTML = newContent;
    return Promise.resolve();
  };
};

/**
 * Fade transition effect
 * @param {Object} options - Transition options
 * @param {number} options.duration - Transition duration in ms
 * @returns {Function} Transition function
 */
export const fade = (options = {}) => {
  const duration = options.duration || 150;
  
  return async (oldContent, newContent, rootElement) => {
    return new Promise((resolve) => {
      // Create a full-screen overlay to hide everything during transition
      const transitionOverlay = document.createElement('div');
      transitionOverlay.className = 'transition-overlay';
      transitionOverlay.style.position = 'fixed';
      transitionOverlay.style.top = '0';
      transitionOverlay.style.left = '0';
      transitionOverlay.style.width = '100vw';
      transitionOverlay.style.height = '100vh';
      transitionOverlay.style.backgroundColor = 'var(--background-color, #ffffff)';
      transitionOverlay.style.zIndex = '9999';
      transitionOverlay.style.opacity = '0';
      transitionOverlay.style.transition = `opacity ${duration}ms ease-in-out`;
      
      // Add the overlay to the body
      document.body.appendChild(transitionOverlay);
      
      // Fade in the overlay
      setTimeout(() => {
        transitionOverlay.style.opacity = '1';
      }, 0);
      
      // Wait for the fade-in to complete
      setTimeout(() => {
        // Replace the content
        rootElement.innerHTML = newContent;
        
        // Fade out the overlay
        transitionOverlay.style.opacity = '0';
        
        // Remove the overlay after the transition completes
        setTimeout(() => {
          if (document.body.contains(transitionOverlay)) {
            document.body.removeChild(transitionOverlay);
          }
          resolve();
        }, duration);
      }, duration);
    });
  };
};

/**
 * Slide transition effect
 * @param {Object} options - Transition options
 * @param {string} options.direction - Slide direction ('left', 'right', 'up', 'down')
 * @param {number} options.duration - Transition duration in ms
 * @returns {Function} Transition function
 */
export const slide = (options = {}) => {
  const direction = options.direction || 'left';
  const duration = options.duration || 300;
  
  return async (oldContent, newContent, rootElement) => {
    return new Promise((resolve) => {
      // Create a container for the old content
      const oldContainer = document.createElement('div');
      oldContainer.style.position = 'absolute';
      oldContainer.style.top = '0';
      oldContainer.style.left = '0';
      oldContainer.style.width = '100%';
      oldContainer.style.height = '100%';
      oldContainer.style.transition = `transform ${duration}ms ease-in-out`;
      oldContainer.innerHTML = oldContent;
      
      // Create a container for the new content
      const newContainer = document.createElement('div');
      newContainer.style.position = 'absolute';
      newContainer.style.top = '0';
      newContainer.style.left = '0';
      newContainer.style.width = '100%';
      newContainer.style.height = '100%';
      newContainer.style.transition = `transform ${duration}ms ease-in-out`;
      newContainer.innerHTML = newContent;
      
      // Set initial positions
      let initialTransform = '';
      let finalTransform = '';
      
      switch (direction) {
        case 'left':
          initialTransform = 'translateX(100%)';
          finalTransform = 'translateX(-100%)';
          break;
        case 'right':
          initialTransform = 'translateX(-100%)';
          finalTransform = 'translateX(100%)';
          break;
        case 'up':
          initialTransform = 'translateY(100%)';
          finalTransform = 'translateY(-100%)';
          break;
        case 'down':
          initialTransform = 'translateY(-100%)';
          finalTransform = 'translateY(100%)';
          break;
      }
      
      newContainer.style.transform = initialTransform;
      
      // Clear the root element and add both containers
      rootElement.innerHTML = '';
      rootElement.style.position = 'relative';
      rootElement.style.overflow = 'hidden';
      rootElement.appendChild(oldContainer);
      rootElement.appendChild(newContainer);
      
      // Trigger the transition
      setTimeout(() => {
        oldContainer.style.transform = finalTransform;
        newContainer.style.transform = 'translateX(0)';
        
        // Clean up after the transition
        setTimeout(() => {
          rootElement.innerHTML = newContent;
          rootElement.style.position = '';
          rootElement.style.overflow = '';
          resolve();
        }, duration);
      }, 10);
    });
  };
};

/**
 * Custom transition effect
 * @param {Function} fn - Custom transition function
 * @returns {Function} Transition function
 */
export const custom = (fn) => {
  return async (oldContent, newContent, rootElement) => {
    return fn(oldContent, newContent, rootElement);
  };
};

export default {
  none,
  fade,
  slide,
  custom
};