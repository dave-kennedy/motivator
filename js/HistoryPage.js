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
    gap: 1em;
}

history-page-component .date {
    align-self: center;
    font-weight: bold;
}`);

export default class HistoryPage extends CustomElement {
    #groups;

    pageId = 'history';
    pageTitle = 'History';

    constructor() {
        super();
    }

    onPageVisible() {
        this.replaceChildren();
        this.#render();
    }

    #render() {
        this.applyStylesheet(stylesheet);

        this.#groups = this.#load();

        for (const [date, items] of this.#groups) {
            const $date = document.createElement('div');
            $date.className = 'date';
            $date.textContent = date;
            this.appendChild($date);

            for (const item of items) {
                if (item.completed) {
                    const $goal = new Goal(item);
                    this.appendChild($goal);
                } else {
                    const $reward = new Reward(item);
                    this.appendChild($reward);
                }
            }
        }

        ActionButton.remove();
    }

    #load() {
        const goals = GoalsData.items
            .filter(goal => goal.completed)
            .sort((a, b) => a.completed < b.completed ? 1 : -1);

        const rewards = RewardsData.items
            .filter(reward => reward.redeemed)
            .sort((a, b) => a.redeemed < b.redeemed ? 1 : -1);

        return this.#group([...goals, ...rewards], item => {
            return item.completed
                ? new Date(item.completed).toLocaleDateString()
                : new Date(item.redeemed).toLocaleDateString();
        });
    }

    #group(items, callback) {
        const groups = new Map();

        for (const item of items) {
            let thisList = groups.get(callback(item));

            if (thisList === undefined) {
                thisList = [];
                groups.set(callback(item), thisList);
            }

            thisList.push(item);
        }

        return groups;
    }
}

customElements.define('history-page-component', HistoryPage);
