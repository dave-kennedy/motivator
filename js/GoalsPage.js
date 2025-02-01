import ActionButton from './ActionButton.js';
import CustomElement from './CustomElement.js';
import Goal from './Goal.js';
import GoalEditor from './GoalEditor.js';
import GoalsData from './data/GoalsData.js';
import Modal from './Modal.js';

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

    connectedCallback() {
        document.addEventListener('GoalUncompleted', this.#onDataChange);
    }

    disconnectedCallback() {
        document.removeEventListener('GoalUncompleted', this.#onDataChange);
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
        this.raiseEvent('GoalsPageRendered');
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
        const $editor = new GoalEditor();

        Modal.render({
            content: $editor,
            buttons: [
                {label: 'Cancel'},
                {label: 'Save', onClick: _ => $editor.save()},
            ],
        });
    }

    #onDataChange = _ => this.#dirty = true;
}

customElements.define('goals-page-component', GoalsPage);
