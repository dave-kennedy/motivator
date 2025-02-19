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
    background-color: rgba(0, 0, 0, 0.25);

    position: fixed;
    inset: 0;
}

modal-component .modal {
    background-color: #fff;
    border: 1px solid #999;
    border-radius: 1em;
    box-shadow: 0 3px 3px rgba(0, 0, 0, 0.25);
    box-sizing: border-box;
    max-height: calc(100% - 2em);
    max-width: calc(100% - 2em);
    overflow: auto;
    padding: 1em;

    display: flex;
    flex-direction: column;
    gap: 1em;

    position: fixed;
    inset: 0;
    height: fit-content;
    width: fit-content;
    margin: auto;
}

@media (min-width: 400px) {
    modal-component .modal {
        max-width: 25em;
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

    constructor({content, buttons}) {
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
                    if (onClick) {
                        onClick(event) && this.close();
                    } else {
                        this.close();
                    }
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

    static render(content, buttons) {
        const $modal = new Modal({
            content,
            buttons: buttons || [{focus: true, label: 'OK'}],
        });

        document.querySelector('app-component').appendChild($modal);
    }
}

customElements.define('modal-component', Modal);
