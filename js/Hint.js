import CustomElement from './CustomElement.js';

const stylesheet = new CSSStyleSheet();

stylesheet.replace(`hint-component {
    position: fixed;
}

hint-component [popover] {
    border: 1px solid #999;
    border-radius: 1em;
    box-shadow: 0 3px 3px rgba(0, 0, 0, 0.1);
    padding: 1em;

    bottom: var(--popover-bottom);
    left: var(--popover-left);
    right: var(--popover-right);
    top: var(--popover-top);
}

hint-component.top-left [popover] {
    border-bottom-right-radius: 0;
}

hint-component.top-right [popover] {
    border-bottom-left-radius: 0;
}

hint-component.bottom-left [popover] {
    border-top-right-radius: 0;
}

hint-component.bottom-right [popover] {
    border-top-left-radius: 0;
}

hint-component [popover]::backdrop {
    background-image: radial-gradient(
        var(--backdrop-rx) var(--backdrop-ry)
        at var(--backdrop-x) var(--backdrop-y),
        transparent 100%,
        rgba(0, 0, 0, 0.1) 100%
    );

    background-repeat: no-repeat;
}`);

export default class Hint extends CustomElement {
    #anchor;
    #position;
    #message;
    #onClose;

    constructor({anchor, position, message, onClose}) {
        super();

        this.#anchor = anchor;
        this.#position = position;
        this.#message = message;
        this.#onClose = onClose;
    }

    connectedCallback() {
        this.#render();
    }

    #render() {
        this.applyStylesheet(stylesheet);

        this.className = this.#position;

        const $popover = document.createElement('div');
        $popover.popover = 'auto';
        $popover.textContent = this.#message;

        $popover.addEventListener('toggle', ({newState}) => {
            if (newState !== 'closed') {
                return;
            }

            if (this.#onClose) {
                this.#onClose();
            }

            this.remove();
        });

        this.appendChild($popover);

        const {
            bottom: anchorBottom,
            height: anchorHeight,
            left: anchorLeft,
            right: anchorRight,
            top: anchorTop,
            width: anchorWidth,
        } = this.#anchor.getBoundingClientRect();

        if (this.#position.endsWith('-left')) {
            this.style.setProperty('--popover-right', `${innerWidth - anchorLeft}px`);
        } else {
            this.style.setProperty('--popover-left', `${anchorRight}px`);
        }

        if (this.#position.startsWith('top-')) {
            this.style.setProperty('--popover-bottom', `${innerHeight - anchorTop}px`);
        } else {
            this.style.setProperty('--popover-top', `${anchorBottom}px`);
        }

        this.style.setProperty('--backdrop-x', `${anchorLeft + (anchorWidth / 2)}px`);
        this.style.setProperty('--backdrop-y', `${anchorTop + (anchorHeight / 2)}px`);
        this.style.setProperty('--backdrop-rx', `${anchorWidth}px`);
        this.style.setProperty('--backdrop-ry', `${anchorHeight}px`);

        $popover.showPopover();
        $popover.animate({opacity: [0, 1]}, 300);

        try {
            $popover.animate({
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
    }
}

customElements.define('hint-component', Hint);
