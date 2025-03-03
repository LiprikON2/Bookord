import highlightLeft from "~/assets/icons/highlight/highlight-left.svg";
import highlightRight from "~/assets/icons/highlight/highlight-right.svg";

export const style = /*css*/ `
    :host {
        --columns-count: 1;
        --column-gap: 50px;
        
        --page-max-width: 30rem;

        /* TODO put this into setting that would do something like this:
        
            document.documentElement.style.setProperty('--page-max-width', LAYOUT_CONSTANTS.BOOK_COMPONENT_MAX_WIDTH);
        */



        /* The intrinsic width of the underline stroke (in pixels). This is 
        * the same as the height of the cap images. Don't specify the
        * units! This is because of some of the calculations we do later on. */
        --underline-intrinsic-width: 8.5;
        
        /* The actual width of the underline stroke we want to render (in pixels).
        * You can modify this, and the sizing and positioning should be calculated
        * accordingly. Again, Don't specify the units! */
        --underline-width: 12;
        
        /* The colour used to draw the underline. It should match the colour
        * used in the cap images... unfortunately we can't modify the SVG
        * fill via CSS because it's a background image. */
        --underline-color: red;
        
        /* We need to know the width of the cap images so that we
        * can position everything on the x axis accordingly. */
        --underline-cap-width: 4px;
        
        /* The border is positioned relative to the bottom of the line.
        * We can move it upwards a little to create an overlap effect. */
        --underline-offset-y: -2px;
        
        /* The padding to add to the x axis. By default, the caps would be
        * aligned with the beginning and end of the line. */
        --underline-padding-x: 0.12em;
        
        /* The cap images to use that form the left and right rounded
        * shape. I guess these could be any shape, they don't
        * necessarily have to be round 🙂.
        */
        --cap-image-left: url(${highlightLeft});
        --cap-image-right: url(${highlightRight});
    }
    
    :host {
        font-family: var(--mantine-font-family);
        color: var(--mantine-color-text);
        /* font-size: var(--fs-book-global); */
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

    h1, h2, h3, h4, h5, h6, h1 *, h2 *, h3 *, h4 *, h5 *, h6 * {
        font-family: var(--mantine-font-family-headings) !important;
    } 
    h1, h2, h3, h4, h5, h6, p, h1 *, h2 *, h3 *, h4 *, h5 *, h6 *, p * { 
        background-color: unset !important;
        color: var(--mantine-color-text) !important;
    }

    p {
        /* font-size: var(--fs-book-paragraph) !important; */
    }

    .marked {
        color: pink;
        position: relative;
    }

    .marked::before {
        content: "";
        position: absolute;
        right: 0;
        left: 0;
        bottom: 0;
        width: 90%;
        height: 0.4em;
        transform: skew(-12deg) translateX(5%);
        background: rgba(238, 111, 87, 0.5);
        z-index: -1;
    }

    /** Ref
     * - https://dev.to/sharkcoder/css-underline-10-examples-3k7m
     * - https://codepen.io/noahblon/post/coloring-svgs-in-css-background-images#css-masks-1
     */
    .highlighted {
        position: relative;
        
        --underline-hover-height: 1;
        --underline-width: 6;
        --underline-offset-y: -2px;
        --underline-width-scale: calc(var(--underline-width) / var(--underline-intrinsic-width) * var(--underline-hover-height));
        
        padding: 0 calc(var(--underline-padding-x) + calc(var(--underline-cap-width) * var(--underline-width-scale) / var(--underline-hover-height)));
        cursor: pointer;
    }
    
    /* Using pseudo-element allows to change background image fill color with 
       a filter without affecting text color,
       but it break highlight on multi-line text  */
       
    /* .highlighted::before {
        content: '';
        position: absolute;
        z-index: -1;
        left: 0px;
        right: 0px;
        top: 0px;
        bottom: 0px; 
        filter: hue-rotate(0deg) saturate(5);
        
    */
    .highlighted {

        display: inline;
        -webkit-box-decoration-break: clone;
        background-repeat: no-repeat;
        background-image:
            linear-gradient(180deg, var(--underline-color), var(--underline-color)),
            var(--cap-image-left),
            var(--cap-image-right);
        
        background-position-x:
            calc(var(--underline-cap-width) * var(--underline-width-scale)),
            0,
            100%;
        background-position-y: calc(100% - var(--underline-offset-y) * -1);
        background-size:
            calc(100% - calc(var(--underline-cap-width) * var(--underline-width-scale) * 2)) calc(var(--underline-width) * 1px * var(--underline-hover-height)),
            auto calc(var(--underline-width) * 1px * var(--underline-hover-height)),
            auto calc(var(--underline-width) * 1px * var(--underline-hover-height));

        transition: all 100ms ease;
            
    }

    .highlighted:hover {
        --underline-hover-height: 2;
    }

    /* .highlighted-red::before {}

    .highlighted-orange::before { 
        filter: hue-rotate(40deg) saturate(0.5) brightness(390%) saturate(4); 
    }

    .highlighted-yellow::before {
        filter: hue-rotate(70deg) saturate(100);
    }

    .highlighted-green::before{
        filter: hue-rotate(120deg) saturate(1.5);    
    }

    .highlighted-blue::before { 
        filter: hue-rotate(240deg) saturate(5); 
    }

    .highlighted-indigo::before {
        filter: hue-rotate(276deg) saturate(0.1) saturate(6.25) brightness(73%)
    }

    .highlighted-violet::before { 
        filter: hue-rotate(260deg) saturate(100) saturate(.2) brightness(220%);
    }

    .highlighted-cyan::before { 
        filter: invert(1);
    }

    .highlighted-magenta::before { 
        filter: hue-rotate(260deg) saturate(100); 
    }

    .highlighted-lime::before {
        filter: hue-rotate(80deg) saturate(100);
    }

    .highlighted-olive::before {
        filter: hue-rotate(35deg) saturate(.5) brightness(630%) saturate(100) brightness(50%);
    }

    .highlighted-maroon::before {
        filter: hue-rotate(35deg) saturate(.5) brightness(288%) saturate(100) brightness(50%);
    }

    .highlighted-purple::before {
        filter: hue-rotate(300deg) saturate(.64);
    }

    .highlighted-white::before {
        filter: grayscale(100%) brightness(5);
    }

    .highlighted-gray10::before {
        filter: grayscale(100%) brightness(5) brightness(.9); 
    }

    .highlighted-gray20::before { 
        filter: grayscale(100%) brightness(5) brightness(80%);
    }

    .highlighted-gray30::before { 
        filter: grayscale(100%) brightness(500%) brightness(70%);
    }

    .highlighted-gray40::before { 
        filter: grayscale(100%) brightness(500%) brightness(60%);
    }

    .highlighted-gray50::before { 
        filter: grayscale(100%) brightness(500%) brightness(50%);
    }

    .highlighted-gray60::before { 
        filter: grayscale(100%) brightness(500%) brightness(40%);
    }

    .highlighted-gray70::before { 
        filter: grayscale(100%) brightness(500%) brightness(30%); 
    }

    .highlighted-gray80::before { 
        filter: grayscale(100%) brightness(500%) brightness(20%);
    }

    .highlighted-gray90::before { 
        filter: grayscale(100%) brightness(500%) brightness(10%); 
    }

    .highlighted-black::before  {
        filter: grayscale(100%) brightness(0);
    } */

    .book-container {
        max-width: var(--page-max-width);
        height: 100%;

        /* margin: auto; */
        overflow: hidden;
    }
    .book-content {
        width: 100%;
        height: 100%;

        user-select: text;

        columns: var(--columns-count);
        column-gap: var(--column-gap);
    }


    .book-content img {
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
    .book-content img:not([alt=""]) {
        cursor: zoom-in;
        object-fit: contain;

        display: block !important;
        height: 100% !important;
        width: 100% !important;
    }

    .book-content *:has(img:not([alt=""])) {
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
      
        <div id="book-content" class="book-content"></div>
        <div id="temp-document-fragment"></div>
        
    </section>
`;
