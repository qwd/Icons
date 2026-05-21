
import path from 'node:path';
import fs from 'node:fs';
import chalk from 'chalk';
import {readAllFilesSync, ROOT_DIR, writeFile} from '../utils/utils';
import SVGSpriter from 'svg-sprite';

const INPUT_DIR = path.resolve(ROOT_DIR, './icons/');
const OUTPUT_DIR = ROOT_DIR;

const spriteSvgName = 'qweather-icons.svg';
const spriter = new SVGSpriter({
  dest: OUTPUT_DIR,
  mode: {
    symbol: {
      dest: '.',
      sprite: spriteSvgName
    }
  },
  svg: {
    namespaceClassnames: false,
    xmlDeclaration: false
  }
});

const addSvgFileToSprite = (filePath:string, id:string) => {
  const svgContent = fs.readFileSync(filePath, 'utf-8');
  const virtualFilePath = path.resolve(INPUT_DIR, `${id}.svg`);
  spriter.add(virtualFilePath, `${id}.svg`, svgContent);
};

const run = async () => {
  try {
    if (!fs.existsSync(INPUT_DIR)) {
      console.error(`❌ The input directory does not exist: ${INPUT_DIR}`);
      process.exit(1);
    }
    const files = readAllFilesSync(INPUT_DIR, 'svg');

    files.forEach(file => addSvgFileToSprite(file.path, `${file.code}${file.fill ? '-fill' : ''}`));
    console.log(chalk.green(`📦 Successfully loaded ${files.length} basic SVG icons.`));

    const {result} = await spriter.compileAsync();
    const resultFile = result.symbol.sprite;
    writeFile(resultFile.path, resultFile.contents);
    console.log(chalk.green(`📦 Successfully generated: ${spriteSvgName}`));
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

run();