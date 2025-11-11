#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-require-imports */
// generate-structure.cjs

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const OUTPUT_FILE = 'structure.txt';
const ROOT_DIR = process.cwd();

function isIgnored(relPath) {
  try {
    execSync(`git check-ignore -q -- "${relPath}"`, { stdio: 'ignore' });
    return true;
  } catch (e) {
    return e.status !== 1;
  }
}

function generateStructure() {
  const output = [];
  let folderCount = 0;  // Count of folders (excluding root)
  let fileCount = 0;    // Count of files

  function walk(dir, depth = 0) {
    const indent = '\t'.repeat(depth);
    const relativeDir = path.relative(ROOT_DIR, dir);
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    const dirs = [];
    const files = [];

    for (const ent of entries) {
      const item = ent.name;

      // Skip .git folder entirely
      if (item === '.git') continue;

      const isDir = ent.isDirectory();
      const relPath = path.join(relativeDir, item).replace(/\\/g, '/');
      const ignored = isIgnored(relPath) || (isDir && isIgnored(relPath + '/'));
      if (ignored) continue;

      if (isDir) {
        dirs.push(item);
        if (depth > 0) folderCount++; // Don't count root folder
      } else {
        files.push(item);
        fileCount++;
      }
    }

    // Sort case-insensitively (like VS Code)
    dirs.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
    files.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));

    // Output directories first
    for (const item of dirs) {
      output.push(`${indent}- /${item}`);
      walk(path.join(dir, item), depth + 1);
    }

    // Then files
    for (const item of files) {
      output.push(`${indent}- ${item}`);
    }
  }

  // Start walking from root (depth 0)
  walk(ROOT_DIR);

  // Append summary
  output.push(''); // blank line
  output.push(`folders: ${folderCount}`);
  output.push(`files: ${fileCount}`);

  // Write to file
  fs.writeFileSync(OUTPUT_FILE, output.join('\n') + '\n', 'utf-8');
  console.log(`Structure written to ${OUTPUT_FILE}`);
  console.log(`   ${folderCount} folders, ${fileCount} files`);
}

generateStructure();