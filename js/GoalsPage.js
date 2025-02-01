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
    #loaded;

    pageId = 'goals';
    pageTitle = 'Goals';

    connectedCallback() {
        document.addEventListener('GoalCreated', this.#onDataChange);
        document.addEventListener('GoalEdited', this.#onDataChange);
        document.addEventListener('GoalUncompleted', this.#onDataChange);
    }

    disconnectedCallback() {
        document.removeEventListener('GoalCreated', this.#onDataChange);
        document.removeEventListener('GoalEdited', this.#onDataChange);
        document.removeEventListener('GoalUncompleted', this.#onDataChange);
    }

    onPageTransitionStart() {
        ActionButton.render({
            label: 'New Goal',
            onClick: _ => this.#newGoal(),
        });

        if (!this.#loaded) {
            this.#render();
        }
    }

    onPageTransitionEnd() {
        this.raiseEvent('GoalsPageRendered');
    }

    #render() {
        this.applyStylesheet(stylesheet);

        this.#loaded = true;

        for (const data of GoalsData.uncompleted) {
            this.#addGoal(data);
        }
    }

    #onDataChange = event => {
        if (!this.#loaded) {
            return;
        }

        if (event.type === 'GoalCreated' || event.type === 'GoalUncompleted') {
            this.#addGoal(event.detail);
        } else if (!this.classList.contains('hidden')) {
            this.#updateGoal(event.detail);
        }
    };

    #addGoal(data) {
        const $goal = new Goal(data);
        $goal.style.order = this.#sortOrder(data.created);
        this.appendChild($goal);
    }

    #updateGoal(data) {
        document.getElementById(data.id).remove();
        this.#addGoal(data);
    }

    #sortOrder(date) {
        return `${date - 1734930000000}`.slice(0, -3);
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
}

customElements.define('goals-page-component', GoalsPage);
