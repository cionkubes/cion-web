const path = require("path");
const webpack = require("webpack");
const CircularDependencyPlugin = require('circular-dependency-plugin');
const CleanObsoleteChunks = require('webpack-clean-obsolete-chunks');

const CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin;
const UglifyJSPlugin = require("uglifyjs-webpack-plugin");
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const HtmlWebpackPlugin = require('html-webpack-plugin');

const debug = process.env.NODE_ENV !== "production";


const common_plugins = [
    new HtmlWebpackPlugin({
        title: "cion",
        filename: "../spa-entry.html",
        favicon: "res/favicon.ico",
        minify: {
            html5: true
        },
        cache: true
    }),
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
    new CircularDependencyPlugin({failOnError: true}),
    new CommonsChunkPlugin({
        name: 'app',
        children: true,
        minChunks: 2,
        async: true
    }),
    new BundleAnalyzerPlugin({
        analyzerMode: 'static',
        reportFilename: '../../reports/webpack-stats.html',
        openAnalyzer: false
    })
];

module.exports = {
    context: path.resolve(__dirname, "./src"),
    entry: {
        app: path.join("app.js")
    },
    output: {
        path: path.resolve(__dirname, "./lib/resources"),
        publicPath: "/resources/",
        filename: "[name]-[chunkhash:8].bundle.js"
    },
    resolve: {
        extensions: [
            ".js", ".scss", ".html"
        ],
        modules: [
            path.resolve(__dirname, './src'),
            "node_modules"
        ]
    },
    module: {
        loaders: [
            {
                test: /\.(svg|ico)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {}
                    }
                ]
            }, {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/
            }, {
                test: /((?!\.use).{4}|^.{0,3})\.scss$/,
                loaders: [
                    {loader: "style-loader"},
                    {loader: "css-loader"},
                    {loader: "sass-loader"}
                ]
            }, {
                test: /\.use\.scss$/,
                loaders: [
                    {loader: "style-loader/useable"},
                    {loader: "css-loader"},
                    {loader: "sass-loader"}
                ]
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
            })
        ])
};
