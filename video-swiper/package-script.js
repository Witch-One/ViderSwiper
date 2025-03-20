import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import * as cheerio from 'cheerio';

// Get the current directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to the dist directory
const distDir = path.resolve(__dirname, 'dist');
const outputPath = path.resolve(__dirname, 'pkg.html');

// Function to read file content from a relative path in dist
function readFileFromDist(relativePath) {
  const fullPath = path.join(distDir, relativePath.replace(/^\//, ''));
  try {
    return fs.readFileSync(fullPath, 'utf8');
  } catch (error) {
    console.error(`Error reading file ${fullPath}:`, error);
    return '';
  }
}

// Main function
async function packageHtml() {
  try {
    // Read the index.html file
    const indexHtmlPath = path.join(distDir, 'index.html');
    const indexHtml = fs.readFileSync(indexHtmlPath, 'utf8');
    
    // Load the HTML using cheerio
    const $ = cheerio.load(indexHtml);
    
    // Find all CSS and JS files
    const cssLinks = [];
    const jsScripts = [];
    
    $('link[rel="stylesheet"]').each((_, element) => {
      const href = $(element).attr('href');
      if (href) {
        cssLinks.push(href);
      }
    });
    
    $('script[type="module"]').each((_, element) => {
      const src = $(element).attr('src');
      if (src) {
        jsScripts.push(src);
      }
    });
    
    // Get the body content
    const bodyContent = $('body').html();
    
    // Create the new HTML with inline CSS and JS
    let newHtml = '<body>\n';
    
    // Add inline CSS
    if (cssLinks.length > 0) {
      newHtml += '  <style>\n';
      for (const cssLink of cssLinks) {
        const cssContent = readFileFromDist(cssLink);
        newHtml += cssContent + '\n';
      }
      newHtml += '  </style>\n';
    }
    
    // Add the body content
    newHtml += bodyContent + '\n';
    
    // Add inline JS
    if (jsScripts.length > 0) {
      newHtml += '  <script>\n';
      for (const jsScript of jsScripts) {
        const jsContent = readFileFromDist(jsScript);
        newHtml += jsContent + '\n';
      }
      newHtml += '  </script>\n';
    }
    
    newHtml += '</body>';
    
    // Write the new HTML to pkg.html
    fs.writeFileSync(outputPath, newHtml);
    
    console.log(`Successfully created ${outputPath}`);
  } catch (error) {
    console.error('Error packaging HTML:', error);
  }
}

// Run the packaging function
packageHtml();
