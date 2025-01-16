const fs = require('node:fs');
const path = require('node:path');

const pathToStylesFolder = path.join(__dirname, 'styles');
const resultFilePath = path.join(__dirname, 'project-dist/bundle.css');

const writeStream = fs.createWriteStream(resultFilePath);

fs.readdir(pathToStylesFolder, (err, files) => {
  if (err) {
    console.error(err);
    return;
  }
  files
    .filter((file) => path.extname(file) === '.css')
    .forEach((file) => {
      const filePath = path.join(pathToStylesFolder, file);
      const readStream = fs.createReadStream(filePath);

      readStream.pipe(writeStream, { end: false });
      readStream.on('end', () => writeStream.write('\n'));
    });
});
