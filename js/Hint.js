import Button from './Button.js';
import CustomElement from './CustomElement.js';

import {fadeIn, fadeOut} from './animation.js';

const stylesheet = new CSSStyleSheet();

stylesheet.replace(`hint-component {
    position: fixed;
    inset: 0;
    z-index: 10;
}

hint-component .backdrop {
    background-color: var(--backdrop-color);
    mask-composite: exclude;
    mask-image: linear-gradient(black, black), url(img/circle.svg);
    mask-repeat: no-repeat;

    position: fixed;
    inset: 0;
}

hint-component .hint {
    background-color: var(--hint-bg-color);
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
}

@media (min-width: 448px) {
    hint-component .hint {
        max-width: 26em;
    }
}

hint-component .footer {
    display: flex;
    align-items: center;
    gap: 1em;
}

hint-component .footer > :first-child {
    flex: 1;
    text-align: left;
}

hint-component .footer > :nth-child(2) {
    flex: 1;
    text-align: center;
}

hint-component .footer > :last-child {
    flex: 1;
    text-align: right;
}

hint-component .caret {
    background-color: var(--hint-bg-color);
    rotate: 45deg;

    height: 1em;
    width: 1em;

    position: fixed;
}

hint-component .caret.up {
    border-left: 1px solid var(--border-color);
    border-top: 1px solid var(--border-color);
}

hint-component .caret.down {
    border-bottom: 1px solid var(--border-color);
    border-right: 1px solid var(--border-color);
}`);

export default class Hint extends CustomElement {
    #anchor;
    #content;
    #backButton;
    #nextButton;
    #progress;

    constructor({anchor, content, backButton, nextButton, progress}) {
        super();

        this.#anchor = anchor;
        this.#content = content;
        this.#backButton = backButton;
        this.#nextButton = nextButton;
        this.#progress = progress;
    }

    connectedCallback() {
        this.#render();

        addEventListener('hashchange', this.#onHashChange);
        document.addEventListener('keydown', this.#onKeyDown);
    }

    disconnectedCallback() {
        removeEventListener('hashchange', this.#onHashChange);
        document.removeEventListener('keydown', this.#onKeyDown);
    }

    #render() {
        this.applyStylesheet(stylesheet);

        const $backdrop = document.createElement('div');
        $backdrop.addEventListener('click', _ => this.close('Backdrop'));
        $backdrop.className = 'backdrop';
        this.appendChild($backdrop);

        const $hint = document.createElement('div');
        $hint.className = 'hint';
        this.appendChild($hint);

        const $content = document.createElement('div');
        $content.innerHTML = this.#content;
        $hint.appendChild($content);

        const $footer = document.createElement('div');
        $footer.className = 'footer';
        $hint.appendChild($footer);

        const $footerLeft = document.createElement('div');
        const $footerMid = document.createElement('div');
        const $footerRight = document.createElement('div');
        $footer.append($footerLeft, $footerMid, $footerRight);

        if (this.#backButton) {
            const $backButton = new Button({
                ...this.#backButton,
                onClick: event => {
                    this.#backButton.onClick(event);
                    this.close('Back');
                },
            });

            $footerLeft.appendChild($backButton);
        }

        $footerMid.textContent = this.#progress;

        const $nextButton = new Button({
            ...this.#nextButton,
            onClick: event => {
                this.#nextButton.onClick(event);
                this.close('Next');
            },
        });

        $footerRight.appendChild($nextButton);
        $nextButton.focus();

        if (!this.#anchor) {
            $hint.style.inset = 0;
            fadeIn({element: this, duration: 250});
            return;
        }

        const $anchor = this.#anchor instanceof HTMLElement
            ? this.#anchor
            : document.querySelector(this.#anchor);

        const {
            left: anchorLeft,
            width: anchorWidth,
            top: anchorTop,
            height: anchorHeight,
        } = $anchor.getBoundingClientRect();

        const anchorMidX = anchorLeft + (anchorWidth / 2);
        const anchorMidY = anchorTop + (anchorHeight / 2);
        const maskRadius = 50;

        $backdrop.style.maskPosition = `0 0,
            ${anchorMidX - maskRadius}px ${anchorMidY - maskRadius}px`;

        const marginX = 8;
        const hintHalfWidth = $hint.offsetWidth / 2;
        const hintMinMidX = marginX + hintHalfWidth;
        const hintMaxMidX = innerWidth - marginX - hintHalfWidth;

        if (anchorMidX < hintMinMidX) {
            $hint.style.left = `${marginX}px`;
        } else if (anchorMidX > hintMaxMidX) {
            $hint.style.right = `${marginX}px`;
        } else {
            $hint.style.left = `${anchorMidX - hintHalfWidth}px`;
        }

        const $caret = document.createElement('div');
        $caret.className = 'caret';
        this.appendChild($caret);

        $caret.style.left = `${anchorMidX - ($caret.offsetWidth / 2)}px`;

        if (anchorTop < innerHeight / 2) {
            const anchorBottom = anchorTop + anchorHeight;
            $caret.classList.add('up');
            $caret.style.top = `${anchorBottom}px`;
            $hint.style.top = `${anchorBottom + ($caret.offsetHeight / 2)}px`;
        } else {
            const anchorOffset = innerHeight - anchorTop;
            $caret.classList.add('down');
            $caret.style.bottom = `${anchorOffset}px`;
            $hint.style.bottom = `${anchorOffset + ($caret.offsetHeight / 2)}px`;
        }

        fadeIn({element: this, duration: 250});
    }

    #onHashChange = _ => this.close('Navigate');

    #onKeyDown = event => {
        if (event.key === 'Escape') {
            this.close('Escape');
        }
    };

    close = async reason => {
        const beforeCloseEvent = new CustomEvent('beforeclose', {
            cancelable: true,
            detail: {reason},
        });

        this.dispatchEvent(beforeCloseEvent);

        if (beforeCloseEvent.defaultPrevented) {
            return;
        }

        await fadeOut({element: this, duration: 250});

        const closeEvent = new CustomEvent('close', {
            detail: {reason},
        });

        this.dispatchEvent(closeEvent);
        this.remove();
    };

    static render(...params) {
        const $hint = new Hint(...params);
        document.querySelector('app-component').appendChild($hint);
        return $hint;
    }
}

customElements.define('hint-component', Hint);
