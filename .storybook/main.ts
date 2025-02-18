import type { StorybookConfig } from "@storybook/react-webpack5";

import aliases from "../tools/webpack/webpack.aliases";
import postcssConfig from "../tools/postcss/postcss.config";

const config: StorybookConfig = {
    stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
    addons: [
        "@storybook/addon-webpack5-compiler-swc",
        "@storybook/addon-onboarding",
        "@storybook/addon-essentials",
        "@chromatic-com/storybook",
        "@storybook/addon-interactions",

        "storybook-dark-mode",
        {
            name: "@storybook/addon-styling-webpack",

            options: {
                rules: [
                    {
                        test: /\.css$/,
                        sideEffects: true,
                        use: [
                            "style-loader",
                            {
                                loader: "css-loader",
                                options: {},
                            },
                            // {
                            //     loader: "postcss-loader",
                            //     options: { postcssOptions: postcssConfig },
                            // },
                        ],
                    },
                ],
            },
        },
    ],
    framework: {
        name: "@storybook/react-webpack5",
        options: {},
    },
    core: {
        disableTelemetry: true,
    },
    webpackFinal: async (config) => {
        if (config.resolve) {
            config.resolve.alias = {
                ...config.resolve.alias,
                ...aliases,
            };
        }
        console.log("config.module?.rules", config.module?.rules);

        return config;
    },
};
export default config;
