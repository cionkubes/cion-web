const path = require("path");
const webpack = require("webpack");
const CircularDependencyPlugin = require('circular-dependency-plugin');
const CleanObsoleteChunks = require('webpack-clean-obsolete-chunks');

const CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin;
const UglifyJSPlugin = require("uglifyjs-webpack-plugin");
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const debug = process.env.NODE_ENV !== "production";

const common_plugins = [
    new ExtractTextPlugin("../styles.css"),
    new CleanObsoleteChunks(),
    new webpack.DefinePlugin({
        'process.env': {
            NODE_ENV: JSON.stringify(process.env.NODE_ENV)
        }
    }),
    new webpack.LoaderOptionsPlugin({
        minimize: !debug,
        debug: debug,
        sourceMap: debug
    }),
    new CircularDependencyPlugin({ failOnError: true }),
    new CommonsChunkPlugin({
        name: 'app',
        children: true,
        minChunks: 2,
        async: true
    }),
    new BundleAnalyzerPlugin({
        analyzerMode: 'static',
        reportFilename: '../../../../reports/webpack-stats.html',
        openAnalyzer: false
    })
];

module.exports = {
    context: path.resolve(__dirname, "./src/development"),
    entry: {
        app: path.join("scripts", "app.js")
    },
    output: {
        path: path.resolve(__dirname, "./src/www/resources/scripts"),
        publicPath: "/resources/scripts/",
        filename: "[name].bundle.js"
    },
    resolve: {
        extensions: [
            ".webpack.js", ".web.js", ".js"
        ],
        modules: [
            path.resolve(__dirname, './src/development'),
            "node_modules"
        ]
    },
    module: {
        loaders: [{
            test: /\.js$/,
            loader: 'babel-loader',
            exclude: /node_modules/,
            query: {
                presets: [
                    ['es2015', { modules: false, loose: true }]
                ]
            }
        }, {
            test: /\.scss$/,
            exclude: /node_modules/,
            loaders: ExtractTextPlugin.extract({
                fallback: "style-loader",
                use: [{
                    loader: "css-loader"
                }, {
                    loader: "sass-loader"
                }]
            })
        }]
    },
    devtool: debug ?
        'source-map' : false,
    plugins: debug ?
        common_plugins.concat([]) : common_plugins.concat([
            new UglifyJSPlugin({
                sourceMap: false,
                extractComments: true,
                uglifyOptions: {
                    ie8: false,
                    ecma: 5
                }
            }),
            new OptimizeCssAssetsPlugin({
                cssProcessorOptions: { discardComments: { removeAll: true } },
            })
        ])
};