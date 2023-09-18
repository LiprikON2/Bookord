import { type MantineTheme } from "@mantine/core";

const fontFamily =
    'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;';

export const baseTheme: Partial<MantineTheme> = {
    colorScheme: "dark",
    primaryShade: {
        light: 6,
        dark: 8,
    },
    loader: "dots",
    primaryColor: "orange",
    fontFamily,
    headings: {
        fontFamily: undefined,
        fontWeight: undefined,
        sizes: {
            h1: { fontSize: "2.125rem", lineHeight: 1.3, fontWeight: undefined },
            h2: { fontSize: "1.625rem", lineHeight: 1.35, fontWeight: undefined },
            h3: { fontSize: "1.375rem", lineHeight: 1.4, fontWeight: undefined },
            h4: { fontSize: "1.125rem", lineHeight: 1.45, fontWeight: undefined },
            h5: { fontSize: "1rem", lineHeight: 1.5, fontWeight: undefined },
            h6: { fontSize: "0.875rem", lineHeight: 1.5, fontWeight: undefined },
        },
    },

    focusRingStyles: {
        // reset styles are applied to <button /> and <a /> elements
        // in &:focus:not(:focus-visible) selector to mimic
        // default browser behavior for native <button /> and <a /> elements
        resetStyles: () => ({ outline: "none" }),

        // styles applied to all elements expect inputs based on Input component
        // styled are added with &:focus selector
        styles: (theme) => ({ outline: `2px solid ${theme.colors.orange[5]}` }),

        // focus styles applied to components that are based on Input
        // styled are added with &:focus selector
        inputStyles: (theme) => ({ outline: `2px solid ${theme.colors.orange[5]}` }),
    },

    components: {
        Group: {
            defaultProps: {
                spacing: "xs",
            },
        },
        Stack: {
            defaultProps: {
                spacing: "xs",
            },
        },
        Container: {
            defaultProps: {
                p: "xl",
            },
        },
        // Progress: {
        //     defaultProps: {
        //         size: "xl",
        //         style: { width: "100%" },
        //     },
        //     styles: {
        //         bar: { transition: "width 1500ms linear" },
        //     },
        // },
        // Modal: {
        //     styles: {
        //         inner: {
        //             paddingInline: "5vw",
        //             width: "calc(100% - 10vw)",
        //         },
        //     },
        // },
        // Paper: {
        //     defaultProps: {
        //         shadow: "xs",
        //         radius: "md",
        //         p: "lg",
        //         withBorder: true,
        //         style: {
        //             width: "100%",
        //         },
        //     },
        // },
        // Textarea: {
        //     defaultProps: {
        //         autosize: true,
        //         maxRows: 2,
        //     },
        // },

        // Button: {
        //     defaultProps: {
        //         variant: "outline",
        //         color: "gray",
        //         size: "lg",
        //         fz: "xl",
        //     },
        // },
    },
};
