import CustomElement from './CustomElement.js';

const stylesheet = new CSSStyleSheet();

stylesheet.replace(`header-component {
    background-color: #666;
    box-sizing: border-box;
    color: #fff;
    padding: 1em;

    display: flex;
    align-items: center;
}

header-component .points {
    font-size: 2em;
    font-weight: bold;
}

header-component .points::after {
    content: ' points';
    font-size: 1rem;
}

@media (min-height: 800px) {
    header-component .points {
        font-size: 4em;
    }
}`);

export default class Header extends CustomElement {
    #points;

    constructor() {
        super();
    }

    connectedCallback() {
        this.#render();
    }

    #render() {
        this.applyStylesheet(stylesheet);

        this.#points = 0;

        const $points = document.createElement('div');
        $points.className = 'points';
        $points.textContent = this.#points;
        this.appendChild($points);
    }
}

customElements.define('header-component', Header);
