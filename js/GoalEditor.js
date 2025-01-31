import CustomElement from './CustomElement.js';
import GoalsData from './data/GoalsData.js';
import Input from './Input.js';

const stylesheet = new CSSStyleSheet();

stylesheet.replace(`goal-editor-component {
    display: flex;
    flex-direction: column;
    gap: 1em;
}`);

export default class GoalEditor extends CustomElement {
    #id;
    #created;
    #name;
    #description;
    #points;
    #repeat;
    #completed;

    $name;
    $description;
    $points;
    $repeat;
    $completed;

    constructor({id, created, name, description, points, repeat, completed}) {
        super();

        this.#id = id;
        this.#created = created;
        this.#name = name;
        this.#description = description;
        this.#points = points;
        this.#repeat = repeat;
        this.#completed = completed;
    }

    connectedCallback() {
        this.#render();
    }

    #render() {
        this.applyStylesheet(stylesheet);

        this.$name = new Input({
            disabled: this.#completed,
            id: 'name-input',
            label: 'Name',
            required: true,
            type: 'text',
            value: this.#name,
        });

        this.appendChild(this.$name);
        this.$name.focus();

        this.$description = new Input({
            disabled: this.#completed,
            id: 'description-input',
            label: 'Description',
            type: 'text',
            value: this.#description,
        });

        this.appendChild(this.$description);

        this.$points = new Input({
            disabled: this.#completed,
            id: 'points-input',
            label: 'Points',
            min: 0,
            required: true,
            type: 'number',
            value: this.#points,
        });

        this.appendChild(this.$points);

        this.$repeat = new Input({
            disabled: this.#completed,
            id: 'repeat-input',
            label: 'Repeat this goal when completed',
            type: 'checkbox',
            value: this.#repeat,
        });

        this.appendChild(this.$repeat);

        if (this.#completed) {
            this.$completed = new Input({
                id: 'completed-input',
                label: 'Completed',
                type: 'datetime-local',
                value: this.#completed,
            });

            this.appendChild(this.$completed);
        }
    }

    save() {
        if (!this.#validate()) {
            return;
        }

        const goal = {
            id: this.#id || crypto.randomUUID(),
            created: this.#created || new Date().getTime(),
            name: this.$name.value,
            description: this.$description.value,
            points: this.$points.value,
            repeat: this.$repeat.value,
            completed: this.$completed?.value,
        };

        if (!this.#id) {
            GoalsData.add(goal);
            document.dispatchEvent(new Event('GoalCreated'));
        } else {
            GoalsData.update(goal);
            document.dispatchEvent(new Event('GoalUpdated'));
        }

        return true;
    }

    #validate() {
        return this.$name.validate() && this.$points.validate();
    }
}

customElements.define('goal-editor-component', GoalEditor);
