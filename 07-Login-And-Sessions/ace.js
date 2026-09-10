#!/usr/bin/env node
const { spawn } = require('child_process');
const args = process.argv.slice(2);
if (args[0] === 'serve' && args.includes('--watch')) {
  spawn('node', ['--watch', 'server.js'], { stdio: 'inherit', shell: true });
  return;
}
console.log('Canopy Journal ace shim — try: node ace serve --watch');
