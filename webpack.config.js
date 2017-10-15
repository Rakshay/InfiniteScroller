module.exports = env => {
  return {
    entry: [
      './example/index.js'
    ],
    output: {
      filename: './example/index.build.js'
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
    devtool: 'inline-source-map'
  };
};
