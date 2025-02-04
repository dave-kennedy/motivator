import ConfigData from './data/ConfigData.js';
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
}

check-button-component.checked .stars {
    color: transparent;
    height: 5px;
    width: 5px;

    position: absolute;
    left: 50%;
    top: 50%;
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

        $button.addEventListener('click', async _ => {
            if (this.classList.toggle('checked') && ConfigData.get('animations') === 'fancy') {
                this.#renderStars();
            }

            await Promise.all(this.getAnimations({subtree: true}).map(a => a.finished));
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

    async #renderStars() {
        const stars = document.createElement('div');
        stars.className = 'stars';
        stars.textContent = '✦';
        this.appendChild(stars);

        await stars.animate({
            opacity: [1, 1, 1, 0],
            textShadow: [`
                -49px -33px #00f,-12px -76px #ff0,-34px 68px #ff0,-32px -19px #0ff,
                -97px 35px #ff0,-22px -4px #f00,61px -69px #0f0,20px 79px #f00,
                70px 14px #ff0,100px -18px #f00,-39px -17px #0ff,68px 80px #00f,
                83px 7px #ff0,46px 0px #ff0,-8px -89px #0ff,-70px 4px #f00,
                -65px 10px #ff0,-25px -44px #ff0,-7px -26px #ff0,25px 56px #ff0
            `],
        }, {
            duration: 1000,
            easing: 'ease-out'
        }).finished;

        stars.remove();
    }
}

customElements.define('check-button-component', CheckButton);
