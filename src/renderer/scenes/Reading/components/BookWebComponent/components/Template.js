export const style = /*css*/ `
    :host {
        
        /* todo */
        --columns-count: 2; 
        --column-gap: 2rem;


        --columns-count: 1;
        --column-gap: 50px;

        --column-gap-total: calc(calc(var(--columns-count) - 1) * var(--column-gap));

        --book-component-width: calc(calc(30rem * var(--columns-count)) + var(--column-gap-total));
    }

    :any-link {
        color: var(--clr-link) !important;
    }
    :host {
        font-size: var(--fs-book-global) !important;
        font-family: var(--ff-book-global) !important;
    }
    p {
        font-size: var(--fs-book-paragraph) !important;
    }
    h1 {
        font-size: var(--fs-book-h1) !important;
    }
    h2 {
        font-size: var(--fs-book-h2) !important;
    }
    h3 {
        font-size: var(--fs-book-h3) !important;
    }
    h4 {
        font-size: var(--fs-book-h4) !important;
    }
    h5 {
        font-size: var(--fs-book-h5) !important;
    }
    h6 {
        font-size: var(--fs-book-h6) !important;
    }

    p, h1, h2, h3, h4, h5, h6 { 
        line-height: var(--lh-book-global, 1.2) !important;
        font-family: var(--ff-book-global, unset) !important;
    }

    .book-container {
        max-width: var(--book-component-width);
        height: 100%;

        margin: auto;
        overflow: hidden;
    }
    .book-container > #book-content {
        width: 100%;
        height: 100%;

        columns: var(--columns-count);
        column-gap: var(--column-gap);
    }

    .book-container img {
        cursor: zoom-in;

        display: block !important;
        width: auto !important;
        max-height: 100vh !important;
        max-width: 100% !important;


        /* To prevent images from spanning multiple columns when they are enabled */
        /* height: 100%;
        object-fit: contain; */
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
