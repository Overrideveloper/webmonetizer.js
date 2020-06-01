const debug = process.env.NODE_ENV !== 'production';
const webpack = require('webpack');
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CircularDependencyPlugin = require('circular-dependency-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
    entry: './src/index.tsx',
    output: {
        publicPath: '/',
        path: path.join(__dirname, 'build'),
        filename: 'js/[name].bundle.min.js',
        chunkFilename: 'js/[name].bundle.js'
    },
    devServer: {
        inline: true,
        contentBase: './src',
        port: 8080,
        historyApiFallback: true,
        host: '0.0.0.0'
    },
    devtool: debug ? 'cheap-module-eval-source-map' : false,
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx']
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx|ts|tsx)$/,
                exclude: /(node_modules)/,
                use: { loader: 'awesome-typescript-loader',}
            },
            {
                test: /\.(sa|sc|c)ss$/,
                use: debug ? ['style-loader', 'css-loader', 'sass-loader'] : [MiniCssExtractPlugin, 'css-loader', 'sass-loader'],
            },
            {
                test: /\.(eot|ttf|woff|woff2|otf|svg)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 100000,
                            name: './assets/fonts/[name].[ext]'
                        }
                    }
                ]
            },
            {
                test: /\.(gif|bmp|png|jpe?g)$/i,
                use: {
                    loader: 'file-loader',
                    options: {
                        outputPath: 'assets/images/'
                    }
                }
            }
        ]
    },
    plugins: debug ? [
        new CircularDependencyPlugin({
          // exclude detection of files based on a RegExp
          exclude: /a\.js|node_modules/,
          // add errors to webpack instead of warnings
          failOnError: true,
          // set the current working directory for displaying module paths
          cwd: process.cwd()
        }),
        new HtmlWebpackPlugin({
          template: "./src/index.html"
        })
    ] : [
        // define NODE_ENV to remove unnecessary code
        new webpack.DefinePlugin({
          "process.env.NODE_ENV": JSON.stringify("production")
        }),
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.optimize.AggressiveMergingPlugin(), // Merge chunks
        // extract imported css into own file
        new MiniCssExtractPlugin({
          // Options similar to the same options in webpackOptions.output
          // both options are optional
          filename: "[name].css",
          chunkFilename: "[id].css"
        }),
        new webpack.LoaderOptionsPlugin({
          minimize: true
        }),
        new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
        new HtmlWebpackPlugin({
          template: "./src/index.html"
          // minify: {
          //   collapseWhitespace: true,
          //   removeAttributeQuotes: false
          // }
        }),
        new CompressionPlugin({
          test: /\.(html|css|js|gif|svg|ico|woff|ttf|eot)$/,
          exclude: /(node_modules)/
        }),
        new BundleAnalyzerPlugin()
    ],
    optimization: {
        minimizer: [
            new TerserPlugin({
                cache: true,
                parallel: true,
                sourceMap: true, // Must be set to true if using source-maps in production
                terserOptions: {
                ie8: true,
                safari10: true,
                sourceMap: true
                }
            })
        ]
    }
}