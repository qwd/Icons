import {fileURLToPath} from 'node:url';
import path from 'node:path';
import fs from 'node:fs';
import chalk from 'chalk';
import {optimize, type Config, type XastElement, type XastParent} from 'svgo';
import {readAllFilesSync, writeFile} from '../utils/utils';

const [, , arg] = process.argv;
const keepFill = arg === 'keep-fill';
const currentFilePath = fileURLToPath(import.meta.url);
const currentFilename = path.basename(currentFilePath);
const currentFolderPath = path.dirname(currentFilePath);
const SvgFolderPath = path.resolve(currentFolderPath, '../icons/');

const SvgConfig:Config = {
  multipass: true,
  js2svg: {
    pretty: true,
    indent: 2,
    eol: 'lf'
  },
  plugins: [
    'removeUnknownsAndDefaults',
    'cleanupListOfValues',
    'sortAttrs',
    {
      name: 'removeAttrs',
      params: {attrs: ['clip-rule', 'data-name', keepFill ? 'svg:fill' : 'fill']}
    },
    {
      name: 'explicitAttrs',
      fn () {
        return {
          element: {
            enter (node:XastElement, parentNode:XastParent) {
              if (node.name === 'svg' && parentNode.type === 'root') {
                const standardAttrs = {
                  xmlns: 'http://www.w3.org/2000/svg',
                  fill: 'currentColor',
                  width: node.attributes['width'] || '16',
                  height: node.attributes['height'] || '16',
                  viewBox: node.attributes['viewBox'] || '0 0 16 16'
                };
                node.attributes = standardAttrs;
              }
            }
          }
        };
      }
    }
  ]
};

const processFile = (filepath:string) => {
  const originalSvg = fs.readFileSync(filepath, 'utf-8');
  const optimizedSvg = optimize(originalSvg, {...SvgConfig, path: filepath});
  writeFile(filepath, optimizedSvg.data);
};

const run = async () => {
  try {
    if (!fs.existsSync(SvgFolderPath)) {
      console.error(`❌ The input directory does not exist: ${SvgFolderPath}`);
      process.exit(1);
    }
    console.log(chalk.cyan(`[${currentFilename}] started`));
    const timeLabel = chalk.cyan(`[${currentFilename}] finished`);
    console.time(timeLabel);

    const files = readAllFilesSync(SvgFolderPath, 'svg');
    files.forEach(file => processFile(file.path));

    console.log(chalk.green('Success, %s icon%s prepared!'), files.length, files.length !== 1 ? 's' : '');
    console.timeEnd(timeLabel);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

run();
