var path = require('path');
var webpack = require('webpack');
var jQuery = require('jquery');

var config = {
  context: path.join(__dirname, './public/assets/js'),
  entry: {
    index: './application'
  },
  output: {
    path: path.join(__dirname, './public/assets/build/'),
    filename: 'application.min.js'
    // libraryTarget: "var",
    // library: "core"
  },
  // externals: {
  //   'core': 'core'
  // }
  plugins: [
    // new webpack.optimize.UglifyJsPlugin({
    //   include: /\.min\.js$/,
    //   minimize: true
    // }),
    // new webpack.optimize.AggressiveMergingPlugin({
    //   moveToParents: true
    // }),
    new webpack.ProvidePlugin({
        $: "jquery",
        jQuery: "jquery",
        "window.jQuery": "jquery"
    })
  ],
  // externals: {
        // require("jquery") is external and available
        //  on the global var jQuery
        "jquery": "jquery"
    // }
};
var compiler = webpack(config);
compiler.run(function (err, stats) {
  
  console.log( err, stats.toJson() );
});