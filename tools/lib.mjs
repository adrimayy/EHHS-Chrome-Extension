// Shared helpers for the developer tools. Node 18+, no packages needed.
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const rel = (...p) => path.join(ROOT, ...p);

// Runs the data files the same way the extension does and returns what they define.
export function loadData() {
  const ctx = vm.createContext({});
  for (const file of ['data/bells.js', 'data/calendar.js', 'data/links.js']) {
    try {
      vm.runInContext(fs.readFileSync(rel(file), 'utf8'), ctx, { filename: file });
    } catch (err) {
      console.error(`\n✗ ${file} has a typo: ${err.message}`);
      const where = String(err.stack).split('\n').find((l) => l.includes(file));
      if (where) console.error('  ' + where.trim());
      console.error('  Look for a missing comma, quote or bracket near there.\n');
      process.exit(1);
    }
  }
  return vm.runInContext('({ BELL_SCHEDULES, SCHOOL_YEARS, SUBJECTS, LINKS, MOVED_LINKS })', ctx);
}

export const red = (s) => `\x1b[31m${s}\x1b[0m`;
export const yellow = (s) => `\x1b[33m${s}\x1b[0m`;
export const green = (s) => `\x1b[32m${s}\x1b[0m`;
export const dim = (s) => `\x1b[2m${s}\x1b[0m`;
