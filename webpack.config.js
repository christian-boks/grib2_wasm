'use strict';

let path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

const config = {
    devServer: {
        devMiddleware: {
            writeToDisk: true
        },
        static: path.join(__dirname, 'dist'),
        compress: true,
        port: 9000,
        hot: false,
        client: {
            overlay: {
                errors: true,
                warnings: false,
            },
        }
    },
    devtool: 'inline-source-map',
    mode: "development",
    entry: {
        app: './src/main.ts'
    },
    output: {
        path: path.join(__dirname, 'dist'),
        publicPath: '',
        filename: '[name].[chunkhash].js',
        clean: true,
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: 'src/index.html',
        }),
        new CopyPlugin([
            { from: 'data/HARMONIE_DINI_SF_12_5.grib', to: 'HARMONIE_DINI_SF_12_5.grib', toType: "file" },
        ])
    ],
    module: {
        rules: [
            {
                test: /\.html$/,
                loader: 'html-loader'
            },
            {
                test: /\.ts?$/,
                loader: 'ts-loader'
            },
        ]
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js']
    }
};

module.exports = config;