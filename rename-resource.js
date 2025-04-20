const fs = require('fs');
const path = require('path');

/* ******************** REQUIRED CONFIGURATION ********************
   You MUST modify these 4 variables for the script to work.
   Example:
   const oldNameLower = 'product';    // Current lowercase name (filenames, folders)
   const newNameLower = 'schedule';   // New lowercase name
   const oldNameCapital = 'Product';  // Current capitalized name (class names)
   const newNameCapital = 'Schedule'; // New capitalized name
*******************************************************************/

const oldNameLower = '';    // TODO: Set current lowercase name
const newNameLower = '';    // TODO: Set new lowercase name
const oldNameCapital = '';  // TODO: Set current capitalized name
const newNameCapital = '';  // TODO: Set new capitalized name

// Validate required configuration
if (!oldNameLower || !newNameLower || !oldNameCapital || !newNameCapital) {
  console.error(`
[ERROR] Required configuration missing.
Please fill in all 4 required variables at the top of the script:
1. oldNameLower    - Current lowercase name
2. newNameLower    - New lowercase name
3. oldNameCapital  - Current capitalized name
4. newNameCapital  - New capitalized name

Example:
const oldNameLower = 'user';
const newNameLower = 'member';
const oldNameCapital = 'User';
const newNameCapital = 'Member';
`);
  process.exit(1);
}

const rootDir = path.resolve(__dirname, './src');

const allowedExtensions = [
  '.ts',
  '.spec.ts',
  '.dto.ts',
  '.entity.ts',
  '.module.ts',
  '.service.ts',
  '.controller.ts',
];

const directoriesToRename = [];

function processDirectory(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    if (entry.isFile()) {
      const fileExt = path.extname(entry.name);
      if (allowedExtensions.includes(fileExt)) {
        const oldFilePath = path.join(dir, entry.name);
        let content = fs.readFileSync(oldFilePath, 'utf-8');

        const updatedContent = content
          .replace(new RegExp(oldNameLower, 'g'), newNameLower)
          .replace(new RegExp(oldNameCapital, 'g'), newNameCapital);

        if (content !== updatedContent) {
          fs.writeFileSync(oldFilePath, updatedContent);
        }

        const newFileName = entry.name
          .replace(new RegExp(oldNameLower, 'g'), newNameLower)
          .replace(new RegExp(oldNameCapital, 'g'), newNameCapital);

        if (entry.name !== newFileName) {
          const newFilePath = path.join(dir, newFileName);
          fs.renameSync(oldFilePath, newFilePath);
          console.log(`Renamed file: ${oldFilePath} -> ${newFilePath}`);
        }
      }
    }
  }

  for (const entry of entries) {
    if (entry.isDirectory() && !entry.name.includes('node_modules')) {
      const fullPath = path.join(dir, entry.name);
      processDirectory(fullPath);

      if (
        entry.name.includes(oldNameLower) ||
        entry.name.includes(oldNameCapital)
      ) {
        directoriesToRename.push(fullPath);
      }
    }
  }
}

function renameDirectories() {
  directoriesToRename.sort((a, b) => b.length - a.length);

  for (const dirPath of directoriesToRename) {
    const newDirPath = dirPath
      .replace(new RegExp(oldNameLower, 'g'), newNameLower)
      .replace(new RegExp(oldNameCapital, 'g'), newNameCapital);

    if (dirPath !== newDirPath) {
      const parentDir = path.dirname(newDirPath);
      if (!fs.existsSync(parentDir)) {
        fs.mkdirSync(parentDir, { recursive: true });
      }

      fs.renameSync(dirPath, newDirPath);
      console.log(`Renamed directory: ${dirPath} -> ${newDirPath}`);
    }
  }
}

try {
  console.log('Starting resource renaming...');
  processDirectory(rootDir);
  renameDirectories();
  console.log(
    `\nResource renamed successfully:\n"${oldNameLower}" -> "${newNameLower}"\n"${oldNameCapital}" -> "${newNameCapital}"`,
  );
} catch (error) {
  console.error('Error while renaming resources:', error);
}
