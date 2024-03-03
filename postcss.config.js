/* eslint-disable */
const purgecss = require('@fullhuman/postcss-purgecss')({
    content: [
        "./views/**/*.ejs"
    ],
    whitelist: [ "html", "body" ],
    defaultExtractor: (content) => content.match(/[^<>"'`\s]*[^<>"'`\s:]/g) || [], 
});

module.exports = {
    plugins: [
        require('tailwindcss'),
        require('autoprefixer'),
        require('cssnano')({
            preset: 'default',
        }),
        process.env.NODE_ENV.toLowerCase() == "production" ? purgecss : false,
    ]
  }
