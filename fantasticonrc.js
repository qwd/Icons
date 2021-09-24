module.exports = {
    inputDir: './icons', // (required)
    outputDir: './font', // (required)
    fontTypes: ['woff2', 'woff', 'ttf'],
    assetTypes: ['css', 'json', 'html'],
    name: 'qweather-icons',
    codepoints: {},
    prefix: 'qi',
    selector: '.qi',
    fontsUrl: './fonts',
    formatOptions: {
        json: {
            indent: 2
        }
    },
    // Use a custom Handlebars template
    templates: {
        css: './build/font/css.hbs',
        html: './build/font/html.hbs'
    },
    pathOptions: {
        json: './font/qweather-icons.json',
        css: './font/qweather-icons.css',
        html: './font/demo.html',
        ttf: './font/fonts/qweather-icons.ttf',
        woff: './font/fonts/qweather-icons.woff',
        woff2: './font/fonts/qweather-icons.woff2',
    }
};
