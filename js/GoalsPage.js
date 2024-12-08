import CustomElement from './CustomElement.js';
import GoalsData from './data/GoalsData.js';

const stylesheet = new CSSStyleSheet();

stylesheet.replace(`goals-page-component {
    display: flex;
    align-items: center;
    flex-direction: column;
    gap: 1em;
}`);

export default class GoalsPage extends CustomElement {
    #goals;

    pageId = 'goals';
    pageTitle = 'Goals';

    constructor() {
        super();
    }

    connectedCallback() {
        this.#render();
    }

    #render() {
        this.applyStylesheet(stylesheet);

        this.#goals = this.#load();

        for (const goal of this.#goals) {
            const $goal = document.createElement('div');
            $goal.textContent = goal.name;
            this.appendChild($goal);
        }
    }

    #load() {
        return [...GoalsData.items]
            .filter(goal => !goal.completed)
            .sort((a, b) => a.created < b.created ? -1 : 1);
    }
}

customElements.define('goals-page-component', GoalsPage);
