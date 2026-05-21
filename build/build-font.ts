import path from 'node:path';
import fs from 'node:fs';
import {fileURLToPath} from 'node:url';
import chalk from 'chalk';
import {getValidCodePoint, readAllFilesSync, ROOT_DIR, writeFile} from '../utils/utils';
import {SVGIcons2SVGFontStream} from 'svgicons2svgfont';
import svg2ttf from 'svg2ttf';
import ttf2woff from 'ttf2woff';
import ttf2woff2 from 'ttf2woff2';
import Handlebars from 'handlebars';

const currentFilePath = fileURLToPath(import.meta.url);
const currentFilename = path.basename(currentFilePath);

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

const convertSvgList:{code: string, name: string, unicode: string, fill: boolean, path: string}[] = [];

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
      convertSvgList.push({
        code: matched.code,
        name: matched.name,
        unicode: itemIcon.unicode,
        fill: matched.fill,
        path: matched.path
      });
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
    convertSvgList.push({
      code: itemSvgFile.code,
      name: itemSvgFile.name,
      unicode: unicode.toString(16),
      fill: itemSvgFile.fill,
      path: itemSvgFile.path
    });
  }
  const newQWeatherJson:QweatherIconsJson = {};
  for (const item of qweatherIconsList) {
    const key = `${item.code}${item.code !== item.name ? `-${item.name}` : ''}${item.fill ? '-fill' : ''}`;
    newQWeatherJson[key] = item;
  }
  writeFile(qweatherIconsJsonPath, JSON.stringify(newQWeatherJson, null, 2));

  convertSvgList.sort((a, b) => {
    const nameA = `${a.code}${a.name !== a.code ? `-${a.name}` : ''}${a.fill ? '-fill' : ''}`;
    const nameB = `${b.code}${b.name !== b.code ? `-${b.name}` : ''}${b.fill ? '-fill' : ''}`;
    if (nameB.startsWith(nameA + '-')) return -1;
    if (nameA.startsWith(nameB + '-')) return 1;
    return nameA.localeCompare(nameB, undefined, {numeric: true});
  });
};

const buildFonts = async () => {
  const svgFontBuffer = await new Promise<Buffer>((resolve, reject) => {
    const fontStream = new SVGIcons2SVGFontStream({
      fontName: SvgToFontOptions.fontName,
      fontHeight: 1000,
      normalize: true
    });

    const chunks: Buffer[] = [];
    fontStream.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
    fontStream.on('end', () => resolve(Buffer.concat(chunks)));
    fontStream.on('error', (err) => reject(err));

    (async () => {
      for (const icon of convertSvgList) {
        if (!fs.existsSync(icon.path)) {
          continue;
        }

        await new Promise<void>((subResolve, subReject) => {
          const glyphStream = fs.createReadStream(icon.path);
          const realUnicodeChar = String.fromCharCode(parseInt(icon.unicode, 16));
          const wordLigature = icon.fill && icon.code ? `${icon.code}-fill` : icon.code;

          (glyphStream as any).metadata = {
            name: icon.fill ? `${icon.code}-${icon.name}-fill` : `${icon.code}-${icon.name}`,
            unicode: [realUnicodeChar, wordLigature]
          };

          glyphStream.on('end', () => subResolve());
          glyphStream.on('error', (err) => subReject(err));

          fontStream.write(glyphStream);
        });
      }
      fontStream.end();
    })().catch((err) => {
      fontStream.destroy();
      reject(err);
    });
  });

  const fontsDirPath = `${SvgToFontOptions.output}/fonts`;

  // ttf
  const ttfResult = svg2ttf(svgFontBuffer.toString('utf8'), {});
  const ttfUint8Array = new Uint8Array(ttfResult.buffer);
  const ttfBuffer = Buffer.from(ttfUint8Array);
  const ttfPath = path.join(fontsDirPath, `${SvgToFontOptions.fontName}.ttf`);
  writeFile(ttfPath, ttfBuffer);

  // woff
  const woffUint8Array = ttf2woff(ttfBuffer, {});
  const woffBuffer = Buffer.from(woffUint8Array);
  const woffPath = path.join(fontsDirPath, `${SvgToFontOptions.fontName}.woff`);
  writeFile(woffPath, woffBuffer);

  // woff2
  const woff2Buffer = ttf2woff2(ttfBuffer);
  const woff2Path = path.join(fontsDirPath, `${SvgToFontOptions.fontName}.woff2`);
  writeFile(woff2Path, woff2Buffer);
};

const createCSS = () => {
  if (!fs.existsSync(SvgToFontOptions.cssTemplates)) {
    console.error(`❌ The cssTemplates file does not exist: ${SvgToFontOptions.cssTemplates}`);
    process.exit(1);
  }
  const classList = convertSvgList.map(item => {
    return `.${SvgToFontOptions.classNamePrefix}-${item.code}${item.fill ? `.${SvgToFontOptions.classNamePrefix}-fill` : ''}::before {content: "\\${item.unicode}";}`;
  });

  const templateSource = fs.readFileSync(SvgToFontOptions.cssTemplates, 'utf-8');
  const template = Handlebars.compile(templateSource, {noEscape: true});
  const content = template({
    fontName: SvgToFontOptions.fontName,
    classList: classList,
    timestamp: new Date().getTime(),
    prefix: SvgToFontOptions.classNamePrefix,
    suffix: 'fill'
  });

  writeFile(path.join(SvgToFontOptions.output, `${SvgToFontOptions.fontName}.css`), content);
};

const createDemoHTML = () => {
  if (!fs.existsSync(SvgToFontOptions.htmlTemplates)) {
    console.error(`❌ The htmlTemplates file does not exist: ${SvgToFontOptions.htmlTemplates}`);
    process.exit(1);
  }

  const templateSource = fs.readFileSync(SvgToFontOptions.htmlTemplates, 'utf-8');
  const template = Handlebars.compile(templateSource, {noEscape: true});
  const iconsList = convertSvgList.map(item => {
    return {
      className: `${SvgToFontOptions.classNamePrefix}-${item.code}${item.fill ? ` ${SvgToFontOptions.classNamePrefix}-fill` : ''}`,
      code: item.fill ? `${item.code}-fill` : item.code,
      label: item.code,
      unicode: item.unicode
    };
  });
  const content = template({iconsList, fontName: SvgToFontOptions.fontName});

  writeFile(path.join(SvgToFontOptions.output, `${SvgToFontOptions.fontName}.html`), content);
};

const SvgToFont = async () => {
  try {
    if (!fs.existsSync(SvgToFontOptions.entry)) {
      console.error(`❌ The input directory does not exist: ${SvgToFontOptions.entry}`);
      process.exit(1);
    }
    console.log(chalk.cyan(`[${currentFilename}] started`));
    const timeLabel = chalk.cyan(`[${currentFilename}] finished`);
    console.time(timeLabel);

    resetQweatherIconsJson();
    console.log(chalk.green(`📦 Successfully generated ${SvgToFontOptions.fontName}.json.`));

    await buildFonts();
    console.log(chalk.green(`📦 Successfully ${SvgToFontOptions.fontName}.ttf、${SvgToFontOptions.fontName}.woff、${SvgToFontOptions.fontName}.woff2.`));

    createCSS();
    console.log(chalk.green(`📦 Successfully ${SvgToFontOptions.fontName}.css.`));

    createDemoHTML();
    console.log(chalk.green(`📦 Successfully ${SvgToFontOptions.fontName}.html.`));

    console.timeEnd(timeLabel);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

SvgToFont();