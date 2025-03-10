const postcssConfig = require("../postcss/postcss.config");

module.exports = [
    {
        // Add support for native node modules
        test: /native_modules\/.+\.node$/,
        use: "node-loader",
    },
    {
        test: /\.(m?js|node)$/,
        parser: { amd: false },
        use: {
            loader: "@vercel/webpack-asset-relocator-loader",
            options: {
                outputAssetBase: "native_modules",
            },
        },
    },
    {
        // Typescript loader
        test: /\.tsx?$/,
        exclude: /(node_modules|\.webpack)/,
        use: {
            loader: "ts-loader",
            options: {
                transpileOnly: true,
            },
        },
    },
    {
        // CSS Loader
        test: /\.css$/,
        use: [
            { loader: "style-loader" },
            {
                loader: "css-loader",
                // options: {
                //     modules: {
                //         localIdentName: "[name]-[local]-[hash:base64:5]",
                //     },
                // },
            },
            {
                loader: "postcss-loader",
                options: { postcssOptions: postcssConfig },
            },
        ],
    },
    {
        // SCSS (SASS) Loader
        test: /\.s[ac]ss$/i,
        use: [
            { loader: "style-loader" },
            { loader: "css-loader" },
            // Postcss doesn't work
            {
                loader: "postcss-loader",
                options: { postcssOptions: postcssConfig },
            },
            { loader: "sass-loader" },
        ],
    },
    {
        // Less loader
        test: /\.less$/,
        use: [
            { loader: "style-loader" },
            { loader: "css-loader" },
            // Postcss doesn't work
            {
                loader: "postcss-loader",
                options: { postcssOptions: postcssConfig },
            },
            { loader: "less-loader" },
        ],
    },
    {
        // Assets loader
        // More information here https://webpack.js.org/guides/asset-modules/
        test: /\.(gif|jpe?g|tiff|png|webp|bmp|svg|eot|ttf|woff|woff2|avif)$/i,
        type: "asset",
        generator: {
            filename: "assets/[hash][ext][query]",
        },
    },
];
