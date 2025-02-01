import CustomElement from './CustomElement.js';
import Input from './Input.js';
import RewardsData from './data/RewardsData.js';
import Select from './Select.js';

const stylesheet = new CSSStyleSheet();

stylesheet.replace(`reward-editor-component {
    display: flex;
    flex-direction: column;
    gap: 1em;
}

reward-editor-component .repeat-options:not([hidden]) {
    border: none;
    margin: 0;
    padding: 0 0 0 1.5em;

    display: flex;
    flex-direction: column;
    gap: 1em;
}`);

export default class RewardEditor extends CustomElement {
    #data;

    $name;
    $description;
    $points;
    $repeat;
    $repeatDuration;
    $repeatFrequency;
    $startDate;
    $redeemed;

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

        if (this.#data.redeemed) {
            this.$redeemed = new Input({
                id: 'redeemed-input',
                label: 'Redeemed',
                required: true,
                type: 'datetime-local',
                value: this.#data.redeemed,
            });

            this.appendChild(this.$redeemed);
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

        if (this.#data.redeemed) {
            data.repeat = this.#data.repeat;
            data.repeatDuration = this.#data.repeatDuration;
            data.repeatFrequency = this.#data.repeatFrequency;
            data.startDate = this.#data.startDate;
            data.redeemed = this.$redeemed.value;
        } else {
            data.repeat = this.$repeat.value || undefined;
            data.repeatDuration = this.$repeatDuration.value || undefined;
            data.repeatFrequency = this.$repeatFrequency.value || undefined;
            data.startDate = this.$startDate.value || undefined;
        }

        if (!this.#data.id) {
            RewardsData.add(data);
            this.raiseEvent('RewardCreated', data);
        } else {
            RewardsData.update(data);
            this.raiseEvent('RewardEdited', data);
        }

        return true;
    }

    #validate() {
        return ![
            this.$name.validate(),
            this.$points.validate(),
            this.$repeatDuration?.validate(),
            this.$redeemed?.validate(),
        ].includes(false);
    }
}

customElements.define('reward-editor-component', RewardEditor);
