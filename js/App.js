import CustomElement from './CustomElement.js';
import Header from './Header.js';

const stylesheet = new CSSStyleSheet();

stylesheet.replace(`app-component {
    display: block;
    font-family: sans-serif;
    height: 100%;
}

app-component header-component {
    height: 10%;
}

app-component .pager {
    height: 90%;
}`);

export default class App extends CustomElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.#render();
    }

    #render() {
        this.applyStylesheet(stylesheet);

        const $header = new Header();
        this.appendChild($header);

        const $pager = document.createElement('div');
        $pager.className = 'pager';
        $pager.textContent = 'pager';
        this.appendChild($pager);
    }
}

customElements.define('app-component', App);
