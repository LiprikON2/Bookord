module.exports = {
    plugins: {
        "postcss-preset-mantine": {
            autoRem: true,
            mixins: {
                // ref: https://stackoverflow.com/a/13924997/10744339
                lineClamp: (_mixin, lines) => ({
                    overflow: "hidden",
                    display: "-webkit-box",
                    "-webkit-line-clamp": lines,
                    lineClamp: lines,
                    "-webkit-box-orient": "vertical",
                }),
            },
        },
        "postcss-simple-vars": {
            variables: {
                "mantine-breakpoint-xs": "36em",
                "mantine-breakpoint-sm": "48em",
                "mantine-breakpoint-md": "62em",
                "mantine-breakpoint-lg": "75em",
                "mantine-breakpoint-xl": "88em",
            },
        },
    },
};
