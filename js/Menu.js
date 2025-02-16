import Button from './Button.js';
import CustomElement from './CustomElement.js';

import {slideClose, slideOpen} from './animation.js';

const stylesheet = new CSSStyleSheet();

stylesheet.replace(`menu-component {
    display: block;
    position: relative;
}

menu-component .items {
    background-color: #666;
    border: 1px solid #999;
    border-radius: 0.5em;
    box-shadow: 0 3px 3px rgba(0, 0, 0, 0.25);
    display: none;
    overflow: hidden;

    position: absolute;
    right: 0;
    top: 2em;
    z-index: 1;
}

menu-component.open .items {
    display: flex;
    flex-direction: column;
}`);

export default class Menu extends CustomElement {
    #handle;
    #items;

    constructor({handle, items}) {
        super();

        this.#handle = handle;
        this.#items = items;
    }

    connectedCallback() {
        this.#render();
    }

    #render() {
        this.applyStylesheet(stylesheet);

        const $handle = new Button({
            className: 'transparent',
            ...this.#handle
        });

        $handle.addEventListener('click', this.toggle);
        this.appendChild($handle);

        this.$items = document.createElement('div');
        this.$items.className = 'items';
        this.appendChild(this.$items);

        for (const item of this.#items) {
            const $item = new Button({
                className: 'gray square',
                ...item
            });

            this.$items.appendChild($item);
        }
    }

    #onKeyDown = event => {
        if (event.key === 'Escape') {
            this.close();
        }
    };

    close = async _ => {
        removeEventListener('hashchange', this.close);
        document.removeEventListener('click', this.close);
        document.removeEventListener('keydown', this.#onKeyDown);

        await slideClose({element: this.$items, duration: 250});
        this.dispatchEvent(new Event('close'));
        this.classList.remove('open');
    };

    open = async _ => {
        this.classList.add('open');
        this.dispatchEvent(new Event('open'));
        await slideOpen({element: this.$items, duration: 250});

        addEventListener('hashchange', this.close);
        document.addEventListener('click', this.close);
        document.addEventListener('keydown', this.#onKeyDown);
    };

    toggle = async _ => {
        if (this.classList.contains('open')) {
            await this.close();
        } else {
            await this.open();
        }
    };
}

customElements.define('menu-component', Menu);
