const fs = require('node:fs');
const path = require('node:path');

const pathToFile = path.join(__dirname, 'secret-folder');
fs.readdir(pathToFile, { withFileTypes: true }, (err, files) => {
  if (err) {
    console.log(err);
    return;
  }
  files.forEach((file) => {
    if (file.isFile()) {
      const filePath = path.join(pathToFile, file.name);
      fs.stat(filePath, (error, stats) => {
        if (err) {
          console.log(`Error with ${file.name}, ${error}`);
        } else {
          if (file.isFile()) {
            let lastDotIndex = file.name.lastIndexOf('.');
            console.log(
              `${file.name.slice(0, lastDotIndex)} - ${file.name.slice(
                lastDotIndex + 1,
              )} - ${stats.size} bytes`,
            );
          }
        }
      });
    }
  });
});
