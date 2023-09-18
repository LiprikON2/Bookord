import { createTheme } from "@mantine/core";

const fontFamily =
    'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;';

export const baseTheme = createTheme({
    fontFamily,
    headings: {
        fontFamily: undefined,
        fontWeight: undefined,
        sizes: {
            h1: { fontSize: "2.125rem", lineHeight: "1.3", fontWeight: undefined },
            h2: { fontSize: "1.625rem", lineHeight: "1.35", fontWeight: undefined },
            h3: { fontSize: "1.375rem", lineHeight: "1.4", fontWeight: undefined },
            h4: { fontSize: "1.125rem", lineHeight: "1.45", fontWeight: undefined },
            h5: { fontSize: "1rem", lineHeight: "1.5", fontWeight: undefined },
            h6: { fontSize: "0.875rem", lineHeight: "1.5", fontWeight: undefined },
        },
    },

    primaryColor: "orange",
    primaryShade: {
        light: 6,
        dark: 8,
    },
    colors: {
        // Default
        // dark: [
        //     "#A6A7AB",
        //     "#909296",
        //     "#5C5F66",
        //     "#373A40",
        //     "#2C2E33",
        //     "#25262B",
        //     "#1A1B1E",
        //     "#141517",
        //     "#101113",
        // ],
        dark: [
            "#A6A7AB",
            "#909296",
            "#2e2e2e",
            "#2d2c2c",
            "#242424",
            "#202020",
            "#1f1f1f",
            "#1a1a1a",
            "#191919",
        ],
    },

    /** Class added to the elements that have focus styles, for example, `Button` or `ActionIcon`.
     *  Overrides `theme.focusRing` property.
     */
    focusClassName: undefined,

    components: {
        Group: {
            defaultProps: {
                gap: "xs",
            },
        },
        Stack: {
            defaultProps: {
                gap: "xs",
            },
        },
        Container: {
            defaultProps: {
                p: "xl",
            },
        },
    },
    other: {
        test: "yes",
    },
});
