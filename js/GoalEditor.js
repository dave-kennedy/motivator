import CustomElement from './CustomElement.js';
import GoalsData from './data/GoalsData.js';
import Input from './Input.js';
import Select from './Select.js';

const stylesheet = new CSSStyleSheet();

stylesheet.replace(`goal-editor-component {
    display: flex;
    flex-direction: column;
    gap: 1em;
}

goal-editor-component .repeat-options:not([hidden]) {
    border: none;
    margin: 0;
    padding: 0 0 0 1.5em;

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
    $repeatDuration;
    $repeatFrequency;
    $startDate;
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
            className: 'row-reverse',
            id: 'repeat-input',
            label: 'Repeat',
            type: 'checkbox',
            value: this.#data.repeat,
        });

        this.appendChild(this.$repeat);

        const $repeatOptions = document.createElement('fieldset');
        $repeatOptions.className = 'repeat-options';
        $repeatOptions.hidden = !this.#data.repeat;
        this.appendChild($repeatOptions);

        this.$repeat.addEventListener('change', event => {
            $repeatOptions.hidden = !event.target.checked;
        });

        this.$repeatFrequency = new Select({
            id: 'repeat-frequency-select',
            label: 'How often?',
            options: ['daily', 'weekly', 'monthly', 'yearly'],
            placeholder: 'immediately',
            value: this.#data.repeatFrequency,
        });

        $repeatOptions.appendChild(this.$repeatFrequency);

        this.$repeatDuration = new Input({
            id: 'repeat-duration-input',
            label: 'How many times?',
            placeholder: 'indefinitely',
            type: 'number',
            value: this.#data.repeatDuration,
        });

        $repeatOptions.appendChild(this.$repeatDuration);

        this.$startDate = new Input({
            id: 'start-date-input',
            label: 'Start date',
            type: 'date',
            value: this.#data.startDate,
        });

        this.appendChild(this.$startDate);
    }

    save() {
        if (!this.#validate()) {
            return;
        }

        const data = {
            id: this.#data.id || crypto.randomUUID(),
            created: this.#data.created || Date.now(),
            name: this.$name.value,
            description: this.$description.value || undefined,
            points: this.$points.value,
        };

        if (this.#data.completed) {
            data.repeat = this.#data.repeat;
            data.repeatDuration = this.#data.repeatDuration;
            data.repeatFrequency = this.#data.repeatFrequency;
            data.startDate = this.#data.startDate;
            data.completed = this.$completed.value;
        } else {
            data.repeat = this.$repeat.value || undefined;
            data.repeatDuration = this.$repeatDuration.value || undefined;
            data.repeatFrequency = this.$repeatFrequency.value || undefined;
            data.startDate = this.$startDate.value || undefined;
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
            this.$repeatDuration?.validate(),
            this.$completed?.validate(),
        ].includes(false);
    }
}

customElements.define('goal-editor-component', GoalEditor);
