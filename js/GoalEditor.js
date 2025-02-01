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
            id: 'name-input',
            label: 'Name',
            required: true,
            type: 'text',
            value: this.#data.name,
        });

        this.appendChild(this.$name);
        this.$name.focus();

        this.$description = new Input({
            id: 'description-input',
            label: 'Description',
            type: 'text',
            value: this.#data.description,
        });

        this.appendChild(this.$description);

        this.$points = new Input({
            id: 'points-input',
            label: 'Points',
            min: 0,
            required: true,
            type: 'number',
            value: this.#data.points,
        });

        this.appendChild(this.$points);

        if (this.#data.completed) {
            this.$completed = new Input({
                id: 'completed-input',
                label: 'Completed',
                required: true,
                type: 'datetime-local',
                value: this.#data.completed,
            });

            this.appendChild(this.$completed);
            return;
        }

        this.$repeat = new Input({
            id: 'repeat-input',
            label: 'Repeat this goal when completed',
            type: 'checkbox',
            value: this.#data.repeat,
        });

        this.appendChild(this.$repeat);
    }

    save() {
        if (!this.#validate()) {
            return;
        }

        const data = {
            id: this.#data.id || crypto.randomUUID(),
            created: this.#data.created || new Date().getTime(),
            name: this.$name.value,
            description: this.$description.value || undefined,
            points: this.$points.value,
        };

        if (this.#data.completed) {
            data.repeat = this.#data.repeat;
            data.completed = this.$completed.value;
        } else {
            data.repeat = this.$repeat.value || undefined;
        }

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
        return ![
            this.$name.validate(),
            this.$points.validate(),
            this.$completed?.validate(),
        ].includes(false);
    }
}

customElements.define('goal-editor-component', GoalEditor);
