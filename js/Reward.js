import Button from './Button.js';
import CustomElement from './CustomElement.js';
import RewardsData from './data/RewardsData.js';

const stylesheet = new CSSStyleSheet();

stylesheet.replace(`reward-component {
    background-color: #eee;
    border-radius: 1em;
    box-sizing: border-box;
    margin-left: 1.25em;
    padding: 1em 1em 1em 2em;
    position: relative;

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
}

reward-component .redeem-button {
    position: absolute;
    left: -1.25em;
    top: 1em;
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

        const $redeemButton = new Button({
            className: 'redeem-button round',
            icon: {
                alt: this.#redeemed ? 'Unredeem' : 'Redeem',
                src: this.#redeemed ? 'img/uncheck.svg' : 'img/check.svg',
            },
            onClick: _ => this.#redeemed ? this.#unredeem() : this.#redeem(),
            title: this.#redeemed ? 'Unredeem' : 'Redeem',
        });

        this.appendChild($redeemButton);
    }

    async #redeem() {
        this.#redeemed = new Date().getTime();

        RewardsData.update({
            id: this.#id,
            redeemed: this.#redeemed,
        });

        if (this.#repeat) {
            const newReward = {
                id: crypto.randomUUID(),
                created: new Date().getTime(),
                name: this.#name,
                description: this.#description,
                points: this.#points,
                repeat: this.#repeat,
            };

            RewardsData.add(newReward);
            const $newReward = new Reward(newReward);
            this.after($newReward);
        }

        await this.animate({opacity: [1, 0]}, 300).finished;
        this.remove();
    }

    async #unredeem() {
        this.#redeemed = undefined;

        RewardsData.update({
            id: this.#id,
            redeemed: undefined,
        });

        await this.animate({opacity: [1, 0]}, 300).finished;
        this.remove();
    }
}

customElements.define('reward-component', Reward);
