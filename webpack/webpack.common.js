const path = require('path');
const htmlWebpackPlugin = require('html-webpack-plugin');
const cleanWebpackPlugin = require('clean-webpack-plugin');
module.exports = {
    entry: '../app/render/src/index.js',
    output: {
        filename: '[name].[contenthash:8].js',
        path: path.resolve(__dirname, 'dist')
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader',
                ]
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: [
                    'file-loader',
                ]
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                use: [
                    'file-loader'
                ]
            }
        ],
    },
    plugins: [
        new cleanWebpackPlugin(),
        new htmlWebpackPlugin({
            inject: false,
            template: require('html-webpack-template'),

            appMountId: 'root'
        }),
    ],
    optimization: {
        splitChunks: {
            chunks: 'all'
        }
    }
}