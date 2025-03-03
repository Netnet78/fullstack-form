const path = require('path');


module.exports = {
  // The entry point for the bundle
  entry: './client/src/main.js', // Your main JavaScript file in the src folder

  // The output configuration
  output: {
    filename: 'bundle.js', // The name of the output file
    path: path.resolve(__dirname, 'server', 'dist'), // Output directory (./server/dist)
  },

  // Module rules for loading files (e.g., JavaScript, CSS, etc.)
  module: {
    rules: [
      {
        test: /\.js$/, // For JavaScript files
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader', // Optional, for transpiling modern JS (e.g., ES6+)
        },
      },
      {
        test: /\.css$/, // For CSS files
        use: ['style-loader', 'css-loader'], // Inject CSS into the DOM        
      },
    ],
  },

  // Dev server configuration
  devServer: {
    static: {
      directory: path.join(__dirname, 'server', 'dist'), // Where to serve static files from (client/).
    },
    devMiddleware: {
      publicPath: '/dist/', // Corrected path to serve static files
    },
    port: 3000, // Port for the development server
    hot: true, // Enable Hot Module Replacement
  },

  // Plugins (optional)
  plugins: [
  ],
};
