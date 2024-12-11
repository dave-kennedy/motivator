import Button from './Button.js';
import CustomElement from './CustomElement.js';
import Goal from './Goal.js';
import GoalsData from './data/GoalsData.js';
import Input from './Input.js';
import Modal from './Modal.js';

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
}

goal-editor-component .delete-button {
    flex: 1;
}`);

export default class GoalEditor extends CustomElement {
    #id;
    #created;
    #name;
    #description;
    #points;
    #repeat;
    #completed;

    $name;
    $description;
    $points;
    $repeat;
    $completed;

    constructor({id, created, name, description, points, repeat, completed}) {
        super();

        this.#id = id;
        this.#created = created;
        this.#name = name;
        this.#description = description;
        this.#points = points;
        this.#repeat = repeat;
        this.#completed = completed;
    }

    connectedCallback() {
        this.#render();
    }

    #render() {
        this.applyStylesheet(stylesheet);

        this.$name = new Input({
            disabled: this.#completed,
            id: 'name-input',
            label: 'Name',
            required: true,
            type: 'text',
            value: this.#name,
        });

        this.appendChild(this.$name);
        this.$name.focus();

        this.$description = new Input({
            disabled: this.#completed,
            id: 'description-input',
            label: 'Description',
            type: 'text',
            value: this.#description,
        });

        this.appendChild(this.$description);

        this.$points = new Input({
            disabled: this.#completed,
            id: 'points-input',
            label: 'Points',
            min: 0,
            required: true,
            type: 'number',
            value: this.#points,
        });

        this.appendChild(this.$points);

        this.$repeat = new Input({
            disabled: this.#completed,
            id: 'repeat-input',
            label: 'Repeat this goal when completed',
            type: 'checkbox',
            value: this.#repeat,
        });

        this.appendChild(this.$repeat);

        if (this.#completed) {
            this.$completed = new Input({
                id: 'completed-input',
                label: 'Completed',
                type: 'datetime-local',
                value: this.#completed,
            });

            this.appendChild(this.$completed);
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
            message: 'Are you sure you want to delete this goal?',
            onConfirm: _ => this.#delete(),
        });

        this.appendChild($modal);
    }

    #delete() {
        GoalsData.remove({id: this.#id});
        this.remove();
    }

    #cancel() {
        if (!this.#id) {
            this.remove();
            return;
        }

        const $goal = new Goal({
            id: this.#id,
            created: this.#created,
            name: this.#name,
            description: this.#description,
            points: this.#points,
            repeat: this.#repeat,
            completed: this.#completed,
        });

        this.replaceWith($goal);
    }

    #save() {
        if (!this.#validate()) {
            return;
        }

        const goal = {
            id: this.#id || crypto.randomUUID(),
            created: this.#created || new Date().getTime(),
            name: this.$name.value,
            description: this.$description.value,
            points: this.$points.value,
            repeat: this.$repeat.value,
            completed: this.$completed?.value,
        };

        if (!this.#id) {
            GoalsData.add(goal);
        } else {
            GoalsData.update(goal);
        }

        const $goal = new Goal(goal);
        this.replaceWith($goal);
    }

    #validate() {
        return this.$name.validate() && this.$points.validate();
    }
}

customElements.define('goal-editor-component', GoalEditor);
