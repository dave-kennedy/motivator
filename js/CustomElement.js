export default class CustomElement extends HTMLElement {
    applyStylesheet(stylesheet) {
        if (!document.adoptedStyleSheets.includes(stylesheet)) {
            document.adoptedStyleSheets.push(stylesheet);
        }
    }

    raiseEvent(name, detail) {
        document.dispatchEvent(new CustomEvent(name, {detail}));
    }
}
