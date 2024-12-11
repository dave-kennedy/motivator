import ActionButton from './ActionButton.js';
import CustomElement from './CustomElement.js';
import Goal from './Goal.js';
import GoalEditor from './GoalEditor.js';
import GoalsData from './data/GoalsData.js';

const stylesheet = new CSSStyleSheet();

stylesheet.replace(`goals-page-component {
    display: flex;
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

    onPageVisible() {
        this.replaceChildren();
        this.#render();
    }

    #render() {
        this.applyStylesheet(stylesheet);

        this.#goals = this.#load();

        for (const goal of this.#goals) {
            const $goal = new Goal(goal);
            this.appendChild($goal);
        }

        ActionButton.render({
            label: 'New Goal',
            onClick: _ => this.#newGoal(),
        });
    }

    #load() {
        return [...GoalsData.items]
            .filter(goal => !goal.completed)
            .sort((a, b) => a.created < b.created ? -1 : 1);
    }

    #newGoal() {
        const $editor = new GoalEditor();
        this.appendChild($editor);
    }
}

customElements.define('goals-page-component', GoalsPage);
