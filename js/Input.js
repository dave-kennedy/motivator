import CustomElement from './CustomElement.js';

const stylesheet = new CSSStyleSheet();

stylesheet.replace(`input-component {
    display: flex;
    flex-direction: column;
    gap: 0.25em;
    justify-content: start;
}

input-component input {
    border: 1px solid #999;
    border-radius: 0.25em;
    box-sizing: border-box;
    font: inherit;
    padding: 0.5em;
}

input-component input::placeholder,
input-component input[disabled],
input-component input[type^=date] {
    color: #757575;
}

input-component input[type^=date].non-blank {
    color: initial;
}

input-component.row {
    align-items: center;
    flex-direction: row;
}

input-component.row-reverse {
    align-items: center;
    flex-direction: row-reverse;
}`);

export default class Input extends CustomElement {
    #className;
    #disabled;
    #id;
    #label;
    #min;
    #placeholder;
    #required;
    #type;
    #value;

    $input;

    constructor({className, disabled, id, label, min, placeholder, required, type, value}) {
        super();

        this.#className = className;
        this.#disabled = disabled;
        this.#id = id;
        this.#label = label;
        this.#min = min;
        this.#placeholder = placeholder;
        this.#required = required;
        this.#type = type;
        this.#value = value;
    }

    connectedCallback() {
        this.#render();
    }

    #render() {
        this.applyStylesheet(stylesheet);

        if (this.#className) {
            this.className = this.#className;
        }

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

        if (this.#placeholder !== undefined) {
            this.$input.placeholder = this.#placeholder;
        }

        if (this.#type === 'date' || this.#type === 'datetime-local') {
            this.addEventListener('change', _ => this.#toggleNonBlank());
            this.$input.step = 1;
        }

        if (this.#type === 'text' && this.#required) {
            this.addEventListener('change', _ => this.#validateNonBlank());
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

        if (this.#type === 'date' || this.#type === 'datetime-local') {
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

        if (this.#type === 'date' || this.#type === 'datetime-local') {
            // Convert to local timezone
            const localTime = value - this.#getTZOffsetMS();

            // Round to nearest second to avoid displaying milliseconds in UI
            this.$input.valueAsNumber = Math.round(localTime / 1000) * 1000;

            this.#toggleNonBlank();
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

    #toggleNonBlank() {
        if (this.$input.value.trim()) {
            this.$input.classList.add('non-blank');
        } else {
            this.$input.classList.remove('non-blank');
        }
    }

    #validateNonBlank() {
        if (this.$input.value.trim()) {
            this.$input.setCustomValidity('');
        } else {
            this.$input.setCustomValidity('Please fill out this field.');
        }
    }

    validate() {
        return this.$input.reportValidity();
    }
}

customElements.define('input-component', Input);
