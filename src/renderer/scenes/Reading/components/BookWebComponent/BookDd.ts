// export default class BookWebComponent extends HTMLElement {
//     // Listen for changes in the book-page attribute
//     static get observedAttributes() {
//         return ["book-page"];
//     }

//     constructor() {
//         super();

//         this.attachShadow({ mode: "open" });

//         this.shadowRoot.appendChild(template.content.cloneNode(true));

//         this.rootElem = this.shadowRoot.getElementById("root");
//         this.contentElem = this.shadowRoot.getElementById("book-content");

//         this.componentStyle = getComputedStyle(this.rootElem);

//         this.pageCounter = new PageCounter(this);
//         this.bookLoader = new BookLoader(this);
//         this.bookmarkManager = new BookmarkManager(this);
//         this.stateManager = new StateManager(this);
//         this.book = null;
//     }
// }
