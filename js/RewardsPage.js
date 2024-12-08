import CustomElement from './CustomElement.js';
import Reward from './Reward.js';
import RewardsData from './data/RewardsData.js';

const stylesheet = new CSSStyleSheet();

stylesheet.replace(`rewards-page-component {
    display: flex;
    flex-direction: column;
    gap: 1em;
}`);

export default class RewardsPage extends CustomElement {
    #rewards;

    pageId = 'rewards';
    pageTitle = 'Rewards';

    constructor() {
        super();
    }

    connectedCallback() {
        this.#render();
    }

    #render() {
        this.applyStylesheet(stylesheet);

        this.#rewards = this.#load();

        for (const reward of this.#rewards) {
            const $reward = new Reward(reward);
            this.appendChild($reward);
        }
    }

    #load() {
        return [...RewardsData.items]
            .filter(reward => !reward.redeemed)
            .sort((a, b) => a.created < b.created ? -1 : 1);
    }
}

customElements.define('rewards-page-component', RewardsPage);
