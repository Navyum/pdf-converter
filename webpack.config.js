var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');

var SOURCE_DIR = path.resolve(__dirname, 'src');
var JAVASCRIPT_DIR = SOURCE_DIR + '/javascript';
var BUILD_DIR = path.resolve(__dirname, 'build');
var NODEMODULES_DIR = path.resolve(__dirname, 'node_modules');

module.exports = {
    mode: 'development', 
    context: SOURCE_DIR,
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx'],
        modules: [
            path.resolve(JAVASCRIPT_DIR),
            path.resolve('./node_modules')
        ]
    },
    entry: {
        app: './javascript/index.tsx'
    },
    output: {
        path: BUILD_DIR,
        filename: 'bundle.js',
        publicPath: '/'
    },
    module: {
        rules: [
            {
                test: /\.(ts|tsx)$/,
                use: {
                    loader: 'ts-loader',
                    options: {
                        transpileOnly: true
                    }
                },
                exclude: /node_modules/,
            },
            {
                test: /\.(js|jsx)$/,
                loader: 'babel-loader',
                include: [JAVASCRIPT_DIR],
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.(png|jpg|svg|woff|woff2|ttf|eot)$/,
                type: 'asset/resource'
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: 'index.html'
        }),
        new webpack.DefinePlugin({
            'process.env': {
                'version': JSON.stringify(process.env.npm_package_version),
                NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'development')
            }
        }),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: NODEMODULES_DIR + '/pdfjs-dist/build/pdf.worker.js',
                    to: 'bundle.worker.js'
                },
                {
                    from: NODEMODULES_DIR + '/pdfjs-dist/cmaps',
                    to: 'cmaps'
                },
                {
                    from: 'favicons',
                    to: 'favicons'
                },
                {
                    from: path.resolve(__dirname, 'CNAME'),
                    to: '[name][ext]'
                }
            ]
        })
    ],
    devServer: {
        static: {
            directory: BUILD_DIR,
        },
        hot: true,
        port: 8080,
        open: true,
        historyApiFallback: true,
        compress: true,
        client: {
            overlay: {
                errors: true,
                warnings: false,
            },
        },
    },
    stats: {
        errorDetails: true
    }
};
