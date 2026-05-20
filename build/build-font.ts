import path from 'node:path';
import {fileURLToPath} from 'node:url';
import fs from 'node:fs';
import {clearFolder, createFolder, readAllFilesSync} from '../utils/utils';

//  npm run icons -- keep-fill true
interface QweatherIconsJson {
  [key: string]: {
    code: string,
    name: string,
    unicode: string,
    deprecated?: boolean
  }
}

const currentFilePath = fileURLToPath(import.meta.url);
const currentFolderPath = path.dirname(currentFilePath);

const codePointRanges = [[57344, 63743], [983040, 1048573], [1048576, 1114109]] as const;// Unicode 安全的三个专用区
const SvgToFontOptions = {
  entry: path.join(currentFolderPath, '../icons'), // Entry directory for SVG source files: Specifies the folder path where all icons (.svg) are stored.
  output: path.join(currentFolderPath, '../font'), // Output Directory: The generated font files (.ttf, .woff, .woff2, .css, .html, etc.) will be stored here.
  cssTemplates: path.join(currentFolderPath, '../templates/css/qweather-icons.hbs'), // CSS Generation Template: Use Handlebars (.hbs) templates to define the format of the final generated CSS/SCSS style files.
  htmlTemplates: path.join(currentFolderPath, '../templates/html/qweather-icons.hbs'), // HTML Preview Page Template: Generates a sample page, allowing developers to easily view all converted icons and their corresponding class names.
  fontName: 'qweather-icons', // Font Family Name: The font-family name defined in CSS.
  classNamePrefix: 'qi', // Style Class Name Prefix: The prefix used when generating CSS class names.
  fillSuffix: 'fill' // Solid Suffix: Used to identify which icons feature a solid style, enabling differentiation during class name generation or processing.
} as const;

const SvgToFont = () => {
  try {
    if (fs.existsSync(SvgToFontOptions.entry) === false) {
      return;
    }
    const qweatherIconsJsonPath = path.join(currentFolderPath, `../${SvgToFontOptions.fontName}.json`);
    let qweatherIconsJson:QweatherIconsJson | undefined;
    if (fs.existsSync(qweatherIconsJsonPath)) {
      qweatherIconsJson = JSON.parse(fs.readFileSync(qweatherIconsJsonPath, 'utf-8'));
    }
    const allSvgFileList = readAllFilesSync(SvgToFontOptions.entry, 'svg');
    console.log('allSvgFileList', allSvgFileList);
  // clearFolder(SvgToFontOptions.output);
  // createFolder(SvgToFontOptions.output);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

// SvgToFont();