import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export const ROOT_DIR = path.resolve(__dirname, '..');

/**
  * Recursively reads all files of a specific type within a directory.
  * @param dirPath The path to the target directory.
  * @param fileType The file extension (e.g., 'svg').
  */
export const readAllFilesSync = (dirPath:string, fileType:string):{name: string, basename: string, path: string, code: string, fill: boolean}[] => {
  if (fs.existsSync(dirPath) === false) {
    return [];
  }
  const direntList = fs.readdirSync(dirPath, {withFileTypes: true});

  const files = direntList.map(file => {
    if (file.isFile() === false) {
      return null;
    }
    const fullPath = path.resolve(dirPath, file.name);

    const ext = path.extname(fullPath);
    if (ext.toLowerCase() !== `.${fileType.toLowerCase()}`) {
      return null;
    }

    const basename = path.basename(fullPath, ext);

    const isFill = basename.endsWith('-fill');
    let code:string = '';
    let name :string = '';
    const basenameSplit = basename.split('-');
    if (basenameSplit.length === 0) {
      return null;
    } else if (basenameSplit.length === 1) {
      code = name = basename;
    } else if (basenameSplit.length === 2 && isFill) {
      code = name = basenameSplit[0];
    } else {
      code = basenameSplit[0];
      const endIndex = isFill ? -1 : undefined;
      const newArray = basenameSplit.slice(1, endIndex);
      name = newArray.join('-');
    }
    return {code: code, name: name, basename: basename, path: fullPath, fill: isFill};

  }).filter(item => item !== null);
  files.sort((a, b) => {
    const nameA = a.basename;
    const nameB = b.basename;
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

/**
  * Finds the first available (unused) valid code point within a preset range of Unicode code points.
  * @param oldPoints An array of code points that are already occupied.
  * @returns The first available code point (as a number); returns -1 if all code points in the range are occupied.
  */
export const getValidCodePoint = (oldPoints: number[]) => {
  const codePointRanges = [[57344, 63743], [983040, 1048573], [1048576, 1114109]];
  const oldPointsSet = new Set(oldPoints);
  for (const [start, end] of codePointRanges) {
    for (let i = start; i <= end; i++) {
      if (oldPointsSet.has(i) === false) {
        return i;
      }
    }
  }

  return -1;
};