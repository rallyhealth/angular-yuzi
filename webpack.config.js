var webpack = require('webpack');
var LivereloadPlugin = require('webpack-livereload-plugin');
var path = require('path');

module.exports = {
  entry: {
    yuzi: './src/yuzi.ts',
    vendor: ['angular', 'jquery', 'angular-translate']
  },
  output: {
    path: './build',
    filename: '[name].bundle.js'
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  module: {
    loaders: [{
      test: /\.ts$/,
      loader: 'ts-loader'
    }, {
      test: /\.styl$/,
      loader: 'style-loader!css-loader!stylus-loader'
    }, {
      test: /\.html$/,
      loader: 'ngtemplate-loader?relativeTo=' + path.resolve('./') + '!html-loader'
    }]
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({ name: 'vendor', filename: 'vendor.bundle.js' }),
    new webpack.HotModuleReplacementPlugin(),
    new LivereloadPlugin()
  ]
};
