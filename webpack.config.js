// execute when in PowerShell
// $env:NODE_ENV='development'

const HtmlWebPackPlugin = require("html-webpack-plugin");
const path = require("path");
module.exports = {
  context: __dirname,
  target: ["web"],
  entry: "./src/index.tsx",
  // output: {
  //   path: path.resolve(__dirname, "dist"),
  //   filename: "main.js",
  //   publicPath: "/",
  // },
  resolve: {
    // symlinks: false,
    // alias: {
    //   react: path.resolve("./node_modules/react"),
    //   "react-dom": path.resolve("./node_modules/react-dom"),
    //   "react-router-dom": path.resolve("./node_modules/react-router-dom"),
    // },
    extensions: ['.ts', '.js', 'jsx', '.tsx'],
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        use: "babel-loader",
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(png|j?g|svg|gif)?$/,
        use: "file-loader",
      },
    ],
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: path.resolve(__dirname, "public/index.html"),
      filename: "index.html",
    }),
  ],
  devServer: {
    historyApiFallback: true,
    static: [
      { directory: path.join(__dirname, "public") },
    ],
    compress: false,
    port: 9001,
  },
};
