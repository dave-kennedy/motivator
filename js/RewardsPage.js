import ActionButton from './ActionButton.js';
import CustomElement from './CustomElement.js';
import Modal from './Modal.js';
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
    #dirty;
    #rewards;

    pageId = 'rewards';
    pageTitle = 'Rewards';

    constructor() {
        super();

        document.addEventListener('RewardUnredeemed', _ => this.#dirty = true);
    }

    onPageTransitionStart() {
        ActionButton.render({
            label: 'New Reward',
            onClick: _ => this.#newReward(),
        });

        if (this.#dirty || !this.#rewards) {
            this.replaceChildren();
            this.#render();
        }
    }

    onPageTransitionEnd() {
        this.raiseEvent('RewardsPageRendered');
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
        return RewardsData.unredeemed
            .sort((reward1, reward2) => {
                return reward1.created < reward2.created ? -1 : 1;
            });
    }

    #newReward() {
        const $editor = new RewardEditor();

        Modal.render({
            content: $editor,
            buttons: [
                {label: 'Cancel'},
                {label: 'Save', onClick: _ => $editor.save()},
            ],
        });
    }
}

customElements.define('rewards-page-component', RewardsPage);
