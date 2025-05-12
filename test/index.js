/**
 * Basic tests for @profullstack/spa-router
 */

import { expect } from 'chai';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('@profullstack/spa-router', function() {
  it('should have a package.json file', function() {
    const pkgPath = path.join(__dirname, '../package.json');
    expect(fs.existsSync(pkgPath)).to.be.true;
    
    const pkgContent = fs.readFileSync(pkgPath, 'utf8');
    const pkg = JSON.parse(pkgContent);
    expect(pkg).to.be.an('object');
    expect(pkg.name).to.equal('@profullstack/spa-router');
  });
  
  it('should have a src directory', function() {
    const srcDir = path.join(__dirname, '../src');
    expect(fs.existsSync(srcDir)).to.be.true;
  });
});