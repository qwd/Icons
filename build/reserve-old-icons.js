const fs = require('fs')
const path = require('path')

const file = {
  source: 'qweather-icons.json',
  output: 'old-qweather-icons.json'
}

function copyFile (file) {
  let sourceFile = path.join(__dirname, '../font/' + file.source)
  let outputFile = path.join(__dirname, '../font/' + file.output)

  fs.readFile(sourceFile, 'utf8', (err, data) => {
    if (err) {
      console.error('读取源文件时出错：', err);
      return;
    }

    fs.writeFile(outputFile, data, 'utf8', (err) => {});
  });
}

copyFile(file)
