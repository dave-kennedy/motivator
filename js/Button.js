import CustomElement from './CustomElement.js';
import Icon from './Icon.js';

const stylesheet = new CSSStyleSheet();

stylesheet.replace(`button-component:not([hidden]) {
    display: inline-block;
}

button-component button {
    background-color: var(--accent-color);
    border: none;
    border-radius: 0.25em;
    color: var(--button-text-color);
    cursor: pointer;
    font: inherit;
    padding: 0.5em;
    transition: filter 250ms;
    width: 100%;

    display: flex;
    align-items: center;
    gap: 0.5em;
}

button-component button:is(:focus, :hover) {
    filter: brightness(1.2);
}

button-component button:active {
    filter: brightness(1.4);
}

button-component span {
    white-space: nowrap;
}

button-component.big button {
    font-size: 2em;
    gap: 0.25em;
    padding: 0.25em;
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

button-component.icon-right button {
    flex-direction: row-reverse;
}

button-component.round button {
    border-radius: 50%;
}

button-component.square button {
    border-radius: 0;
}

button-component.transparent button {
    background-color: transparent;
    color: var(--accent-color);
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
            const $icon = new Icon(this.#icon);
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

    click() {
        this.$button.click();
    }

    focus() {
        this.$button.focus();
    }
}

customElements.define('button-component', Button);
