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
    #id;
    #created;
    #name;
    #description;
    #points;
    #repeat;
    #redeemed;

    $name;
    $description;
    $points;
    $repeat;
    $redeemed;

    constructor({id, created, name, description, points, repeat, redeemed}) {
        super();

        this.#id = id;
        this.#created = created;
        this.#name = name;
        this.#description = description;
        this.#points = points;
        this.#repeat = repeat;
        this.#redeemed = redeemed;
    }

    connectedCallback() {
        this.#render();
    }

    #render() {
        this.applyStylesheet(stylesheet);

        this.$name = new Input({
            disabled: this.#redeemed,
            id: 'name-input',
            label: 'Name',
            required: true,
            type: 'text',
            value: this.#name,
        });

        this.appendChild(this.$name);
        this.$name.focus();

        this.$description = new Input({
            disabled: this.#redeemed,
            id: 'description-input',
            label: 'Description',
            type: 'text',
            value: this.#description,
        });

        this.appendChild(this.$description);

        this.$points = new Input({
            disabled: this.#redeemed,
            id: 'points-input',
            label: 'Points',
            min: 0,
            required: true,
            type: 'number',
            value: this.#points,
        });

        this.appendChild(this.$points);

        this.$repeat = new Input({
            disabled: this.#redeemed,
            id: 'repeat-input',
            label: 'Repeat this reward when redeemed',
            type: 'checkbox',
            value: this.#repeat,
        });

        this.appendChild(this.$repeat);

        if (this.#redeemed) {
            this.$redeemed = new Input({
                id: 'redeemed-input',
                label: 'Redeemed',
                type: 'datetime-local',
                value: this.#redeemed,
            });

            this.appendChild(this.$redeemed);
        }
    }

    save() {
        if (!this.#validate()) {
            return;
        }

        const reward = {
            id: this.#id || crypto.randomUUID(),
            created: this.#created || new Date().getTime(),
            name: this.$name.value,
            description: this.$description.value,
            points: this.$points.value,
            repeat: this.$repeat.value,
            redeemed: this.$redeemed?.value,
        };

        if (!this.#id) {
            RewardsData.add(reward);
            document.dispatchEvent(new Event('RewardCreated'));
        } else {
            RewardsData.update(reward);
            document.dispatchEvent(new Event('RewardUpdated'));
        }

        return true;
    }

    #validate() {
        return this.$name.validate() && this.$points.validate();
    }
}

customElements.define('reward-editor-component', RewardEditor);
