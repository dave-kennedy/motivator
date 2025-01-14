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
    #dirty;
    #goals;

    pageId = 'goals';
    pageTitle = 'Goals';

    constructor() {
        super();

        document.addEventListener('GoalUncompleted', _ => this.#dirty = true);
    }

    onPageTransitionStart() {
        ActionButton.render({
            label: 'New Goal',
            onClick: _ => this.#newGoal(),
        });

        if (this.#dirty || !this.#goals) {
            this.replaceChildren();
            this.#render();
        }
    }

    onPageTransitionEnd() {
        document.dispatchEvent(new Event('GoalsPageRendered'));
    }

    #render() {
        this.applyStylesheet(stylesheet);

        this.#goals = this.#load();

        for (const goal of this.#goals) {
            const $goal = new Goal(goal);
            this.appendChild($goal);
        }
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
