const stylesheet = new CSSStyleSheet();

stylesheet.replace(`app-component {
    display: block;
    font-family: sans-serif;
    height: 100%;
}

app-component .header {
    height: 10%;
}

app-component .pager {
    height: 90%;
}`);

export default class App extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.#render();
    }

    #render() {
        if (!document.adoptedStyleSheets.includes(stylesheet)) {
            document.adoptedStyleSheets.push(stylesheet);
        }

        const $header = document.createElement('div');
        $header.className = 'header';
        $header.textContent = 'header';
        this.appendChild($header);

        const $pager = document.createElement('div');
        $pager.className = 'pager';
        $pager.textContent = 'pager';
        this.appendChild($pager);
    }
}

customElements.define('app-component', App);
