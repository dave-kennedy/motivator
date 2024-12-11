import Button from './Button.js';
import CustomElement from './CustomElement.js';
import Goal from './Goal.js';
import GoalsData from './data/GoalsData.js';
import Input from './Input.js';

const stylesheet = new CSSStyleSheet();

stylesheet.replace(`goal-editor-component {
    background-color: #eee;
    border-radius: 1em;
    box-sizing: border-box;
    padding: 1em;

    display: flex;
    flex-direction: column;
    gap: 1em;
}

@media (min-width: 400px) {
    goal-editor-component {
        align-self: center;
        width: 80%;
    }
}

@media (min-width: 800px) {
    goal-editor-component {
        align-self: center;
        width: 60%;
    }
}

goal-editor-component .buttons {
    display: flex;
    gap: 1em;
    justify-content: end;
}`);

export default class GoalEditor extends CustomElement {
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
            required: true,
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
            min: 0,
            required: true,
            type: 'number',
        });

        this.appendChild(this.$points);

        this.$repeat = new Input({
            id: 'repeat-input',
            label: 'Repeat this goal when completed',
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
        if (!this.#validate()) {
            return;
        }

        const goal = {
            id: crypto.randomUUID(),
            created: new Date().getTime(),
            name: this.$name.value,
            description: this.$description.value,
            points: this.$points.value,
            repeat: this.$repeat.value,
        };

        GoalsData.add(goal);

        const $goal = new Goal(goal);
        this.replaceWith($goal);
    }

    #validate() {
        return this.$name.validate() && this.$points.validate();
    }
}

customElements.define('goal-editor-component', GoalEditor);
