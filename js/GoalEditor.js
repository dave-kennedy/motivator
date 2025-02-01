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
    #data;

    $name;
    $description;
    $points;
    $repeat;
    $completed;

    constructor(data = {}) {
        super();

        this.#data = data;
    }

    connectedCallback() {
        this.#render();
    }

    #render() {
        this.applyStylesheet(stylesheet);

        this.$name = new Input({
            disabled: this.#data.completed,
            id: 'name-input',
            label: 'Name',
            required: true,
            type: 'text',
            value: this.#data.name,
        });

        this.appendChild(this.$name);
        this.$name.focus();

        this.$description = new Input({
            disabled: this.#data.completed,
            id: 'description-input',
            label: 'Description',
            type: 'text',
            value: this.#data.description,
        });

        this.appendChild(this.$description);

        this.$points = new Input({
            disabled: this.#data.completed,
            id: 'points-input',
            label: 'Points',
            min: 0,
            required: true,
            type: 'number',
            value: this.#data.points,
        });

        this.appendChild(this.$points);

        this.$repeat = new Input({
            disabled: this.#data.completed,
            id: 'repeat-input',
            label: 'Repeat this goal when completed',
            type: 'checkbox',
            value: this.#data.repeat,
        });

        this.appendChild(this.$repeat);

        if (this.#data.completed) {
            this.$completed = new Input({
                id: 'completed-input',
                label: 'Completed',
                type: 'datetime-local',
                value: this.#data.completed,
            });

            this.appendChild(this.$completed);
        }
    }

    save() {
        if (!this.#validate()) {
            return;
        }

        const data = {
            id: this.#data.id || crypto.randomUUID(),
            created: this.#data.created || new Date().getTime(),
            name: this.$name.value,
            description: this.$description.value,
            points: this.$points.value,
            repeat: this.$repeat.value,
            completed: this.$completed?.value,
        };

        if (!this.#data.id) {
            GoalsData.add(data);
            this.raiseEvent('GoalCreated', data);
        } else {
            GoalsData.update(data);
            this.raiseEvent('GoalEdited', data);
        }

        return true;
    }

    #validate() {
        return this.$name.validate() && this.$points.validate();
    }
}

customElements.define('goal-editor-component', GoalEditor);
