const path = require('path');

module.exports = {
  mode: 'production',
  entry: path.resolve('src', 'app.ts'),
  output: {
    filename: 'bundle.js',
    path: path.resolve('dist'),
    clean: true,
  },
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
  plugins: [

  ]
};
