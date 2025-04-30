/**
 * Component Loader Utility
 * 
 * Handles automatic detection and loading of web components from HTML content
 */

/**
 * Detects and imports module scripts from HTML content
 * @param {Document} doc - Parsed HTML document
 * @returns {Promise<string[]>} - Array of imported script paths
 */
export async function detectAndImportModules(doc) {
  // Extract script tags for automatic importing
  const scriptTags = Array.from(doc.body.querySelectorAll('script[type="module"]'));
  const scriptSources = scriptTags.map(script => script.getAttribute('src')).filter(src => src);
  
  if (scriptSources.length > 0) {
    console.log(`Found ${scriptSources.length} module scripts to import automatically:`, scriptSources);
    
    // Get the base URL of the current application
    const baseUrl = window.location.origin;
    console.log(`Base URL for script resolution: ${baseUrl}`);
    
    // Process all scripts
    const importPromises = scriptSources.map(src => {
      // Only use dynamic import for fully qualified external URLs (starting with http or https)
      if (src.startsWith('http://') || src.startsWith('https://')) {
        console.log(`Importing external module: ${src}`);
        // Dynamically import the external script
        return import(src)
          .catch(error => {
            console.error(`Error automatically importing external script ${src}:`, error);
            return null; // Return null for failed imports
          });
      } else {
        // For local scripts, create a script element with absolute URL and append it to the document
        // Convert the src to an absolute URL based on the current application's origin
        const absoluteSrc = src.startsWith('/')
          ? `${baseUrl}${src}`
          : `${baseUrl}/${src}`;
        
        console.log(`Loading local script with absolute URL: ${absoluteSrc}`);
        
        return new Promise((resolve, reject) => {
          const script = document.createElement('script');
          script.type = 'module';
          script.src = absoluteSrc;
          script.onload = () => {
            console.log(`Successfully loaded script: ${absoluteSrc}`);
            resolve();
          };
          script.onerror = (err) => {
            console.error(`Error loading local script ${absoluteSrc}:`, err);
            reject(err);
          };
          document.head.appendChild(script);
        }).catch(error => {
          console.error(`Error loading local script ${src}:`, error);
          return null;
        });
      }
    });
    
    // Wait for all imports to complete
    await Promise.all(importPromises);
    
    return scriptSources;
  }
  
  return [];
}

/**
 * Executes inline script tags from HTML content
 * @param {Document} doc - Parsed HTML document
 * @returns {Promise<number>} - Number of executed inline scripts
 */
/**
 * Execute inline scripts by replacing them with new script elements
 * This forces the browser to execute the scripts
 * @param {Document} doc - Parsed HTML document
 * @returns {number} - Number of executed inline scripts
 */
export async function executeInlineScripts(doc) {
  return function reexecuteInlineScripts(container) {
    // Execute inline scripts only (ignore scripts with src)
    const scripts = container.querySelectorAll('script:not([src])');
    let count = scripts.length;
    
    scripts.forEach(oldScript => {
      const newScript = document.createElement('script');
      [...oldScript.attributes].forEach(attr =>
        newScript.setAttribute(attr.name, attr.value)
      );
      newScript.textContent = oldScript.textContent;
      oldScript.replaceWith(newScript); // Maintains position in DOM
    });
    
    return count;
  };
}

/**
 * Filters out script tags from HTML content
 * @param {HTMLElement} element - Element to filter scripts from
 * @param {boolean} keepScripts - Whether to keep script tags in the output (default: false)
 * @returns {DocumentFragment} - Document fragment with scripts removed or preserved
 */
export function filterScriptTags(element, keepScripts = false) {
  const tempDiv = document.createElement('div');
  
  // Clone all child nodes, optionally excluding script tags
  Array.from(element.children).forEach(child => {
    if (keepScripts || child.tagName !== 'SCRIPT') {
      tempDiv.appendChild(child.cloneNode(true));
    }
  });
  
  return tempDiv;
}

export default {
  detectAndImportModules,
  executeInlineScripts,
  filterScriptTags
};