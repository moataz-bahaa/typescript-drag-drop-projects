const path = require('path');

module.exports = {
  mode: 'development',
  entry: path.resolve('src', 'app.ts'),
  output: {
    filename: 'bundle.js',
    path: path.resolve('dist'),
    clean: true,
    publicPath: 'dist'
  },
  // devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
};
