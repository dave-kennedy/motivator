import Button from './Button.js';
import CustomElement from './CustomElement.js';

const stylesheet = new CSSStyleSheet();

stylesheet.replace(`modal-component {
    position: fixed;
}

modal-component dialog {
    border: 1px solid #999;
    border-radius: 1em;
    box-shadow: 0 3px 3px rgba(0, 0, 0, 0.1);
    padding: 0;
}

modal-component .inner {
    display: flex;
    flex-direction: column;
    gap: 1em;
    padding: 1em;
}

modal-component .buttons {
    display: flex;
    gap: 1em;
    justify-content: end;
}`);

export default class Modal extends CustomElement {
    #message;
    #onConfirm;

    constructor({message, onConfirm}) {
        super();

        this.#message = message;
        this.#onConfirm = onConfirm;
    }

    connectedCallback() {
        this.#render();
    }

    #render() {
        this.applyStylesheet(stylesheet);

        const $dialog = document.createElement('dialog');
        $dialog.addEventListener('close', _ => this.remove());
        this.appendChild($dialog);

        const $inner = document.createElement('div');
        $inner.className = 'inner';
        $dialog.appendChild($inner);

        const $message = document.createElement('div');
        $message.textContent = this.#message;
        $inner.appendChild($message);

        const $buttons = document.createElement('div');
        $buttons.className = 'buttons';
        $inner.appendChild($buttons);

        const $cancelButton = new Button({
            label: 'Cancel',
            onClick: _ => $dialog.close(),
        });

        $buttons.appendChild($cancelButton);

        const $confirmButton = new Button({
            label: 'OK',
            onClick: _ => {
                this.#onConfirm();
                $dialog.close();
            },
        });

        $buttons.appendChild($confirmButton);

        $dialog.showModal();
        $dialog.animate({opacity: [0, 1]}, 300);

        try {
            $dialog.animate({
                opacity: [0, 1],
            }, {
                duration: 300,
                pseudoElement: '::backdrop',
            });
        } catch (error) {
            if (error.message.includes('unsupported pseudo-element')) {
                // Firefox doesn't support this yet, never mind it
            } else {
                throw error;
            }
        }

        $confirmButton.focus();

        this.addEventListener('click', event => {
            if (event.target === $dialog) {
                $dialog.close();
            }
        });
    }
}

customElements.define('modal-component', Modal);
