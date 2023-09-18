import { createTheme } from "@mantine/core";

const fontFamily =
    'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;';

export const baseTheme = createTheme({
    primaryShade: {
        light: 6,
        dark: 8,
    },
    primaryColor: "orange",
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
});
