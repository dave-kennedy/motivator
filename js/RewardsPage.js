import ActionButton from './ActionButton.js';
import CustomElement from './CustomElement.js';
import List from './List.js';
import Reward from './Reward.js';
import RewardEditor from './RewardEditor.js';
import RewardsData from './data/RewardsData.js';

const stylesheet = new CSSStyleSheet();

stylesheet.replace(`rewards-page-component {
    display: block;
}

rewards-page-component list-component {
    margin: auto;
    max-width: 32em;
}`);

export default class RewardsPage extends CustomElement {
    #rendered;

    $list;

    pageId = 'rewards';
    pageTitle = 'Rewards';

    connectedCallback() {
        document.addEventListener('RewardCreated', this.#onDataChange);
        document.addEventListener('RewardDeleted', this.#onDataChange);
        document.addEventListener('RewardEdited', this.#onDataChange);
        document.addEventListener('RewardRedeemed', this.#onDataChange);
        document.addEventListener('RewardRepeated', this.#onDataChange);
        document.addEventListener('RewardUnredeemed', this.#onDataChange);
    }

    disconnectedCallback() {
        document.removeEventListener('RewardCreated', this.#onDataChange);
        document.removeEventListener('RewardDeleted', this.#onDataChange);
        document.removeEventListener('RewardEdited', this.#onDataChange);
        document.removeEventListener('RewardRedeemed', this.#onDataChange);
        document.removeEventListener('RewardRepeated', this.#onDataChange);
        document.removeEventListener('RewardUnredeemed', this.#onDataChange);
    }

    onPageVisible() {
        ActionButton.render({
            label: 'New Reward',
            onClick: _ => RewardEditor.render(),
        });

        if (!this.#rendered) {
            this.#render();
            this.#rendered = true;
        }

        this.raiseEvent('RewardsPageRendered');
    }

    #render() {
        this.applyStylesheet(stylesheet);

        this.$list = new List({
            dataSource: RewardsData,
            filter: i => !i.redeemed,
            itemFactory: data => new Reward(data),
            pageSize: 10,
            sort: (a, b) => {
                const now = Date.now();
                if (a.startDate > now && b.startDate > now) return a.startDate - b.startDate;
                if (a.startDate > now) return 1;
                if (b.startDate > now) return -1;
                return a.created - b.created;
            },
        });

        this.appendChild(this.$list);
    }

    #onDataChange = event => {
        if (!this.#rendered) {
            return;
        }

        if (event.type === 'RewardCreated' || event.type === 'RewardUnredeemed') {
            this.$list?.addItem(event.detail);
            return;
        }

        if (event.type === 'RewardDeleted' || event.type === 'RewardRedeemed') {
            this.$list?.deleteItem(event.detail);
            return;
        }

        if (event.type === 'RewardEdited') {
            this.$list?.updateItem(event.detail);
            return;
        }

        // RewardRepeated
        this.$list?.updateItem(event.detail.redeemed, event.detail.repeated);
    };
}

customElements.define('rewards-page-component', RewardsPage);
