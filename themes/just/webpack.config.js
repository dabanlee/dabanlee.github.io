const path = require('path');
const Copy = require('copy-webpack-plugin')
const ExtractCSS = require('mini-css-extract-plugin')

const configure = {
    entry: {
        app: path.resolve('source/app'),
    },
    output: {
        path: path.resolve('source/dist'),
        filename: `js/[name].js?[hash:8]`,
    },
    resolve: {
        extensions: ['.ts', '.js', '.json', '.scss'],
        alias: {
            '@src': path.resolve(__dirname, `src`),
            '@app': path.resolve(__dirname, `src/app`),
            '@common': path.resolve(__dirname, `src/common`),
            '@modules': path.resolve(__dirname, `src/modules`),
        },
    },
    module: {
        rules: [{
            test: /\.(js|mjs|jsx|ts|tsx)$/,
            exclude: /node_modules/,
            use: [{
                loader: require.resolve('ts-loader'),
                options: {
                    transpileOnly: true,
                },
            }],
        }, {
            test: /\.(scss|css)$/,
            use: [
                {
                    loader: ExtractCSS.loader,
                    options: {
                        publicPath: '../',
                    }
                },
                'css-loader',
                'postcss-loader',
            ],
        }, {
            test: /\.(mp3|mp4)$/,
            use: [{
                loader: `url-loader`,
                options: {
                    limit: 5120,
                    name: `medias/[name].[ext]?[hash:8]`,
                },
            }],
        }, {
            test: /\.(svg|png|gif|jpe?g)$/,
            use: [{
                loader: `url-loader`,
                options: {
                    limit: 5000,
                    name: `images/[name].[ext]?[hash:8]`,
                },
            }],
        }, {
            test: /\.(woff(2)?|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
            use: [{
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]',
                    outputPath: 'fonts/',
                    emitFile: false
                }
            }]
        }],
    },
    plugins: [
        new ExtractCSS({
            filename: `css/[name].css?[hash:8]`,
        }),
        new Copy([{
            from: path.resolve(__dirname, 'source/common/js/highlight.pack.js'),
            to: path.resolve(__dirname, 'source/dist/js/'),
        }, {
            from: path.resolve(__dirname, 'source/common/css/github.css'),
            to: path.resolve(__dirname, 'source/dist/css/'),
        }, {
            from: path.resolve(__dirname, 'source/common/css/github-gist.css'),
            to: path.resolve(__dirname, 'source/dist/css/'),
        }]),
        // new Copy([{
        //     from: path.resolve(__dirname, 'source/common/*'),
        //     to: path.resolve(__dirname, 'source/dist/'),
        // }]),
    ],
    devtool: 'cheap-module-source-map',
};

module.exports = configure;