import CustomElement from './CustomElement.js';

const stylesheet = new CSSStyleSheet();

stylesheet.replace(`input-component {
    display: flex;
    flex-direction: column;
    gap: 0.25em;
}

input-component input {
    border: 1px solid #999;
    border-radius: 0.25em;
    box-sizing: border-box;
    font: inherit;
    padding: 0.5em;
}

input-component.checkbox {
    align-items: center;
    flex-direction: row-reverse;
    justify-content: start;
}`);

export default class Input extends CustomElement {
    #id;
    #label;
    #min;
    #required;
    #type;

    $input;

    constructor({id, label, min, required, type}) {
        super();

        this.#id = id;
        this.#label = label;
        this.#min = min;
        this.#required = required;
        this.#type = type;
    }

    connectedCallback() {
        this.#render();
    }

    #render() {
        this.applyStylesheet(stylesheet);

        this.className = this.#type;

        if (this.#label) {
            const $label = document.createElement('label');
            $label.htmlFor = this.#id;
            $label.textContent = this.#label;
            this.appendChild($label);
        }

        this.$input = document.createElement('input');
        this.$input.id = this.#id;
        this.$input.required = this.#required;
        this.$input.type = this.#type;

        if (this.#min !== undefined) {
            this.$input.min = this.#min;
        }

        if (this.#type === 'datetime-local') {
            this.$input.step = 1;
        }

        if (this.#required && this.#type === 'text') {
            this.addEventListener('change', _ => this.#validateNonWhitespace());
        }

        this.appendChild(this.$input);
    }

    focus() {
        this.$input.focus();
    }

    get value() {
        if (this.#type === 'checkbox') {
            return this.$input.checked;
        }

        if (this.#type === 'datetime-local') {
            return this.$input.valueAsNumber + this.#getTZOffsetMS();
        }

        if (this.#type === 'number') {
            return this.$input.valueAsNumber;
        }

        return this.$input.value.trim();
    }

    #getTZOffsetMS() {
        return new Date().getTimezoneOffset() * 60 * 1000;
    }

    validate() {
        return this.$input.reportValidity();
    }

    #validateNonWhitespace() {
        if (this.$input.value.trim()) {
            this.$input.setCustomValidity('');
        } else {
            this.$input.setCustomValidity('Please fill out this field.');
        }
    }
}

customElements.define('input-component', Input);
