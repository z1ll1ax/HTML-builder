const fs = require('node:fs');
const path = require('node:path');
const process = require('node:process');
const readline = require('node:readline');

const pathToFile = path.join(__dirname, 'text.txt');

const writeStream = fs.createWriteStream(pathToFile, { flags: 'w' });

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

console.log('Hi! Enter a text to write into a file or type "exit" to quit.');

rl.on('line', (input) => {
  if (input === 'exit') {
    process.exit();
  } else {
    writeStream.write(input + '\n');
  }
});

process.on('SIGINT', () => {
  process.exit();
});

process.on('exit', () => {
  writeStream.end();
});
