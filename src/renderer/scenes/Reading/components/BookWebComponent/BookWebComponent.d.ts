import React from "react";

// https://stackoverflow.com/a/55424778
declare global {
    namespace JSX {
        interface IntrinsicElements {
            "book-web-component": React.DetailedHTMLProps<
                React.HTMLAttributes<HTMLElement> & { class?: string },
                HTMLElement
            >;
        }
    }
}
