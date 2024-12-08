import CustomElement from './CustomElement.js';

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

        this.#goals = [1, 2, 3];

        for (const goal of this.#goals) {
            const $goal = document.createElement('div');
            $goal.textContent = `goal-${goal}`;
            this.appendChild($goal);
        }
    }
}

customElements.define('goals-page-component', GoalsPage);
