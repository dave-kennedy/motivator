import CustomElement from './CustomElement.js';

const stylesheet = new CSSStyleSheet();

stylesheet.replace(`check-button-component button {
    background: none;
    border-radius: 50%;
    border: none;
    cursor: pointer;
    font: inherit;
    height: 40%;
    margin: 30%;
    padding: 0;
    position: absolute;
    width: 40%;
}

check-button-component .outer-circle {
    opacity: 1;
    scale: 1;
    transform-origin: center;
    transition: opacity 500ms 500ms, scale 500ms 500ms;
}

check-button-component .inner-circle {
    scale: 0;
    transform-origin: center;
    transition: scale 500ms 500ms;
}

check-button-component .check-mark {
    stroke-dasharray: 0, 100;
    transition: stroke-dasharray 500ms;
}

check-button-component.checked .outer-circle {
    opacity: 0;
    scale: 2.5;
    transition: opacity 500ms, scale 500ms;
}

check-button-component.checked .inner-circle {
    scale: 1;
    transition: scale 500ms cubic-bezier(0.5, 2.5, 0.5, 1);
}

check-button-component.checked .check-mark {
    stroke-dasharray: 100, 0;
    transition: stroke-dasharray 500ms 500ms;
}`);

export default class CheckButton extends CustomElement {
    #checked;
    #onClick;
    #upcoming;

    constructor({checked, onClick, upcoming}) {
        super();

        this.#checked = checked;
        this.#onClick = onClick;
        this.#upcoming = upcoming;
    }

    connectedCallback() {
        this.#render();
    }

    #render() {
        this.applyStylesheet(stylesheet);

        if (this.#upcoming) {
            this.#renderUpcoming();
            return;
        }

        if (this.#checked) {
            this.className = 'checked';
        }

        const $button = document.createElement('button');

        $button.addEventListener('click', _ => {
            this.classList.toggle('checked');
            this.#onClick();
        });

        this.appendChild($button);

        const $svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        $svg.setAttribute('viewBox', '0 0 250 250');

        $svg.innerHTML = `
            <circle class="outer-circle" cx="125" cy="125" r="46" fill="#fff" stroke="#0aa" stroke-width="8" />
            <circle class="inner-circle" cx="125" cy="125" r="50" fill="#93c" />
            <path class="check-mark" d="m 90,125 25,25 45,-45" fill="none" stroke="#fff" stroke-width="8" />
        `;

        this.appendChild($svg);
    }

    #renderUpcoming() {
        const $svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        $svg.setAttribute('viewBox', '0 0 250 250');

        $svg.innerHTML = `
            <circle cx="125" cy="125" r="46" fill="#fff" stroke="#999" stroke-width="8" />
            <path d="m 125,95 0,30 25,25" fill="none" stroke="#999" stroke-width="8" />
        `;

        this.appendChild($svg);
    }
}

customElements.define('check-button-component', CheckButton);
