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
export async function executeInlineScripts(doc) {
  // Extract inline script tags (those without src attribute)
  const inlineScripts = Array.from(doc.body.querySelectorAll('script'))
    .filter(script => !script.hasAttribute('src'));
  
  if (inlineScripts.length > 0) {
    console.log(`Found ${inlineScripts.length} inline scripts to execute`);
    
    // Execute each inline script in sequence
    for (const script of inlineScripts) {
      try {
        // Get the script content
        let scriptContent = script.textContent.trim();
        
        if (scriptContent) {
          // Replace DOMContentLoaded event listeners with immediate execution
          // This is needed because DOMContentLoaded has already fired in SPA context
          console.log('Checking for DOMContentLoaded event listeners in script');
          
          // More comprehensive regex to match various DOMContentLoaded patterns
          const domContentLoadedRegex = /document\.addEventListener\(['"]DOMContentLoaded['"],\s*((?:function\s*\([^)]*\)\s*\{[\s\S]*?\})|(?:\([^)]*\)\s*=>\s*\{[\s\S]*?\})|(?:[a-zA-Z_$][a-zA-Z0-9_$]*(?:\.[a-zA-Z_$][a-zA-Z0-9_$]*)*))/g;
          
          // Log the original script content for debugging
          console.log('Original script content:', scriptContent.substring(0, 100) + '...');
          
          // First, check if we have any matches
          const hasMatches = domContentLoadedRegex.test(scriptContent);
          console.log('DOMContentLoaded matches found:', hasMatches);
          
          // Reset regex lastIndex
          domContentLoadedRegex.lastIndex = 0;
          
          scriptContent = scriptContent.replace(
            domContentLoadedRegex,
            function(match, fnContent) {
              console.log('Found DOMContentLoaded match:', match.substring(0, 50) + '...');
              console.log('Function content:', fnContent.substring(0, 50) + '...');
              
              // If it's a named function reference, we need to call it directly
              if (/^[a-zA-Z_$][a-zA-Z0-9_$]*(?:\.[a-zA-Z_$][a-zA-Z0-9_$]*)*$/.test(fnContent)) {
                console.log('Converting named function DOMContentLoaded to immediate execution');
                return `/* Converted from DOMContentLoaded */ (${fnContent})();`;
              }
              
              // For anonymous functions or arrow functions
              console.log('Converting anonymous/arrow function DOMContentLoaded to immediate execution');
              return `/* Converted from DOMContentLoaded */ (function() {
                try {
                  ${fnContent.replace(/^\s*function\s*\([^)]*\)\s*\{|\(\s*\)\s*=>\s*\{|\{/, '').replace(/\}\s*$/, '')}
                } catch(e) {
                  console.error('Error executing converted DOMContentLoaded handler:', e);
                }
              })();`;
            }
          );
          
          // Also handle any remaining DOMContentLoaded listeners with event parameter
          const domContentLoadedWithEventRegex = /document\.addEventListener\(['"]DOMContentLoaded['"],\s*(?:function\s*\(\s*(?:e|event|evt)\s*\)\s*\{([\s\S]*?)\}|(?:\(\s*(?:e|event|evt)\s*\)\s*=>\s*\{([\s\S]*?)\}))/g;
          
          scriptContent = scriptContent.replace(
            domContentLoadedWithEventRegex,
            function(match, fn1, fn2) {
              const fnBody = fn1 || fn2;
              if (fnBody) {
                console.log('Converting DOMContentLoaded with event parameter to immediate execution');
                return `/* Converted from DOMContentLoaded with event */ (function() {
                  try {
                    // Create a mock event object
                    const event = new Event('DOMContentLoaded');
                    ${fnBody}
                  } catch(e) {
                    console.error('Error executing converted DOMContentLoaded handler with event:', e);
                  }
                })();`;
              }
              return match;
            }
          );
          
          // Create a new script element to execute the code in the global context
          const newScript = document.createElement('script');
          
          // Copy attributes from the original script
          Array.from(script.attributes).forEach(attr => {
            if (attr.name !== 'src') { // Skip src attribute if it exists
              newScript.setAttribute(attr.name, attr.value);
            }
          });
          
          newScript.textContent = scriptContent;
          document.head.appendChild(newScript);
          
          // Remove the script after execution to prevent memory leaks
          setTimeout(() => {
            document.head.removeChild(newScript);
          }, 0);
        }
      } catch (error) {
        console.error('Error executing inline script:', error);
      }
    }
    
    return inlineScripts.length;
  }
  
  return 0;
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