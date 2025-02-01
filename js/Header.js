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
    $points;

    connectedCallback() {
        this.#render();

        document.addEventListener('GoalCompleted', this.#onDataChange);
        document.addEventListener('GoalUncompleted', this.#onDataChange);
        document.addEventListener('GoalDeleted', this.#onDataChange);
        document.addEventListener('RewardRedeemed', this.#onDataChange);
        document.addEventListener('RewardUnredeemed', this.#onDataChange);
        document.addEventListener('RewardDeleted', this.#onDataChange);
    }

    disconnectedCallback() {
        document.removeEventListener('GoalCompleted', this.#onDataChange);
        document.removeEventListener('GoalUncompleted', this.#onDataChange);
        document.removeEventListener('GoalDeleted', this.#onDataChange);
        document.removeEventListener('RewardRedeemed', this.#onDataChange);
        document.removeEventListener('RewardUnredeemed', this.#onDataChange);
        document.removeEventListener('RewardDeleted', this.#onDataChange);
    }

    #render() {
        this.applyStylesheet(stylesheet);

        const points = GoalsData.completedPoints - RewardsData.redeemedPoints;
        this.$points = document.createElement('div');
        this.$points.className = 'points';
        this.$points.textContent = points;
        this.appendChild(this.$points);
    }

    #onDataChange = _ => {
        const points = GoalsData.completedPoints - RewardsData.redeemedPoints;
        this.$points.textContent = points;
    };
}

customElements.define('header-component', Header);
