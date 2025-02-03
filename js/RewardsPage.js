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
}`);

export default class RewardsPage extends CustomElement {
    #loaded;

    pageId = 'rewards';
    pageTitle = 'Rewards';

    connectedCallback() {
        document.addEventListener('RewardCreated', this.#onDataChange);
        document.addEventListener('RewardEdited', this.#onDataChange);
        document.addEventListener('RewardUnredeemed', this.#onDataChange);
    }

    disconnectedCallback() {
        document.removeEventListener('RewardCreated', this.#onDataChange);
        document.removeEventListener('RewardEdited', this.#onDataChange);
        document.removeEventListener('RewardUnredeemed', this.#onDataChange);
    }

    onPageTransitionStart() {
        ActionButton.render({
            label: 'New Reward',
            onClick: _ => this.#newReward(),
        });

        if (!this.#loaded) {
            this.#render();
        }
    }

    onPageTransitionEnd() {
        this.raiseEvent('RewardsPageRendered');
    }

    #render() {
        this.applyStylesheet(stylesheet);

        this.#loaded = true;

        for (const data of RewardsData.unredeemed) {
            this.#addReward(data);
        }
    }

    #onDataChange = event => {
        if (!this.#loaded) {
            return;
        }

        if (event.type === 'RewardCreated' || event.type === 'RewardUnredeemed') {
            this.#addReward(event.detail);
        } else if (!this.classList.contains('hidden')) {
            this.#updateReward(event.detail);
        }
    };

    #addReward(data) {
        const $reward = new Reward(data);

        if (data.startDate > Date.now()) {
            $reward.style.order = this.#sortOrder(data.startDate);
        } else {
            $reward.style.order = this.#sortOrder(data.created);
        }

        this.appendChild($reward);
    }

    #updateReward(data) {
        document.getElementById(data.id).remove();
        this.#addReward(data);
    }

    #sortOrder(date) {
        return `${date - 1734930000000}`.slice(0, -3);
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
