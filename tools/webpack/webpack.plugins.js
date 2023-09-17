const webpack = require("webpack");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");
const { isDev } = require("./webpack.helpers");

module.exports = [
    new ForkTsCheckerWebpackPlugin(),
    isDev() && new webpack.HotModuleReplacementPlugin(),
    isDev() && new ReactRefreshWebpackPlugin(),
].filter(Boolean);
