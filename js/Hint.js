import CustomElement from './CustomElement.js';

import {fade} from './animation.js';

const stylesheet = new CSSStyleSheet();

stylesheet.replace(`hint-component {
    position: fixed;
    inset: 0;
    z-index: 10;
}

hint-component .backdrop {
    background-image: radial-gradient(
        var(--anchor-width) var(--anchor-height)
        at var(--anchor-x) var(--anchor-y),
        transparent 100%,
        rgba(0, 0, 0, 0.25) 100%
    );

    background-repeat: no-repeat;

    position: fixed;
    inset: 0;
}

hint-component .hint {
    background-color: #fff;
    border: 1px solid #999;
    border-radius: 1em;
    box-shadow: 0 3px 3px rgba(0, 0, 0, 0.25);
    padding: 1em;

    position: fixed;
    bottom: var(--hint-bottom);
    left: var(--hint-left);
    right: var(--hint-right);
    top: var(--hint-top);
}

hint-component.top-left .hint {
    border-bottom-right-radius: 0;
}

hint-component.top-right .hint {
    border-bottom-left-radius: 0;
}

hint-component.bottom-left .hint {
    border-top-right-radius: 0;
}

hint-component.bottom-right .hint {
    border-top-left-radius: 0;
}`);

export default class Hint extends CustomElement {
    #anchor;
    #position;
    #message;

    constructor({anchor, position, message}) {
        super();

        this.#anchor = anchor;
        this.#position = position;
        this.#message = message;
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

        this.className = this.#position;

        const $backdrop = document.createElement('div');
        $backdrop.addEventListener('click', this.close);
        $backdrop.className = 'backdrop';
        this.appendChild($backdrop);

        const $hint = document.createElement('div');
        $hint.className = 'hint';
        $hint.textContent = this.#message;
        this.appendChild($hint);

        this.#anchor.addEventListener('click', this.close);
        this.#anchor.style.setProperty('z-index', 100);

        if (getComputedStyle(this.#anchor).position === 'static') {
            this.#anchor.style.setProperty('position', 'relative');
        }

        const {
            bottom: anchorBottom,
            height: anchorHeight,
            left: anchorLeft,
            right: anchorRight,
            top: anchorTop,
            width: anchorWidth,
        } = this.#anchor.getBoundingClientRect();

        this.style.setProperty('--anchor-x', `${anchorLeft + (anchorWidth / 2)}px`);
        this.style.setProperty('--anchor-y', `${anchorTop + (anchorHeight / 2)}px`);
        this.style.setProperty('--anchor-width', `${anchorWidth}px`);
        this.style.setProperty('--anchor-height', `${anchorHeight}px`);

        if (this.#position.endsWith('-left')) {
            this.style.setProperty('--hint-right', `${innerWidth - anchorLeft}px`);
        } else {
            this.style.setProperty('--hint-left', `${anchorRight}px`);
        }

        if (this.#position.startsWith('top-')) {
            this.style.setProperty('--hint-bottom', `${innerHeight - anchorTop}px`);
        } else {
            this.style.setProperty('--hint-top', `${anchorBottom}px`);
        }

        fade({element: this, direction: 'in', duration: 250});
    }

    #onKeyDown = event => {
        if (event.key === 'Escape') {
            this.close();
        }
    };

    close = async _ => {
        this.#anchor.removeEventListener('click', this.close);
        this.#anchor.style.removeProperty('position');
        this.#anchor.style.removeProperty('z-index');

        await fade({element: this, direction: 'out', duration: 250});
        this.dispatchEvent(new Event('close'));
        this.remove();
    };
}

customElements.define('hint-component', Hint);
