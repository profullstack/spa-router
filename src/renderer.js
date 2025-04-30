/**
 * Enhanced renderer for SPA Router
 * Provides component preservation and translation support
 */
import { extractModuleScriptSources, executeInlineScripts, filterScriptTags } from './component-loader.js';

/**
 * Create a content renderer that handles translations and component preservation
 * @param {Object} options - Renderer options
 * @param {Function} options.translateContainer - Function to translate a container
 * @param {Function} options.applyRTLToDocument - Function to apply RTL direction to document
 * @param {Boolean} options.handleScripts - Whether to handle scripts in content (default: true)
 * @param {Boolean} options.keepScripts - Whether to keep script tags in the output (default: false)
 * @returns {Function} Renderer function
 */
export function createRenderer(options = {}) {
  const translateContainer = options.translateContainer || ((container) => {});
  const applyRTLToDocument = options.applyRTLToDocument || (() => {});
  const handleScripts = options.handleScripts !== false; // Default to true
  const keepScripts = options.keepScripts === true; // Default to false

  return async (content, element) => {
    // Create a new container with absolute positioning (off-screen)
    const newContainer = document.createElement('div');
    newContainer.style.position = 'absolute';
    newContainer.style.top = '0';
    newContainer.style.left = '0';
    newContainer.style.width = '100%';
    newContainer.style.height = '100%';
    newContainer.style.opacity = '0'; // Start hidden
    newContainer.style.zIndex = '1'; // Above the current content
    
    // Parse the content into DOM
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, 'text/html');
    
    // Handle scripts if enabled
    let scriptExecutor;
    let moduleScripts = [];
    if (handleScripts) {
      // Extract module scripts but don't execute them yet
      // We'll store them to execute after the DOM is updated
      moduleScripts = extractModuleScriptSources(doc);
      
      // Get the script executor function to be called after content is added to DOM
      scriptExecutor = await executeInlineScripts(doc);
      
      // Only filter out script tags if keepScripts is false
      if (!keepScripts) {
        // Filter out script tags from the content
        const bodyWithoutScripts = filterScriptTags(doc.body, false);
        doc.body.innerHTML = bodyWithoutScripts.innerHTML;
      } else {
        console.log('Keeping script tags in content as requested');
      }
    }
    
    // Get all existing web components in the current DOM to preserve
    const existingComponents = {};
    const customElements = element.querySelectorAll('*').filter(el => el.tagName.includes('-'));
    
    customElements.forEach(el => {
      const id = el.tagName.toLowerCase();
      existingComponents[id] = el;
    });
    
    // Process the new content
    Array.from(doc.body.children).forEach(child => {
      // If it's a custom element that already exists, skip it (we'll keep the existing one)
      if (child.tagName.includes('-') && existingComponents[child.tagName.toLowerCase()]) {
        console.log(`Preserving existing component: ${child.tagName.toLowerCase()}`);
      } else {
        // Otherwise, add the new element to the container
        newContainer.appendChild(child);
      }
    });
    
    // Translate all text in new DOM
    if (translateContainer) {
      translateContainer(newContainer);
    }
    
    // Add preserved components back to the new container
    Object.values(existingComponents).forEach(component => {
      newContainer.appendChild(component);
    });
    
    // Add the new container to the DOM
    element.appendChild(newContainer);
    
    // Apply RTL direction if needed
    if (applyRTLToDocument) {
      applyRTLToDocument();
    }
    
    // Short delay to ensure everything is ready, then show new content and remove old
    setTimeout(() => {
      // Remove all old content
      Array.from(element.children).forEach(child => {
        if (child !== newContainer) {
          element.removeChild(child);
        }
      });
      
      // Show the new content by changing position and opacity
      newContainer.style.position = 'relative';
      newContainer.style.opacity = '1';
      
      // Execute inline scripts if we have a script executor
      if (scriptExecutor) {
        console.log('Executing inline scripts');
        scriptExecutor(newContainer);
      }
      
      // Now that the DOM is updated, import and execute module scripts
      if (moduleScripts.length > 0) {
        console.log('Importing module scripts after DOM update');
        
        // Get the base URL of the current application
        const baseUrl = window.location.origin;
        
        // Import each module script
        moduleScripts.forEach(src => {
          // Create a new script element
          const script = document.createElement('script');
          script.type = 'module';
          
          // Convert to absolute URL if needed
          if (src.startsWith('http://') || src.startsWith('https://')) {
            script.src = src;
          } else {
            // For local scripts, create absolute URL based on current origin
            const absoluteSrc = src.startsWith('/')
              ? `${baseUrl}${src}`
              : `${baseUrl}/${src}`;
            script.src = absoluteSrc;
          }
          
          console.log(`Loading module script: ${script.src}`);
          document.head.appendChild(script);
        });
      }
      
      // Dispatch a custom event to notify that the SPA transition is complete
      window.dispatchEvent(new CustomEvent('spa-transition-end'));
    }, 50);
  };
}

/**
 * Create a default error handler
 * @param {Object} options - Error handler options
 * @returns {Function} Error handler function
 */
export function createErrorHandler(options = {}) {
  return (path) => {
    return `
      <div class="error-page">
        <h1>404 - Page Not Found</h1>
        <p>The page "${path}" could not be found.</p>
        <a href="/" class="back-link">Go back to home</a>
      </div>
    `;
  };
}

export default {
  createRenderer,
  createErrorHandler
};