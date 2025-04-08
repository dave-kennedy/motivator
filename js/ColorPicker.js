import Button from './Button.js';
import CustomElement from './CustomElement.js';

const stylesheet = new CSSStyleSheet();

stylesheet.replace(`color-picker-component {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 0.25em 0.5em;
}

color-picker-component label {
    width: 100%;
}

color-picker-component .color-swatch {
    height: 1em;
    width: 1em;
}

color-picker-component .color-label {
    font-family: mono;
}`);

export default class ColorPicker extends CustomElement {
    #id;
    #label;
    #placeholder;
    #value;

    $colorInput;
    $colorSwatch;
    $colorLabel;

    constructor({id, label, placeholder, value}) {
        super();

        this.#id = id;
        this.#label = label;
        this.#placeholder = placeholder;
        this.#value = value;
    }

    connectedCallback() {
        this.#render();
    }

    #render() {
        this.applyStylesheet(stylesheet);

        const $label = document.createElement('label');
        $label.htmlFor = this.#id;
        $label.textContent = this.#label;
        this.appendChild($label);

        this.$colorInput = document.createElement('input');
        this.$colorInput.addEventListener('change', event => this.value = event.target.value);
        this.$colorInput.hidden = true;
        this.$colorInput.id = this.#id;
        this.$colorInput.type = 'color';
        this.appendChild(this.$colorInput);

        this.$colorSwatch = document.createElement('div');
        this.$colorSwatch.className = 'color-swatch';
        this.appendChild(this.$colorSwatch);

        this.$colorLabel = document.createElement('div');
        this.$colorLabel.className = 'color-label';
        this.appendChild(this.$colorLabel);

        const $changeButton = new Button({
            className: 'transparent',
            label: 'Change',
            onClick: _ => this.$colorInput.click(),
        });

        this.appendChild($changeButton);

        const $resetButton = new Button({
            className: 'transparent',
            label: 'Reset',
            onClick: _ => this.value = undefined,
        });

        this.appendChild($resetButton);

        this.value = this.#value;
    }

    get value() {
        return this.#value;
    }

    set value(value) {
        this.#value = value;
        this.$colorInput.value = value || this.#placeholder;
        this.$colorSwatch.style.backgroundColor = value || this.#placeholder;
        this.$colorLabel.textContent = value || this.#placeholder;
    }
}

customElements.define('color-picker-component', ColorPicker);
