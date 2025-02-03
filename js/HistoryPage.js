import ActionButton from './ActionButton.js';
import CustomElement from './CustomElement.js';
import Goal from './Goal.js';
import GoalsData from './data/GoalsData.js';
import Reward from './Reward.js';
import RewardsData from './data/RewardsData.js';

const stylesheet = new CSSStyleSheet();

stylesheet.replace(`history-page-component {
    display: flex;
    flex-direction: column;
}`);

export default class HistoryPage extends CustomElement {
    #loaded;

    pageId = 'history';
    pageTitle = 'History';

    connectedCallback() {
        document.addEventListener('GoalCompleted', this.#onDataChange);
        document.addEventListener('GoalEdited', this.#onDataChange);
        document.addEventListener('RewardRedeemed', this.#onDataChange);
        document.addEventListener('RewardEdited', this.#onDataChange);
    }

    disconnectedCallback() {
        document.removeEventListener('GoalCompleted', this.#onDataChange);
        document.removeEventListener('GoalEdited', this.#onDataChange);
        document.removeEventListener('RewardRedeemed', this.#onDataChange);
        document.removeEventListener('RewardEdited', this.#onDataChange);
    }

    onPageTransitionStart() {
        ActionButton.remove();

        if (!this.#loaded) {
            this.#render();
        }
    }

    onPageTransitionEnd() {
        this.raiseEvent('HistoryPageRendered');
    }

    #render() {
        this.applyStylesheet(stylesheet);

        this.#loaded = true;

        for (const data of [...GoalsData.completed, ...RewardsData.redeemed]) {
            this.#addItem(data);
        }
    }

    #onDataChange = event => {
        if (!this.#loaded) {
            return;
        }

        if (event.type === 'GoalCompleted' || event.type === 'RewardRedeemed') {
            this.#addItem(event.detail);
        } else if (!this.classList.contains('hidden')) {
            this.#updateItem(event.detail);
        }
    };

    #addItem(data) {
        if (data.completed) {
            const $goal = new Goal(data);
            $goal.style.order = this.#sortOrder(data.completed);
            this.appendChild($goal);
        } else {
            const $reward = new Reward(data);
            $reward.style.order = this.#sortOrder(data.redeemed);
            this.appendChild($reward);
        }
    }

    #updateItem(data) {
        document.getElementById(data.id).remove();
        this.#addItem(data);
    }

    #sortOrder(date) {
        return `${1734930000000 - date}`.slice(0, -3);
    }
}

customElements.define('history-page-component', HistoryPage);
