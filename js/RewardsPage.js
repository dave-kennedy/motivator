import ActionButton from './ActionButton.js';
import CustomElement from './CustomElement.js';
import Reward from './Reward.js';
import RewardEditor from './RewardEditor.js';
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

    onPageTransitionStart(direction) {
        if (direction === 'in') {
            this.#render();
        }
    }

    onPageTransitionEnd(direction) {
        if (direction === 'in') {
            document.dispatchEvent(new Event('RewardsPageRendered'));
        } else {
            this.replaceChildren();
        }
    }

    #render() {
        this.applyStylesheet(stylesheet);

        this.#rewards = this.#load();

        for (const reward of this.#rewards) {
            const $reward = new Reward(reward);
            this.appendChild($reward);
        }

        ActionButton.render({
            label: 'New Reward',
            onClick: _ => this.#newReward(),
        });
    }

    #load() {
        return RewardsData.unredeemed
            .sort((reward1, reward2) => {
                return reward1.created < reward2.created ? -1 : 1;
            });
    }

    #newReward() {
        const $editor = new RewardEditor({});
        this.appendChild($editor);
    }
}

customElements.define('rewards-page-component', RewardsPage);
