import Button from './Button.js';
import CustomElement from './CustomElement.js';
import Input from './Input.js';
import Modal from './Modal.js';
import Reward from './Reward.js';
import RewardsData from './data/RewardsData.js';

const stylesheet = new CSSStyleSheet();

stylesheet.replace(`reward-editor-component {
    background-color: #eee;
    border-radius: 1em;
    box-sizing: border-box;
    padding: 1em;

    display: flex;
    flex-direction: column;
    gap: 1em;
}

@media (min-width: 400px) {
    reward-editor-component {
        align-self: center;
        width: 80%;
    }
}

@media (min-width: 800px) {
    reward-editor-component {
        align-self: center;
        width: 60%;
    }
}

reward-editor-component .buttons {
    display: flex;
    gap: 1em;
    justify-content: end;
}

reward-editor-component .delete-button {
    flex: 1;
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

        const $buttons = document.createElement('div');
        $buttons.className = 'buttons';
        this.appendChild($buttons);

        if (this.#id) {
            const $deleteButton = new Button({
                className: 'delete-button red',
                label: 'Delete',
                onClick: _ => this.#confirmDelete(),
            });

            $buttons.appendChild($deleteButton);
        }

        const $cancelButton = new Button({
            label: 'Cancel',
            onClick: _ => this.#cancel(),
        });

        $buttons.appendChild($cancelButton);

        const $saveButton = new Button({
            label: 'Save',
            onClick: _ => this.#save(),
        });

        $buttons.appendChild($saveButton);
    }

    #confirmDelete() {
        const $modal = new Modal({
            message: 'Are you sure you want to delete this reward?',
            onConfirm: _ => this.#delete(),
        });

        this.appendChild($modal);
    }

    #delete() {
        RewardsData.remove({id: this.#id});
        this.remove();
    }

    #cancel() {
        if (!this.#id) {
            this.remove();
            return;
        }

        const $reward = new Reward({
            id: this.#id,
            created: this.#created,
            name: this.#name,
            description: this.#description,
            points: this.#points,
            repeat: this.#repeat,
            redeemed: this.#redeemed,
        });

        this.replaceWith($reward);
    }

    #save() {
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
        } else {
            RewardsData.update(reward);
        }

        const $reward = new Reward(reward);
        this.replaceWith($reward);
    }

    #validate() {
        return this.$name.validate() && this.$points.validate();
    }
}

customElements.define('reward-editor-component', RewardEditor);
