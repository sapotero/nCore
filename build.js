var path = require('path');
var webpack = require('webpack');
var config = {
  context: path.join(__dirname, './assets/js'),
  entry: {
    index: './application'
  },
  output: {
    path: path.join(__dirname, './assets/build/'),
    filename: 'application.min.js'
  },
  // plugins: [
  //   new webpack.optimize.UglifyJsPlugin({
  //     include: /\.min\.js$/,
  //     minimize: true
  //   })
  // ]
};
var compiler = webpack(config);
compiler.run(function (err, stats) {
  
  console.log( err, stats.toJson() );
});