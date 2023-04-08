const path = require("path");
const MonacoWebpackPlugin = require("monaco-editor-webpack-plugin");

module.exports = {
  entry: "./src/index.js",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "public"),
  },
  plugins: [
    new MonacoWebpackPlugin({
      languages: ["javascript", "typescript"], // Optional: specify the languages to include
      features: ["coreCommands", "find"], // Optional: specify the editor features to include
    }),
  ],
};
