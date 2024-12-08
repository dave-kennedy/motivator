export default class CustomElement extends HTMLElement {
    constructor() {
        super();
    }

    applyStylesheet(stylesheet) {
        if (!document.adoptedStyleSheets.includes(stylesheet)) {
            document.adoptedStyleSheets.push(stylesheet);
        }
    }
}
