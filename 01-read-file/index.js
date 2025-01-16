let fs = require('node:fs');
const path = require('node:path');

const pathToFile = path.join(__dirname, 'text.txt');

const readStream = fs.createReadStream(pathToFile, { encoding: 'utf8' });

readStream.on('data', (data) => {
    console.log(data);
})