import {fileURLToPath} from 'node:url';
import path from 'node:path';
import fs from 'node:fs';
import chalk from 'chalk';
import {load} from 'cheerio';
import {Config, loadConfig, optimize} from 'svgo';

// When usePathColor is true, the build svg will retain the fill attribute on the original file path
const usePathColor = false;
const currentFilePath = fileURLToPath(import.meta.url);
const currentFilename = path.basename(currentFilePath);
const currentFolderPath = path.dirname(currentFilePath);
const SvgFolderPath = path.join(currentFolderPath, '../icons/');

const svgAttributes = {
  xmlns: 'http://www.w3.org/2000/svg',
  width: '16',
  height: '16',
  fill: 'currentColor',
  class: '',
  viewBox: '0 0 16 16'
};

const processFile = (fileName:string, config:Config) => {
  const filepath = path.join(SvgFolderPath, fileName);
  const basename = path.basename(fileName, '.svg');

  const originalSvg = fs.readFileSync(filepath, 'utf-8');
  const $original = load(originalSvg, {xmlMode: true});
  const originalViewBox = $original('svg').attr('viewBox');
  svgAttributes.viewBox = originalViewBox ? originalViewBox : '0 0 16 16';
  const originalPathFillMap = new Map();
  if (usePathColor) {
    $original('svg').find('path').each((index, path) => {
      originalPathFillMap.set(`${index}-${path}`, $original(path).attr('fill'));
    });
  }

  const optimizedSvg = optimize(originalSvg, {...config, path: filepath});
  const $ = load(optimizedSvg.data, {xml: {xmlMode: true}});
  const $svgElement = $('svg');
  $svgElement.replaceWith($('<svg>').append());

  for (const [attribute, value] of Object.entries(svgAttributes)) {
    $svgElement.removeAttr(attribute);
    $svgElement.attr(attribute, attribute === 'class' ? `qi-${basename}` : value);
  }

  if (usePathColor && originalPathFillMap.size > 0) {
    $svgElement.find('path').each((index, path) => {
      if (originalPathFillMap.has(`${index}-${path}`)) {
        $(path).attr('fill', originalPathFillMap.get(`${index}-${path}`));
      }
    });
  }

  const resultSvg = $svgElement.toString().replace(/\r\n?/g, '\n');
  if (resultSvg !== originalSvg) {
    fs.writeFileSync(filepath, resultSvg, 'utf8');
  }
};

const run = async () => {
  try {
    console.log(chalk.cyan(`[${currentFilename}] started`));
    const timeLabel = chalk.cyan(`[${currentFilename}] finished`);
    console.time(timeLabel);

    const svgConfig = await loadConfig(path.join(currentFolderPath, '../svgo.config.js'));
    const files = fs.readdirSync(SvgFolderPath);

    files.forEach((file) => {
      if (path.extname(file) === '.svg') {
        processFile(file, svgConfig);
      }
    });

    console.log(chalk.green('\nSuccess, %s icon%s prepared!'), files.length, files.length !== 1 ? 's' : '');
    console.timeEnd(timeLabel);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

run();