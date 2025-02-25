import CustomElement from './CustomElement.js';

const stylesheet = new CSSStyleSheet();

stylesheet.replace(`button-component:not([hidden]) {
    display: block;
}

button-component button {
    border: none;
    border-radius: 0.25em;
    color: #fff;
    cursor: pointer;
    font: inherit;
    padding: 0.5em;
    width: 100%;

    background-color: #0aa;
    transition: background-color 250ms;

    display: flex;
    align-items: center;
    gap: 0.5em;
}

button-component button:is(:focus, :hover) {
    background-color: #088;
}

button-component button:active {
    background-color: #066;
}

button-component img {
    height: 1.5rem;
    width: 1.5rem;
}

button-component span {
    white-space: nowrap;
}

button-component.big button {
    font-size: 2em;
}

button-component.big img {
    scale: 2;
}

button-component.fab {
    position: fixed;
    bottom: 0.5em;
    right: 0.5em;
    z-index: 1;
}

button-component.fab button {
    box-shadow: 0 3px 3px rgba(0, 0, 0, 0.25);
}

button-component.gray button {
    background-color: #666;
}

button-component.gray button:is(:focus, :hover) {
    background-color: #888;
}

button-component.gray button:active {
    background-color: #aaa;
}

button-component.round button {
    border-radius: 50%;
}

button-component.square button {
    border-radius: 0;
}

button-component.transparent button {
    background-color: transparent;
}

button-component.transparent button:active {
    background-color: rgba(0, 0, 0, 0.1);
}`);

export default class Button extends CustomElement {
    #className;
    #icon;
    #label;
    #onClick;
    #title;
    #type;

    $button;

    constructor({className, icon, label, onClick, title, type}) {
        super();

        this.#className = className;
        this.#icon = icon;
        this.#label = label;
        this.#onClick = onClick;
        this.#title = title;
        this.#type = type;
    }

    connectedCallback() {
        this.#render();
    }

    #render() {
        this.applyStylesheet(stylesheet);

        if (this.#className) {
            this.className = this.#className;
        }

        this.$button = document.createElement('button');
        this.appendChild(this.$button);

        if (this.#icon) {
            const $icon = document.createElement('img');
            $icon.alt = this.#icon.alt;
            $icon.src = this.#icon.src;
            this.$button.appendChild($icon);
        }

        if (this.#label) {
            const $label = document.createElement('span');
            $label.textContent = this.#label;
            this.$button.appendChild($label);
        }

        if (this.#onClick) {
            this.$button.addEventListener('click', event => this.#onClick(event));
        }

        if (this.#title) {
            this.$button.title = this.#title;
        }

        if (this.#type) {
            this.$button.type = this.#type;
        }
    }

    focus() {
        this.$button.focus();
    }
}

customElements.define('button-component', Button);
