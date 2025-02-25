import type { StorybookConfig } from "@storybook/react-webpack5";
import { RuleSetRule } from "webpack";

import aliases from "../tools/webpack/webpack.aliases";
import postcssConfig from "../tools/postcss/postcss.config";

export const findRuleByTest = (rules: RuleSetRule[], test: RegExp): number => {
    return rules.findIndex((rule) => rule?.test?.toString() === test.toString());
};

const config: StorybookConfig = {
    stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
    addons: [
        "@storybook/addon-webpack5-compiler-swc",
        "@storybook/addon-essentials",
        "@chromatic-com/storybook",
        "@storybook/addon-interactions",

        "storybook-dark-mode",
        "@storybook/addon-styling-webpack",
    ],
    framework: {
        name: "@storybook/react-webpack5",
        options: {},
    },
    core: {
        disableTelemetry: true,
    },
    webpackFinal: async (config) => {
        // Import aliases from the project
        if (config.resolve) {
            config.resolve.alias = {
                ...config.resolve.alias,
                ...aliases,
            };
        }

        // Import postcss from the project
        if (config?.module?.rules) {
            const cssRuleIndex = findRuleByTest(config.module.rules as [], /\.css$/);

            (config.module.rules[cssRuleIndex] as RuleSetRule).use = [
                { loader: "style-loader" },
                { loader: "css-loader" },
                {
                    loader: "postcss-loader",
                    options: {
                        postcssOptions: {
                            config: false,
                            plugins: postcssConfig.plugins,
                        },
                    },
                },
            ];
        }

        // console.log("Webpack rules:");
        // config.module?.rules?.forEach((rule, i) => {
        //     rule = rule as RuleSetRule;
        //     console.log(`Rule #${i}:`, rule?.test?.toString(), rule?.use);
        // });

        return config;
    },
};
export default config;
