import CustomElement from './CustomElement.js';
import Header from './Header.js';
import Pager from './Pager.js';
import Tutorial from './Tutorial.js';

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

        // The prompt is dismissed on hashchange, so wait a split second
        // for initial redirect from default, hash-less URL
        setTimeout(_ => Tutorial.prompt(), 100);
    }
}

customElements.define('app-component', App);
