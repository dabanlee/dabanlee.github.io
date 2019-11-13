const cssnano = require('cssnano')
const autoprefixer = require('autoprefixer')
const precss = require('precss')
const mixins = require('postcss-sassy-mixins')
const autoSize = require('postcss-background-image-auto-size')

const isProd = process.env.NODE_ENV === 'production'

const configure = {
    plugins: [
        autoprefixer(),
        mixins(),
        precss(),
        autoSize(),
    ],
}

if (isProd) configure.plugins.push(cssnano())

module.exports = configure