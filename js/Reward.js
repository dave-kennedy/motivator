import CheckButton from './CheckButton.js';
import CustomElement from './CustomElement.js';
import RewardEditor from './RewardEditor.js';
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

reward-component check-button-component {
    height: 6.25em;
    width: 6.25em;

    position: absolute;
    left: -3em;
    top: -1em;
}

reward-component.redeemed, reward-component.unredeemed {
    margin-bottom: calc(var(--height) * -1 - 1em);
    transition:
        translate 500ms cubic-bezier(0.5, 0, 0.5, -0.5) 750ms,
        margin-bottom 250ms 1250ms;
}

reward-component.redeemed {
    translate: 100vw 0;
}

reward-component.unredeemed {
    translate: -100vw 0;
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

        const $checkButton = new CheckButton({
            checked: this.#redeemed,
            onClick: _ => this.#redeemed ? this.#unredeem() : this.#redeem(),
        });

        this.appendChild($checkButton);
    }

    async #redeem() {
        this.#redeemed = new Date().getTime();

        RewardsData.update({
            id: this.#id,
            redeemed: this.#redeemed,
        });

        document.dispatchEvent(new Event('RewardRedeemed'));

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

        this.classList.add('redeemed');

        const {height} = this.getBoundingClientRect();
        this.style.setProperty('--height', `${height}px`);

        await Promise.allSettled(this.getAnimations().map(a => a.finished));
        this.remove();
    }

    async #unredeem() {
        this.#redeemed = undefined;

        RewardsData.update({
            id: this.#id,
            redeemed: undefined,
        });

        document.dispatchEvent(new Event('RewardUnredeemed'));

        this.classList.add('unredeemed');

        const {height} = this.getBoundingClientRect();
        this.style.setProperty('--height', `${height}px`);

        await Promise.allSettled(this.getAnimations().map(a => a.finished));
        this.remove();
    }

    #edit() {
        const $editor = new RewardEditor({
            id: this.#id,
            created: this.#created,
            name: this.#name,
            description: this.#description,
            points: this.#points,
            repeat: this.#repeat,
            redeemed: this.#redeemed,
        });

        this.replaceWith($editor);
    }
}

customElements.define('reward-component', Reward);
