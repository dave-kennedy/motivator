import CustomElement from './CustomElement.js';

const stylesheet = new CSSStyleSheet();

stylesheet.replace(`rewards-page-component {
    display: flex;
    align-items: center;
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

        this.#rewards = [1, 2, 3];

        for (const reward of this.#rewards) {
            const $reward = document.createElement('div');
            $reward.textContent = `reward-${reward}`;
            this.appendChild($reward);
        }
    }
}

customElements.define('rewards-page-component', RewardsPage);
