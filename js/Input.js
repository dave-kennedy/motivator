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
    #disabled;
    #id;
    #label;
    #min;
    #required;
    #type;
    #value;

    $input;

    constructor({disabled, id, label, min, required, type, value}) {
        super();

        this.#disabled = disabled;
        this.#id = id;
        this.#label = label;
        this.#min = min;
        this.#required = required;
        this.#type = type;
        this.#value = value;
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
        this.$input.disabled = this.#disabled;
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

        if (this.#value !== undefined) {
            this.value = this.#value;
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
            // Convert to UTC
            return this.$input.valueAsNumber + this.#getTZOffsetMS();
        }

        if (this.#type === 'number') {
            return this.$input.valueAsNumber;
        }

        return this.$input.value.trim();
    }

    set value(value) {
        if (this.#type === 'checkbox') {
            this.$input.checked = value;
            return;
        }

        if (this.#type === 'datetime-local') {
            // Convert to local timezone
            const localTime = value - this.#getTZOffsetMS();

            // Round to the nearest second
            this.$input.valueAsNumber = Math.round(localTime / 1000) * 1000;
            return;
        }

        if (this.#type === 'number') {
            this.$input.valueAsNumber = value;
            return;
        }

        this.$input.value = value;
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
