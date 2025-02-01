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
            id: 'repeat-input',
            label: 'Repeat this reward when redeemed',
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

        if (this.#data.redeemed) {
            data.repeat = this.#data.repeat;
            data.redeemed = this.$redeemed.value;
        } else {
            data.repeat = this.$repeat.value || undefined;
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
            this.$redeemed?.validate(),
        ].includes(false);
    }
}

customElements.define('reward-editor-component', RewardEditor);
