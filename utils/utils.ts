import fs from 'node:fs';
import path from 'node:path';

/**
  * Determines whether a target value is defined and valid.
  *
  * This function checks not only for standard `null` and `undefined` values but also for their string representations: 'null' and 'undefined'.
  * It is commonly used when processing raw data obtained from configuration files, URL parameters, or command-line inputs.
  *
  * @param target - The target object or variable to be validated.
  * @param disableEmpty - Whether to treat empty strings as invalid. Defaults to `true`.
  *                     - If `true`: Returns `false` if `target` is "".
  *                     - If `false`: Returns `true` if `target` is "".
  *
  * @returns {boolean} Returns `true` if the variable is valid; otherwise, returns `false`.
  *
  * @example
  * define(null);               // false
  * define("undefined");        // false (String representations are also excluded)
  * define("");                 // false (By default)
  * define("", false);          // true  (Explicitly allows empty strings)
  * define(0);                  // true  (The number 0 is considered defined)
  */
export const define = <T>(target: any, disableEmpty: boolean = true): target is NonNullable<T> =>{
  const isDefined = target !== null && target !== undefined && typeof target !== 'undefined' && target !== 'null' && target !== 'undefined';

  if (isDefined === false) {
    return false;
  }

  if (disableEmpty && target === '') {
    return false;
  }

  return true;
};

/**
  * Recursively clears the contents of a specified folder and deletes the folder itself.
  *
  * This function executes synchronously:
  * 1. Checks if the target path exists.
  * 2. Iterates through and synchronously deletes all files within the folder (to prevent `rmdir` from throwing an error because the folder is not empty).
  * 3. Finally, deletes the folder itself.
  *
  * @param folderPath - The absolute path of the folder to be cleared.
  * @returns {void}
  */
export const clearFolder = (folderPath:string) => {
  if (fs.existsSync(folderPath)) {
    fs.readdirSync(folderPath).forEach((file) => {
      fs.unlinkSync(path.join(folderPath, file));
    });
    fs.rmdirSync(folderPath);
  }
};

/**
  * Creates a clean folder. If the folder already exists, it is cleared before being recreated.
  *
  * This function is commonly used during the initialization phase of a build process
  * to ensure that the output directory (e.g., `dist`) is pristine, thereby preventing
  * old build artifacts from interfering with the results of the current build.
  *
  * @param folderPath - The path to the target folder.
  * @returns {void}
  */
export const createFolder = (folderPath:string) => {
  if (fs.existsSync(folderPath)) {
    clearFolder(folderPath);
  }

  fs.mkdirSync(folderPath, {recursive: true});
};

/**
  * Recursively reads all files of a specific type within a directory.
  * @param dirPath The path to the target directory.
  * @param fileType The file extension (e.g., 'svg').
  */
export const readAllFilesSync = (dirPath:string, fileType?:string) => {
  if (fs.existsSync(dirPath) === false) {
    return [];
  }
  const direntList = fs.readdirSync(dirPath, {withFileTypes: true});

  const files:{name: string, basename: string, path: string}[] = direntList.map(item => {
    const fullPath = path.join(dirPath, item.name);
    if (item.isFile()) {
      if (path.extname(fullPath).toLowerCase() === `.${fileType}`) {
        return {code: item.name.split('-')[0], name: item.name, basename: item.name.replace(`.${fileType}`, ''), path: fullPath};
      }
    }
    return null;
  }).filter(item => define(item));
  files.sort((a, b) => {
    const nameA = a.name.replace(`.${fileType}`, '');
    const nameB = b.name.replace(`.${fileType}`, '');
    if (nameB.startsWith(nameA + '-')) return -1;
    if (nameA.startsWith(nameB + '-')) return 1;
    return nameA.localeCompare(nameB, undefined, {numeric: true});
  });
  return files;
};

/**
 * Write to a file
 * @param filePath Absolute path of the target file
 * @param content The new content to be written (string or Buffer)
 */
export const writeFile = (filePath: string, content: string | Buffer) => {
  const dirPath = path.dirname(filePath);
  if (fs.existsSync(dirPath) === false) {
    fs.mkdirSync(dirPath, {recursive: true});
  }

  fs.writeFileSync(filePath, content, 'utf-8');
};