const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  target: 'web',
  entry: {
    'webmonetizer-js': './src/webmonetizer-js.ts'
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: '[name].js',
    library: 'WebMonetizerJS',
    libraryTarget: 'umd',
    globalObject: 'this',
    umdNamedDefine: true
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /(node_modules)/,
        loader: 'awesome-typescript-loader',
        query: {
            declaration: false
        }
      }
    ],
  },
  plugins: [
      new CopyPlugin({
        patterns: [
            { from: './package.slim.json', to: path.resolve(__dirname, './dist/package.json') },
            { from: './README.md', to: path.resolve(__dirname, './dist/README.md') }
        ]
      })
  ],
  resolve: {
    extensions: ['.ts', '.js'],
  }
};