const fs = require('node:fs');
const path = require('node:path');

const pathToDistFolder = path.join(__dirname, 'project-dist');
const pathToTemplateHTML = path.join(__dirname, 'template.html');
const pathToOutputHTML = path.join(pathToDistFolder, 'index.html');
const pathToStylesFolder = path.join(__dirname, 'styles');
const pathToStylesBundle = path.join(pathToDistFolder, 'style.css');
const pathToComponentsFolder = path.join(__dirname, 'components');
const pathToAssetsFolder = path.join(__dirname, 'assets');
const pathToNewAssetsFolder = path.join(__dirname, 'project-dist/assets');

//create folder
//replace tags with components
//compile styles
//copy assets

createFolder(pathToDistFolder, () => {
  compileHTML(
    pathToOutputHTML,
    pathToComponentsFolder,
    pathToTemplateHTML,
    () => {
      compileStyles(pathToStylesBundle, pathToStylesFolder, () => {
        createFolder(pathToNewAssetsFolder, () => {
          copyAssets(pathToNewAssetsFolder, pathToAssetsFolder);
        });
      });
    },
  );
});
function createFolder(folderPath, callback) {
  fs.rm(folderPath, { recursive: true, force: true }, (err) => {
    if (err) {
      console.error(err);
      return;
    }
    fs.mkdir(folderPath, { recursive: true }, (err) => {
      if (err) {
        console.error(err);
        return;
      }
    });
    if (callback) callback();
  });
}
function compileHTML(resultFilePath, pathToComponents, original, callback) {
  const readStream = fs.createReadStream(original, { encoding: 'utf-8' });
  const writeStream = fs.createWriteStream(resultFilePath);
  readStream.on('data', (data) => {
    const dataSliced = data.split('{{');
    writeStream.write(dataSliced[0]);
    for (let i = 1; i < dataSliced.length; i++) {
      let pieceSliced = dataSliced[i].split('}}');
      let componentName = pieceSliced[0].trim();
      const componentHTML = path.join(
        pathToComponents,
        `${componentName}.html`,
      );
      const pieceReadStream = fs.createReadStream(componentHTML, {
        encoding: 'utf-8',
      });
      pieceReadStream.on('data', (data) => {
        writeStream.write(data + '\n' + pieceSliced[1]);
      });
    }
  });
  if (callback) callback();
}
function compileStyles(resultFilePath, pathToStylesFolder, callback) {
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
    if (callback) callback();
  });
}
function copyAssets(resultFilePath, pathToAssets) {
  fs.readdir(pathToAssets, { withFileTypes: true }, (err, files) => {
    if (err) {
      console.error(err);
      return;
    }
    files.forEach((file) => {
      const fileOldPath = path.join(pathToAssets, file.name);
      const fileNewPath = path.join(resultFilePath, file.name);
      if (file.isFile()) {
        fs.copyFile(fileOldPath, fileNewPath, (err) => {
          if (err) {
            console.error(err);
            return;
          }
        });
      } else if (file.isDirectory()) {
        createFolder(fileNewPath, () => {
          copyAssets(fileNewPath, fileOldPath);
        });
      }
    });
  });
}
