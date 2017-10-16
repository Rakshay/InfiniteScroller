const webpack = require('webpack');

var plugins = [];

plugins.push(new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/));

module.exports = env => {
  return {
    entry: [
      './assets/index.js'
    ],
    output: {
      filename: './assets/index.build.js'
    },
    module: {
      loaders: [{
        test: /\.(js)$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          cacheDirectory: true
        }
      }]
    },
    plugins:plugins,
    devtool: 'inline-source-map'
  };
};
