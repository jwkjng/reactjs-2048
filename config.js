var path = require('path');

module.exports = {
  webpack: {
    context: path.join(__dirname, 'src'),
    target: 'web',
    entry: './scripts/board.js',
    debug: true,
    watch: false,
    output: {
      filename: 'main.js',
      path: path.join(__dirname, 'dist', 'assets'),
      publicPath: '/assets/',
      chunkFilename: '[chunkhash].js'
    },
    resolve: {
      modulesDirectories: ['bower_components', 'node_modules']
    },
    module: {
      loaders: [
        { test: /\.js$/, loader: "jsx-loader" }
      ],
      noParse: /\.min\.js/
    }
  },
  webpackServer: {
    contentBase: path.join(__dirname, 'src')
  }
};
