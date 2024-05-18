export const style = /*css*/ `
    :host {
        --columns-count: 1;
        --column-gap: 50px;

        --column-gap-total: calc(calc(var(--columns-count) - 1) * var(--column-gap));

        --book-component-width: calc(calc(30rem * var(--columns-count)) + var(--column-gap-total));
    }
    
    :host {
        font-family: var(--mantine-font-family) !important;
        color: var(--mantine-color-text) !important;
        /* font-size: var(--fs-book-global) !important; */
    }

    :any-link, :any-link * {
        color: var(--mantine-color-anchor) !important;
    }

        
    h1 {
        font-size: var(--mantine-h1-font-size) !important;
        line-height: var(--mantine-h1-line-height) !important;
        /* font-weight: var(--mantine-h1-font-weight) !important; */
    }
    h2 {
        font-size:var(--mantine-h2-font-size) !important;
        line-height: var(--mantine-h2-line-height) !important;
        /* font-weight: var(--mantine-h2-font-weight) !important; */
    }
    h3 {
        font-size: var(--mantine-h3-font-size) !important;
        line-height: var(--mantine-h3-line-height) !important;
        /* font-weight: var(--mantine-h3-font-weight) !important; */
    }
    h4 {
        font-size: var(--mantine-h4-font-size) !important;
        line-height: var(--mantine-h4-line-height) !important;
        /* font-weight: var(--mantine-h4-font-weight) !important; */
    }
    h5 {
        font-size: var(--mantine-h5-font-size) !important;
        line-height: var(--mantine-h5-line-height) !important;
        /* font-weight: var(--mantine-h5-font-weight) !important; */
    }
    h6 {
        font-size: var(--mantine-h6-font-size) !important;
        line-height: var(--mantine-h6-line-height) !important;
        /* font-weight: var(--mantine-h6-font-weight) !important; */
    }

    h1, h2, h3, h4, h5, h6 { 
        font-family: var(--mantine-font-family-headings) !important;
        background-color: unset !important;
    }

    p {
        /* font-size: var(--fs-book-paragraph) !important; */
    }



    .book-container {
        max-width: var(--book-component-width);
        height: 100%;

        margin: auto;
        overflow: hidden;
    }
    #book-content {
        width: 100%;
        height: 100%;

        user-select: text;

        columns: var(--columns-count);
        column-gap: var(--column-gap);
    }


    #book-content img {
        /* cursor: zoom-in;

        display: block !important;
        width: auto !important;
        max-height: 100vh !important;
        max-width: 100% !important; */


        /* To prevent images from spanning multiple columns when they are enabled */
        /* height: 100%;
        object-fit: contain; */
    }


    /* Make it so all non-decorative images would take full page */
    #book-content img:not([alt=""]) {
        cursor: zoom-in;
        object-fit: contain;

        display: block !important;
        height: 100% !important;
        width: 100% !important;
    }

    #book-content *:has(img:not([alt=""])) {
        width: 100% !important;
    }

    desc {
        display: none;
    }


    ::selection {
        background-color: var(--selection-background-color) !important;
        color: var(--selection-color) !important;
    }

`;

export const template = document.createElement("template");
template.innerHTML = /*html*/ `
    <section id="root" class="book-container">
        <style id="book-style"></style>
        <style id="component-style">
            ${style}
        </style>
      
        <div id="book-content"></div>
        
    </section>
`;
