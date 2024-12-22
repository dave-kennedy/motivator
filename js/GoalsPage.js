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
    overflow-x: hidden;
}`);

export default class GoalsPage extends CustomElement {
    #goals;

    pageId = 'goals';
    pageTitle = 'Goals';

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
            document.dispatchEvent(new Event('GoalsPageRendered'));
        } else {
            this.replaceChildren();
        }
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
        return GoalsData.uncompleted
            .sort((goal1, goal2) => {
                return goal1.created < goal2.created ? -1 : 1;
            });
    }

    #newGoal() {
        const $editor = new GoalEditor({});
        this.appendChild($editor);
    }
}

customElements.define('goals-page-component', GoalsPage);
