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
    
    // Import all scripts in parallel
    const importPromises = scriptSources.map(src => {
      // Convert relative paths if needed
      const scriptPath = src.startsWith('/') ? src : `/${src}`;
      
      // Dynamically import the script
      return import(scriptPath)
        .catch(error => {
          console.error(`Error automatically importing script ${scriptPath}:`, error);
          return null; // Return null for failed imports
        });
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
  // We'll return this function to be called after the content is added to the DOM
  return function reexecuteInlineScripts(container) {
    // Find all script tags in the container
    const scripts = container.querySelectorAll('script');
    let count = 0;
    
    console.log(`Found ${scripts.length} scripts to process`);
    
    scripts.forEach(oldScript => {
      // Skip scripts with src attribute as they should load normally
      if (oldScript.hasAttribute('src')) {
        console.log('Skipping script with src attribute:', oldScript.getAttribute('src'));
        return;
      }
      
      count++;
      console.log(`Processing inline script ${count}`);
      
      // Create a new script element
      const newScript = document.createElement('script');
      
      // Copy all attributes from the old script
      [...oldScript.attributes].forEach(attr =>
        newScript.setAttribute(attr.name, attr.value)
      );
      
      // Copy the content
      newScript.textContent = oldScript.textContent;
      
      // Replace the old script with the new one
      // This will cause the browser to execute the script
      oldScript.replaceWith(newScript);
    });
    
    console.log(`Processed ${count} inline scripts`);
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