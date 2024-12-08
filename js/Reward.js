import CustomElement from './CustomElement.js';

const stylesheet = new CSSStyleSheet();

stylesheet.replace(`reward-component {
    background-color: #eee;
    border-radius: 1em;
    box-sizing: border-box;
    padding: 1em;

    display: flex;
    flex-direction: column;
    gap: 0.5em;
}

@media (min-width: 400px) {
    reward-component {
        align-self: center;
        width: 80%;
    }
}

@media (min-width: 800px) {
    reward-component {
        align-self: center;
        width: 60%;
    }
}

reward-component .name {
    font-weight: bold;
}`);

export default class Reward extends CustomElement {
    #id;
    #created;
    #name;
    #description;
    #points;
    #repeat;
    #redeemed;

    constructor({id, created, name, description, points, repeat, redeemed}) {
        super();

        this.#id = id;
        this.#created = created;
        this.#name = name;
        this.#description = description;
        this.#points = points;
        this.#repeat = repeat;
        this.#redeemed = redeemed;
    }

    connectedCallback() {
        this.#render();
    }

    #render() {
        this.applyStylesheet(stylesheet);

        const $name = document.createElement('div');
        $name.className = 'name';
        $name.textContent = this.#name;
        this.appendChild($name);

        if (this.#description) {
            const $description = document.createElement('div');
            $description.textContent = this.#description;
            this.appendChild($description);
        }

        const $points = document.createElement('div');
        $points.textContent = `Points: ${this.#points}`;
        this.appendChild($points);

        if (this.#repeat) {
            const $repeat = document.createElement('div');
            $repeat.textContent = `↻ Repeats`;
            this.appendChild($repeat);
        }

        if (this.#redeemed) {
            const $redeemed = document.createElement('div');
            $redeemed.textContent = this.#redeemed;
            this.appendChild($redeemed);
        }
    }
}

customElements.define('reward-component', Reward);
