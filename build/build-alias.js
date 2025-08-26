import SvgToFont from  '../utils/index.js'
import path from "path";

const options = {
  src: path.resolve(process.cwd(), "icons"),
  dist: path.resolve(process.cwd(), "font"),
  fontsUrl: path.resolve(process.cwd(), "font/fonts"),
  styleTemplates: path.resolve(process.cwd(), "./to_font_utils/styles"),
  fontName: "qweather-icons",
  classNamePrefix: 'qi'
}

SvgToFont(options).then(() => {
  console.log("done!");
});
