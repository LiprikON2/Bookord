const webpack = require("webpack");
const path = require("path");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

const { isDev } = require("./webpack.helpers");

module.exports = [
    new ForkTsCheckerWebpackPlugin(),
    isDev() && new webpack.HotModuleReplacementPlugin(),
    isDev() && new ReactRefreshWebpackPlugin(),
    /* 
        Utility processes requires a separate files: 
        just copy them without bundling into index.js
        with the rest of the main process files 
    */
    new CopyPlugin({
        patterns: [{ from: path.resolve(process.cwd(), "src/forks"), to: "../forks" }],
    }),
].filter(Boolean);
