import Button from './Button.js';
import CustomElement from './CustomElement.js';

import {fadeIn, fadeOut} from './animation.js';

const stylesheet = new CSSStyleSheet();

stylesheet.replace(`tip-component {
    position: fixed;
    inset: 0;
    z-index: 10;
}

tip-component .tip {
    background-color: #fff;
    border: 1px solid #999;
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
    tip-component .tip {
        max-width: 26em;
    }
}

tip-component .footer {
    display: flex;
    align-items: center;
    gap: 1em;
}

tip-component .footer > :first-child {
    flex: 1;
    text-align: left;
}

tip-component .footer > :nth-child(2) {
    flex: 1;
    text-align: center;
}

tip-component .footer > :last-child {
    flex: 1;
    text-align: right;
}

tip-component .caret {
    background-color: #fff;
    rotate: 45deg;

    height: 1em;
    width: 1em;

    position: fixed;
}

tip-component .caret.up {
    border-left: 1px solid #999;
    border-top: 1px solid #999;
}

tip-component .caret.down {
    border-bottom: 1px solid #999;
    border-right: 1px solid #999;
}`);

export default class Tip extends CustomElement {
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

        document.addEventListener('keydown', this.#onKeyDown);
        addEventListener('hashchange', this.close);
    }

    disconnectedCallback() {
        document.removeEventListener('keydown', this.#onKeyDown);
        removeEventListener('hashchange', this.close);
    }

    #render() {
        this.applyStylesheet(stylesheet);

        const $tip = document.createElement('div');
        $tip.className = 'tip';
        this.appendChild($tip);

        const $content = document.createElement('div');
        $content.innerHTML = this.#content;
        $tip.appendChild($content);

        const $footer = document.createElement('div');
        $footer.className = 'footer';
        $tip.appendChild($footer);

        const $footerLeft = document.createElement('div');
        const $footerMid = document.createElement('div');
        const $footerRight = document.createElement('div');
        $footer.append($footerLeft, $footerMid, $footerRight);

        if (this.#backButton) {
            const $backButton = new Button({
                ...this.#backButton,
                onClick: event => {
                    this.#backButton.onClick(event);
                    this.close();
                },
            });

            $footerLeft.appendChild($backButton);
        }

        $footerMid.textContent = this.#progress;

        const $nextButton = new Button({
            ...this.#nextButton,
            onClick: event => {
                this.#nextButton.onClick(event);
                this.close();
            },
        });

        $footerRight.appendChild($nextButton);
        $nextButton.focus();

        if (!this.#anchor) {
            $tip.style.inset = 0;
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
        const marginX = 8;
        const tipHalfWidth = $tip.offsetWidth / 2;
        const tipMinMidX = marginX + tipHalfWidth;
        const tipMaxMidX = innerWidth - marginX - tipHalfWidth;

        if (anchorMidX < tipMinMidX) {
            $tip.style.left = `${marginX}px`;
        } else if (anchorMidX > tipMaxMidX) {
            $tip.style.right = `${marginX}px`;
        } else {
            $tip.style.left = `${anchorMidX - tipHalfWidth}px`;
        }

        const $caret = document.createElement('div');
        $caret.className = 'caret';
        this.appendChild($caret);

        $caret.style.left = `${anchorMidX - ($caret.offsetWidth / 2)}px`;

        if (anchorTop < innerHeight / 2) {
            const anchorBottom = anchorTop + anchorHeight;
            $caret.classList.add('up');
            $caret.style.top = `${anchorBottom}px`;
            $tip.style.top = `${anchorBottom + ($caret.offsetHeight / 2)}px`;
        } else {
            const anchorOffset = innerHeight - anchorTop;
            $caret.classList.add('down');
            $caret.style.bottom = `${anchorOffset}px`;
            $tip.style.bottom = `${anchorOffset + ($caret.offsetHeight / 2)}px`;
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
        const $tip = new Tip(...params);
        document.querySelector('app-component').appendChild($tip);
        return $tip;
    }
}

customElements.define('tip-component', Tip);
