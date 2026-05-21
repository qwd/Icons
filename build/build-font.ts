import path from 'node:path';
import fs from 'node:fs';
import {getValidCodePoint, readAllFilesSync, ROOT_DIR, writeFile} from '../utils/utils';
interface QweatherIconsJson {
  [key: string]: {
    code: string,
    name: string,
    unicode: string,
    fill: boolean,
    deprecated?: boolean
  }
}

const SvgToFontOptions = {
  entry: path.resolve(ROOT_DIR, './icons'),
  output: path.resolve(ROOT_DIR, './font'),
  cssTemplates: path.resolve(ROOT_DIR, './templates/css/qweather-icons.hbs'),
  htmlTemplates: path.resolve(ROOT_DIR, './templates/html/qweather-icons.hbs'),
  fontName: 'qweather-icons',
  classNamePrefix: 'qi'
} as const;

const resetQweatherIconsJson = () => {
  const qweatherIconsJsonPath = path.resolve(SvgToFontOptions.output, `./${SvgToFontOptions.fontName}.json`);
  let qweatherIconsJson:QweatherIconsJson;
  if (fs.existsSync(qweatherIconsJsonPath)) {
    qweatherIconsJson = JSON.parse(fs.readFileSync(qweatherIconsJsonPath, 'utf-8'));
  } else {
    qweatherIconsJson = {};
  }
  const qweatherIconsList = Object.values(qweatherIconsJson);
  const svgFiles = readAllFilesSync(SvgToFontOptions.entry, 'svg');
  const svgFilesMap = new Map<string, {name: string, basename: string, path: string, code: string, fill: boolean}>();
  for (const svgFile of svgFiles) {
    svgFilesMap.set(`${svgFile.code}-${svgFile.fill}`, svgFile);
  }
  const matchedSvgKeysSet = new Set<string>();

  for (const itemIcon of qweatherIconsList) {
    const key = `${itemIcon.code}-${itemIcon.fill}`;
    const matched = svgFilesMap.get(key);

    if (!matched) {
      itemIcon.deprecated = true;
    } else {
      if ('deprecated' in itemIcon) {
        delete itemIcon.deprecated;
      }
      itemIcon.name = matched.name;
      matchedSvgKeysSet.add(key);
    }
  }
  const onlyInSvgFiles = svgFiles.filter(svgFile => matchedSvgKeysSet.has(`${svgFile.code}-${svgFile.fill}`) === false);
  for (const itemSvgFile of onlyInSvgFiles) {
    const unicode = getValidCodePoint(qweatherIconsList.map(item => parseInt(item.unicode, 16)));
    if (unicode === -1) {
      console.error('❌ no unicode');
      process.exit(1);
    }
    qweatherIconsList.push({
      code: itemSvgFile.code,
      name: itemSvgFile.name,
      unicode: unicode.toString(16),
      fill: itemSvgFile.fill
    });
  }
  const newQWeatherJson:QweatherIconsJson = {};
  for (const item of qweatherIconsList) {
    const key = `${item.code}${item.code !== item.name ? `-${item.name}` : ''}${item.fill ? '-fill' : ''}`;
    newQWeatherJson[key] = item;
  }
  writeFile(qweatherIconsJsonPath, JSON.stringify(newQWeatherJson, null, 2));
};

const SvgToFont = () => {
  try {
    if (!fs.existsSync(SvgToFontOptions.entry)) {
      console.error(`❌ The input directory does not exist: ${SvgToFontOptions.entry}`);
      process.exit(1);
    }
    resetQweatherIconsJson();

    // const allSvgFileList = readAllFilesSync(SvgToFontOptions.entry, 'svg');
    // console.log('allSvgFileList', allSvgFileList);
  // clearFolder(SvgToFontOptions.output);
  // createFolder(SvgToFontOptions.output);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

SvgToFont();