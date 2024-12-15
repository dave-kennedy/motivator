import CustomElement from './CustomElement.js';
import GoalsData from './data/GoalsData.js';
import RewardsData from './data/RewardsData.js';

const stylesheet = new CSSStyleSheet();

stylesheet.replace(`header-component {
    background-color: #666;
    box-sizing: border-box;
    color: #fff;
    padding: 1em;

    display: flex;
    align-items: center;
}

header-component .points {
    font-size: 2em;
    font-weight: bold;
}

header-component .points::after {
    content: ' points';
    font-size: 1rem;
}

@media (min-height: 800px) {
    header-component .points {
        font-size: 4em;
    }
}`);

export default class Header extends CustomElement {
    #points;

    constructor() {
        super();

        document.addEventListener('GoalCompleted', _ => this.#refresh());
        document.addEventListener('GoalUncompleted', _ => this.#refresh());
        document.addEventListener('GoalDeleted', _ => this.#refresh());
        document.addEventListener('RewardRedeemed', _ => this.#refresh());
        document.addEventListener('RewardUnredeemed', _ => this.#refresh());
        document.addEventListener('RewardDeleted', _ => this.#refresh());
    }

    connectedCallback() {
        this.#render();
    }

    #render() {
        this.applyStylesheet(stylesheet);

        this.#points = this.#load();

        const $points = document.createElement('div');
        $points.className = 'points';
        $points.textContent = this.#points;
        this.appendChild($points);
    }

    #load() {
        const goals = GoalsData.items
            .filter(goal => goal.completed);

        const rewards = RewardsData.items
            .filter(reward => reward.redeemed);

        return [...goals, ...rewards].reduce((total, item) => {
            return item.completed
                ? total + item.points
                : total - item.points;
        }, 0);
    }

    #refresh() {
        this.replaceChildren();
        this.#render();
    }
}

customElements.define('header-component', Header);
