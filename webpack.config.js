const path = require('path');

module.exports = {
  mode: 'production',
  entry: './handler.ts',
  target: 'node',

  module: {
    rules: [{
      test: /\.ts(x?)$/,
      use: 'ts-loader',
    }, ],
  },

  resolve: {
    extensions: [
      '.ts',
      '.js',
      '.tsx',
      '.jsx',
    ],
  },

  output: {
    libraryTarget: 'commonjs',
    path: path.join(__dirname, '.build'),
    filename: 'handler.js',
  },

  devtool: 'source-map',
};