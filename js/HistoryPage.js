import ActionButton from './ActionButton.js';
import CustomElement from './CustomElement.js';
import Goal from './Goal.js';
import HistoryData from './data/HistoryData.js';
import List from './List.js';
import Reward from './Reward.js';

const stylesheet = new CSSStyleSheet();

stylesheet.replace(`history-page-component {
    display: block;
}

@media (min-width: 544px) {
    history-page-component list-component {
        margin: auto;
        width: 32em;
    }
}`);

export default class HistoryPage extends CustomElement {
    #rendered;

    $list;

    pageId = 'history';
    pageTitle = 'History';

    connectedCallback() {
        document.addEventListener('GoalCompleted', this.#onDataChange);
        document.addEventListener('GoalDeleted', this.#onDataChange);
        document.addEventListener('GoalEdited', this.#onDataChange);
        document.addEventListener('GoalRepeated', this.#onDataChange);
        document.addEventListener('GoalUncompleted', this.#onDataChange);
        document.addEventListener('RewardDeleted', this.#onDataChange);
        document.addEventListener('RewardEdited', this.#onDataChange);
        document.addEventListener('RewardRedeemed', this.#onDataChange);
        document.addEventListener('RewardRepeated', this.#onDataChange);
        document.addEventListener('RewardUnredeemed', this.#onDataChange);
    }

    disconnectedCallback() {
        document.removeEventListener('GoalCompleted', this.#onDataChange);
        document.removeEventListener('GoalDeleted', this.#onDataChange);
        document.removeEventListener('GoalEdited', this.#onDataChange);
        document.removeEventListener('GoalRepeated', this.#onDataChange);
        document.removeEventListener('GoalUncompleted', this.#onDataChange);
        document.removeEventListener('RewardDeleted', this.#onDataChange);
        document.removeEventListener('RewardEdited', this.#onDataChange);
        document.removeEventListener('RewardRedeemed', this.#onDataChange);
        document.removeEventListener('RewardRepeated', this.#onDataChange);
        document.removeEventListener('RewardUnredeemed', this.#onDataChange);
    }

    onPageTransitionStart() {
        ActionButton.remove();

        if (!this.#rendered) {
            this.#render();
            this.#rendered = true;
        }
    }

    onPageTransitionEnd() {
        this.raiseEvent('HistoryPageRendered');
    }

    #render() {
        this.applyStylesheet(stylesheet);

        this.$list = new List({
            dataSource: HistoryData,
            itemFactory: data => {
                return data.completed ? new Goal(data) : new Reward(data);
            },
            pageSize: 10,
        });

        this.appendChild(this.$list);
    }

    #onDataChange = event => {
        if (!this.#rendered) {
            return;
        }

        if (event.type === 'GoalCompleted' || event.type === 'RewardRedeemed') {
            this.$list?.addItem(event.detail);
            return;
        }

        if (event.type === 'GoalRepeated' || event.type === 'RewardRepeated') {
            this.$list?.addItem(event.detail.completed || event.detail.redeemed);
            return;
        }

        if (event.type === 'GoalEdited' || event.type === 'RewardEdited') {
            this.$list?.updateItem(event.detail);
            return;
        }

        // GoalDeleted, GoalUncompleted, RewardDeleted, RewardUnredeemed
        this.$list?.deleteItem(event.detail);
    };
}

customElements.define('history-page-component', HistoryPage);
