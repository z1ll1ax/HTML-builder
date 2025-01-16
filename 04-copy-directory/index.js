const fs = require('node:fs');
const path = require('node:path');

const pathToOldFolder = path.join(__dirname, 'files');
fs.readdir(pathToOldFolder, { withFileTypes: true }, (err, files) => {
  if (err) {
    console.error(err);
    return;
  }
  if (files.length > 0) {
    const pathToNewFolder = path.join(__dirname, 'files-copy');
    fs.rm(pathToNewFolder, { recursive: true, force: true }, (err) => {
      if (err) {
        console.error(err);
        return;
      }
      fs.mkdir(pathToNewFolder, { recursive: true }, (err) => {
        if (err) {
          console.error(err);
          return;
        }
      });
      files.forEach((file) => {
        const fileOldPath = path.join(pathToOldFolder, file.name);
        const fileNewPath = path.join(pathToNewFolder, file.name);
        fs.copyFile(fileOldPath, fileNewPath, (err) => {
          if (err) {
            console.error(err);
            return;
          }
        });
      });
    });
  }
});
