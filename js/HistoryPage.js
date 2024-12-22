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

    onPageTransitionStart(direction) {
        if (direction === 'in') {
            this.#render();
        }
    }

    onPageTransitionEnd(direction) {
        if (direction === 'in') {
            document.dispatchEvent(new Event('HistoryPageRendered'));
        } else {
            this.replaceChildren();
        }
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
        const items = [...GoalsData.completed, ...RewardsData.redeemed]
            .sort((item1, item2) => {
                const date1 = item1.completed || item1.redeemed;
                const date2 = item2.completed || item2.redeemed;
                return date1 < date2 ? 1 : -1;
            });

        return this.#group(items, item => {
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
