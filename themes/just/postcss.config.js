const cssnano = require('cssnano')
const autoprefixer = require('autoprefixer')
const precss = require('precss')
const scss = require('postcss-scss')
const mixins = require('postcss-sassy-mixins')
const autoSize = require('postcss-background-image-auto-size')

const isProd = process.env.NODE_ENV === 'production'
console.log(scss)
const configure = {
    parser: 'postcss-scss',
    plugins: [
        autoprefixer(),
        mixins(),
        precss(),
        autoSize(),
    ],
}

if (isProd) configure.plugins.push(cssnano())

module.exports = configure