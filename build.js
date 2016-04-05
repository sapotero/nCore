var path = require('path');
var webpack = require('webpack');
var config = {
  context: path.join(__dirname, 'app/assets/js'),
  entry: {
    index: './application'
  },
  output: {
    path: path.join(__dirname, 'app/assets/js/build'),
    filename: 'application.js'
  }
};
var compiler = webpack(config);
compiler.run(function (err, stats) {
  
  console.log( err, stats.toJson() );
});