import ActionButton from './ActionButton.js';
import CustomElement from './CustomElement.js';
import Goal from './Goal.js';
import GoalEditor from './GoalEditor.js';
import GoalsData from './data/GoalsData.js';
import List from './List.js';

const stylesheet = new CSSStyleSheet();

stylesheet.replace(`goals-page-component {
    display: block;
}

@media (min-width: 544px) {
    goals-page-component list-component {
        margin: auto;
        width: 32em;
    }
}`);

export default class GoalsPage extends CustomElement {
    #rendered;

    $list;

    pageId = 'goals';
    pageTitle = 'Goals';

    connectedCallback() {
        document.addEventListener('GoalCompleted', this.#onDataChange);
        document.addEventListener('GoalCreated', this.#onDataChange);
        document.addEventListener('GoalDeleted', this.#onDataChange);
        document.addEventListener('GoalEdited', this.#onDataChange);
        document.addEventListener('GoalRepeated', this.#onDataChange);
        document.addEventListener('GoalUncompleted', this.#onDataChange);
    }

    disconnectedCallback() {
        document.removeEventListener('GoalCompleted', this.#onDataChange);
        document.removeEventListener('GoalCreated', this.#onDataChange);
        document.removeEventListener('GoalDeleted', this.#onDataChange);
        document.removeEventListener('GoalEdited', this.#onDataChange);
        document.removeEventListener('GoalRepeated', this.#onDataChange);
        document.removeEventListener('GoalUncompleted', this.#onDataChange);
    }

    onPageVisible() {
        ActionButton.render({
            label: 'New Goal',
            onClick: _ => GoalEditor.render(),
        });

        if (!this.#rendered) {
            this.#render();
            this.#rendered = true;
        }

        this.raiseEvent('GoalsPageRendered');
    }

    #render() {
        this.applyStylesheet(stylesheet);

        this.$list = new List({
            dataSource: GoalsData,
            filter: i => !i.completed,
            itemFactory: data => new Goal(data),
            pageSize: 10,
            sort: (a, b) => {
                if (a.startDate && b.startDate) return a.startDate - b.startDate;
                if (a.startDate) return 1;
                if (b.startDate) return -1;
                return a.created - b.created;
            },
        });

        this.appendChild(this.$list);
    }

    #onDataChange = event => {
        if (!this.#rendered) {
            return;
        }

        if (event.type === 'GoalCreated' || event.type === 'GoalUncompleted') {
            this.$list?.addItem(event.detail);
            return;
        }

        if (event.type === 'GoalDeleted' || event.type === 'GoalCompleted') {
            this.$list?.deleteItem(event.detail);
            return;
        }

        if (event.type === 'GoalEdited') {
            this.$list?.updateItem(event.detail);
            return;
        }

        // GoalRepeated
        this.$list?.updateItem(event.detail.completed, event.detail.repeated);
    };
}

customElements.define('goals-page-component', GoalsPage);
