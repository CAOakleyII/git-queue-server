var path = require('path');

module.exports = {
  target: 'node',
  entry: "./app.js",
  output: {
    path: path.join(__dirname, 'dist'),
    target: 'node',
    filename: "bundle.js"
  }
};
