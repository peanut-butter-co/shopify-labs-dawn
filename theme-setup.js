const tmpPath = `${__dirname}/tmp`; // Replace with the actual folder path you want to remove
const fs = require('fs');
const fsExtra = require('fs-extra');
const path = require('path');

updateTheme();

async function updateTheme() {
  await downloadRepo();

  const folderPath = './shopify'; // Replace with the actual folder path you want to remove
  try {
    // Remove the Shopify folder containing the old Dawn theme
    fs.rmdirSync(folderPath, { recursive: true });

    // Move the new Dawn theme to the Shopify folder
    fs.renameSync(`${tmpPath}/dawn-main`, `${__dirname}/shopify`);

    let sourceFolder = `${__dirname}/shopify/templates`; // Replace with the actual source folder path
    let destinationFolder = `${__dirname}/src/templates`; // Replace with the desired destination folder path
    fsExtra.copySync(sourceFolder, destinationFolder);

    const sourceFile = `${__dirname}/shopify/config/settings_data.json`; // Replace with the actual source folder path
    const destinationFile = `${__dirname}/src/config/settings_data.json`; // Replace with the desired destination folder path
    fsExtra.copySync(sourceFile, destinationFile);

    // remove files from src/static folder
    sourceFolder = `${__dirname}/src/static`;
    let files = fs.readdirSync(sourceFolder);
    files.forEach((file) => {
      const filePath = `${sourceFolder}/${file}`;
      fs.unlinkSync(filePath);
    });

    // remove files from src/scss/bundles folder
    sourceFolder = `${__dirname}/src/scss/bundles`;
    files = fs.readdirSync(sourceFolder);
    files.forEach((file) => {
      const filePath = `${sourceFolder}/${file}`;
      fs.unlinkSync(filePath);
    });

    // Move css files to src/scss folder and rename to scss
    sourceFolder = `${__dirname}/shopify/assets`; // Replace with the actual source folder path
    destinationFolder = `${__dirname}/src/scss/bundles`; // Replace with the desired destination folder path
    const extension = '.css'; // Replace with the desired file extension
    const newExtension = '.scss';
    files = fs.readdirSync(sourceFolder);
    files.forEach((file) => {
      const sourceFilePath = path.join(sourceFolder, file);
      if (path.extname(file) === extension) {
        const destinationFilePath = path.join(destinationFolder, file.replace(extension, newExtension));
        fs.renameSync(sourceFilePath, destinationFilePath);
      }
    });

    // Move other files from the assets folder to /src/static
    destinationFolder = `${__dirname}/src/static`; // Replace with the desired destination folder path
    files = fs.readdirSync(sourceFolder);
    files.forEach((file) => {
      const sourceFilePath = path.join(sourceFolder, file);
      const destinationFilePath = path.join(destinationFolder, file);
      fs.renameSync(sourceFilePath, destinationFilePath);
    });


    let searchValue = 'rgb(';
    let replaceValue = 'RGB(';
    sourceFolder = `${__dirname}/src/scss/bundles`;
    await searchAndReplace(sourceFolder, searchValue, replaceValue);

    searchValue = 'rgba(';
    replaceValue = 'RGBA(';
    await searchAndReplace(sourceFolder, searchValue, replaceValue);

    searchValue = 'minmax(';
    replaceValue = 'MINMAX(';
    await searchAndReplace(sourceFolder, searchValue, replaceValue);
  
    searchValue = 'min(';
    replaceValue = 'MIN(';
    await searchAndReplace(sourceFolder, searchValue, replaceValue);

    searchValue = 'max(';
    replaceValue = 'MAX(';
    await searchAndReplace(sourceFolder, searchValue, replaceValue);

    fsExtra.remove(tmpPath)
      .then(() => {
        console.log('Folder removed successfully!');
      })
      .catch((error) => {
        console.error('Error removing folder:', error);
      });
  } catch (error) {
    console.error('Error removing folder:', error);
  }
}

async function downloadRepo() {
  const downloadUrl = require('download')
  await downloadUrl('https://github.com/Shopify/dawn/archive/refs/heads/main.zip', 'tmp', { clone: true }, function (err) {
    console.log(err ? 'Error' : 'Success')
  })

  // reading archives
  const AdmZip = require("adm-zip");
  const zip = new AdmZip(`${tmpPath}/dawn-main.zip`);
  zip.extractAllTo(/*target path*/ tmpPath, /*overwrite*/ true);
}


const replaceText = async (filePath, searchValue, replaceValue) => {
  try {
    const fileContents = await fsExtra.readFile(filePath, 'utf-8');
    const updatedContents = fileContents.replace(searchValue, replaceValue);
    await fsExtra.writeFile(filePath, updatedContents, 'utf-8');
  } catch (error) {
    console.error(`Error replacing in file ${filePath}:`, error);
  }
};

const searchAndReplace = async (folderPath, searchValue, replaceValue) => {
  try {
    const files = await fsExtra.readdir(folderPath);

    for (const file of files) {
      const filePath = path.join(folderPath, file);
      const stat = await fsExtra.stat(filePath);

      if (stat.isFile()) {
        await replaceText(filePath, searchValue, replaceValue);
      } else if (stat.isDirectory()) {
        await searchAndReplace(filePath, searchValue, replaceValue);
      }
    }
  } catch (error) {
    console.error('Error searching and replacing:', error);
  }
};






