import Button from './Button.js';
import CustomElement from './CustomElement.js';

import {fadeIn, fadeOut} from './animation.js';

const stylesheet = new CSSStyleSheet();

stylesheet.replace(`modal-component {
    position: fixed;
    inset: 0;
    z-index: 10;
}

modal-component .backdrop {
    background-color: var(--backdrop-color);

    position: fixed;
    inset: 0;
}

modal-component .modal {
    background-color: var(--modal-bg-color);
    border: 1px solid var(--border-color);
    border-radius: 1em;
    box-shadow: 0 3px 3px rgba(0, 0, 0, 0.25);
    box-sizing: border-box;
    line-height: 1.5;
    margin: auto;
    overflow: auto;
    padding: 1em;

    height: fit-content;
    width: fit-content;
    max-height: calc(100% - 2em);
    max-width: calc(100% - 2em);

    display: flex;
    flex-direction: column;
    gap: 1em;

    position: fixed;
    inset: 0;
}

@media (min-width: 448px) {
    modal-component .modal {
        max-width: 26em;
    }
}

modal-component .buttons {
    display: flex;
    gap: 1em;
    justify-content: end;
}`);

export default class Modal extends CustomElement {
    #content;
    #buttons;

    constructor({
        content,
        buttons = [{focus: true, label: 'OK'}],
    }) {
        super();

        this.#content = content;
        this.#buttons = buttons;
    }

    connectedCallback() {
        this.#render();

        document.addEventListener('keydown', this.#onKeyDown);
        addEventListener('hashchange', this.close);
    }

    disconnectedCallback() {
        document.removeEventListener('keydown', this.#onKeyDown);
        removeEventListener('hashchange', this.close);
    }

    #render() {
        this.applyStylesheet(stylesheet);

        const $backdrop = document.createElement('div');
        $backdrop.addEventListener('click', this.close);
        $backdrop.className = 'backdrop';
        this.appendChild($backdrop);

        const $modal = document.createElement('div');
        $modal.className = 'modal';
        this.appendChild($modal);

        if (this.#content instanceof HTMLElement) {
            $modal.appendChild(this.#content);
        } else {
            const $content = document.createElement('div');
            $content.innerHTML = this.#content;
            $modal.appendChild($content);
        }

        const $buttons = document.createElement('div');
        $buttons.className = 'buttons';
        $modal.appendChild($buttons);

        for (const {focus, label, onClick} of this.#buttons) {
            const $button = new Button({
                label,
                onClick: event => {
                    if (onClick && onClick(event) === false) {
                        return;
                    }

                    this.close();
                },
            });

            $buttons.appendChild($button);

            if (focus) {
                $button.focus();
            }
        }

        fadeIn({element: this, duration: 250});
    }

    #onKeyDown = event => {
        if (event.key === 'Escape') {
            this.close();
        }
    };

    close = async _ => {
        await fadeOut({element: this, duration: 250});
        this.dispatchEvent(new Event('close'));
        this.remove();
    };

    static render(...params) {
        const $modal = new Modal(...params);
        document.querySelector('app-component').appendChild($modal);
    }
}

customElements.define('modal-component', Modal);
