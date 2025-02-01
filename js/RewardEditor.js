import CustomElement from './CustomElement.js';
import Input from './Input.js';
import RewardsData from './data/RewardsData.js';

const stylesheet = new CSSStyleSheet();

stylesheet.replace(`reward-editor-component {
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
            disabled: this.#data.redeemed,
            id: 'name-input',
            label: 'Name',
            required: true,
            type: 'text',
            value: this.#data.name,
        });

        this.appendChild(this.$name);
        this.$name.focus();

        this.$description = new Input({
            disabled: this.#data.redeemed,
            id: 'description-input',
            label: 'Description',
            type: 'text',
            value: this.#data.description,
        });

        this.appendChild(this.$description);

        this.$points = new Input({
            disabled: this.#data.redeemed,
            id: 'points-input',
            label: 'Points',
            min: 0,
            required: true,
            type: 'number',
            value: this.#data.points,
        });

        this.appendChild(this.$points);

        this.$repeat = new Input({
            disabled: this.#data.redeemed,
            id: 'repeat-input',
            label: 'Repeat this reward when redeemed',
            type: 'checkbox',
            value: this.#data.repeat,
        });

        this.appendChild(this.$repeat);

        if (this.#data.redeemed) {
            this.$redeemed = new Input({
                id: 'redeemed-input',
                label: 'Redeemed',
                type: 'datetime-local',
                value: this.#data.redeemed,
            });

            this.appendChild(this.$redeemed);
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
            redeemed: this.$redeemed?.value,
        };

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
        return this.$name.validate() && this.$points.validate();
    }
}

customElements.define('reward-editor-component', RewardEditor);
