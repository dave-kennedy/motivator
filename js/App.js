import CustomElement from './CustomElement.js';
import Header from './Header.js';
import Pager from './Pager.js';

const stylesheet = new CSSStyleSheet();

stylesheet.replace(`app-component {
    display: block;
    height: 100%;
}

app-component header-component {
    height: 10%;
}

app-component pager-component {
    height: 90%;
}`);

export default class App extends CustomElement {
    connectedCallback() {
        this.#render();
    }

    #render() {
        this.applyStylesheet(stylesheet);

        const $header = new Header();
        this.appendChild($header);

        const $pager = new Pager();
        this.appendChild($pager);
    }
}

customElements.define('app-component', App);
