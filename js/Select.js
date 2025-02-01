import CustomElement from './CustomElement.js';

const stylesheet = new CSSStyleSheet();

stylesheet.replace(`select-component {
    display: flex;
    flex-direction: column;
    gap: 0.25em;
    justify-content: start;
}

select-component select {
    background-color: #fff;
    border: 1px solid #999;
    border-radius: 0.25em;
    box-sizing: border-box;
    font: inherit;
    padding: 0.5em;
}

select-component select[disabled],
select-component select:has(option[value='']:checked),
select-component option[value=''] {
    color: #757575;
}

select-component option:not([value='']) {
    color: initial;
}

select-component.row {
    align-items: center;
    flex-direction: row;
}

select-component.row-reverse {
    align-items: center;
    flex-direction: row-reverse;
}`);

export default class Select extends CustomElement {
    #className;
    #disabled;
    #id;
    #label;
    #options;
    #placeholder;
    #required;
    #value;

    $select;

    constructor({className, disabled, id, label, options, placeholder, required, value}) {
        super();

        this.#className = className;
        this.#disabled = disabled;
        this.#id = id;
        this.#label = label;
        this.#options = options;
        this.#placeholder = placeholder;
        this.#required = required;
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

        this.$select = document.createElement('select');
        this.$select.disabled = this.#disabled;
        this.$select.id = this.#id;
        this.$select.required = this.#required;

        if (this.#placeholder !== undefined) {
            const $option = document.createElement('option');
            $option.textContent = this.#placeholder;
            $option.value = '';
            this.$select.appendChild($option);
        }

        for (const option of this.#options) {
            const $option = document.createElement('option');
            $option.textContent = option;
            $option.value = option;

            if (option === this.#value) {
                $option.selected = true;
            }

            this.$select.appendChild($option);
        }

        this.appendChild(this.$select);
    }

    focus() {
        this.$select.focus();
    }

    get value() {
        return this.$select.value;
    }

    set value(value) {
        this.$select.value = value;
    }

    validate() {
        return this.$select.reportValidity();
    }
}

customElements.define('select-component', Select);
