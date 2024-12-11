import Button from './Button.js';
import CustomElement from './CustomElement.js';
import Input from './Input.js';
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
}`);

export default class RewardEditor extends CustomElement {
    $name;
    $description;
    $points;
    $repeat;

    constructor() {
        super();
    }

    connectedCallback() {
        this.#render();
    }

    #render() {
        this.applyStylesheet(stylesheet);

        this.$name = new Input({
            id: 'name-input',
            label: 'Name',
            type: 'text',
        });

        this.appendChild(this.$name);
        this.$name.focus();

        this.$description = new Input({
            id: 'description-input',
            label: 'Description',
            type: 'text',
        });

        this.appendChild(this.$description);

        this.$points = new Input({
            id: 'points-input',
            label: 'Points',
            type: 'number',
        });

        this.appendChild(this.$points);

        this.$repeat = new Input({
            id: 'repeat-input',
            label: 'Repeat this reward when redeemed',
            type: 'checkbox',
        });

        this.appendChild(this.$repeat);

        const $buttons = document.createElement('div');
        $buttons.className = 'buttons';
        this.appendChild($buttons);

        const $cancelButton = new Button({
            label: 'Cancel',
            onClick: _ => this.remove(),
        });

        $buttons.appendChild($cancelButton);

        const $saveButton = new Button({
            label: 'Save',
            onClick: _ => this.#save(),
        });

        $buttons.appendChild($saveButton);
    }

    #save() {
        const reward = {
            id: crypto.randomUUID(),
            created: new Date().getTime(),
            name: this.$name.value,
            description: this.$description.value,
            points: this.$points.value,
            repeat: this.$repeat.value,
        };

        RewardsData.add(reward);

        const $reward = new Reward(reward);
        this.replaceWith($reward);
    }
}

customElements.define('reward-editor-component', RewardEditor);
