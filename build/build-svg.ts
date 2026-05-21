import path from 'node:path';
import fs from 'node:fs';
import chalk from 'chalk';
import {optimize, type Config, type XastElement, type XastParent} from 'svgo';
import {readAllFilesSync, ROOT_DIR, writeFile} from '../utils/utils';

const [, , arg] = process.argv;
const keepFill = arg === 'keep-fill';
const INPUT_DIR = path.resolve(ROOT_DIR, './icons/');

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
    if (!fs.existsSync(INPUT_DIR)) {
      console.error(`❌ The input directory does not exist: ${INPUT_DIR}`);
      process.exit(1);
    }

    const files = readAllFilesSync(INPUT_DIR, 'svg');
    files.forEach(file => processFile(file.path));

    console.log(chalk.green('Success, %s icon%s prepared!'), files.length, files.length !== 1 ? 's' : '');
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

run();
