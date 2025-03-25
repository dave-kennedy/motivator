import CheckButton from './CheckButton.js';
import CustomElement from './CustomElement.js';
import GoalEditor from './GoalEditor.js';
import GoalsData from './data/GoalsData.js';
import Menu from './Menu.js';
import Modal from './Modal.js';

import {repeat} from './repeat.js';

const stylesheet = new CSSStyleSheet();

stylesheet.replace(`goal-component {
    display: block;
    padding-bottom: 1em;
    padding-left: 1.25em;
}

goal-component .content {
    background-color: #eee;
    border-radius: 1em;
    box-shadow: 0 3px 3px rgba(0, 0, 0, 0.25);
    box-sizing: border-box;
    padding: 1em 1em 1em 2em;
    position: relative;

    display: flex;
    flex-direction: column;
    gap: 0.5em;
}

goal-component .name {
    font-weight: bold;
}

goal-component .points::before,
goal-component .repeat::before,
goal-component .start-date::before,
goal-component .completed::before {
    display: inline-block;
    margin-right: 0.25em;
    vertical-align: middle;
}

goal-component .points::before {
    content: url('img/star.svg');
}

goal-component .repeat::before {
    content: url('img/repeat.svg');
}

goal-component .start-date::before,
goal-component .completed::before {
    content: url('img/calendar.svg');
}

goal-component check-button-component {
    height: 6.25em;
    width: 6.25em;

    position: absolute;
    left: -3em;
    top: -1em;
}

goal-component menu-component {
    position: absolute;
    right: 0.25em;
    top: 0.25em;
}`);

export default class Goal extends CustomElement {
    #data;

    constructor(data = {}) {
        super();

        this.#data = data;
    }

    connectedCallback() {
        this.#render();
    }

    #render() {
        this.applyStylesheet(stylesheet);

        this.id = this.#data.id;

        const $content = document.createElement('div');
        $content.className = 'content';
        this.appendChild($content);

        const $name = document.createElement('div');
        $name.className = 'name';
        $name.textContent = this.#data.name;
        $content.appendChild($name);

        if (this.#data.description) {
            const $description = document.createElement('div');
            $description.textContent = this.#data.description;
            $content.appendChild($description);
        }

        const $points = document.createElement('div');
        $points.className = 'points';
        $points.textContent = `${this.#data.points} points`;
        $content.appendChild($points);

        if (this.#data.repeat) {
            const $repeat = document.createElement('div');
            $repeat.className = 'repeat';

            const textParts = ['Repeats'];

            if (this.#data.repeatFrequency) {
                textParts.push(this.#data.repeatFrequency);
            }

            if (this.#data.repeatDuration) {
                textParts.push(`x ${this.#data.repeatDuration}`);
            }

            $repeat.textContent = textParts.join(' ');
            $content.appendChild($repeat);
        }

        if (this.#data.startDate > Date.now()) {
            const $startDate = document.createElement('div');
            $startDate.className = 'start-date';
            $startDate.textContent = `Starts ${new Date(this.#data.startDate).toLocaleDateString()}`;
            $content.appendChild($startDate);
        }

        if (this.#data.completed) {
            const $completed = document.createElement('div');
            $completed.className = 'completed';
            $completed.textContent = `Completed ${new Date(this.#data.completed).toLocaleDateString()}`;
            $content.appendChild($completed);
        }

        const $checkButton = new CheckButton({
            checked: this.#data.completed,
            onClick: _ => this.#data.completed ? this.#uncomplete() : this.#complete(),
            upcoming: this.#data.startDate > Date.now(),
        });

        $content.appendChild($checkButton);

        const $menu = new Menu({
            handle: {
                icon: {alt: 'Menu', src: 'img/more.svg'},
                title: 'Menu',
            },
            items: [{
                icon: {alt: 'Edit', src: 'img/edit.svg'},
                label: 'Edit',
                onClick: _ => GoalEditor.render(this.#data),
            }, {
                icon: {alt: 'Delete', src: 'img/delete.svg'},
                label: 'Delete',
                onClick: _ => this.#confirmDelete(),
            }],
        });

        $content.appendChild($menu);
    }

    #complete() {
        this.#data.completed = Date.now();
        GoalsData.update(this.#data);

        if (!this.#data.repeat) {
            this.raiseEvent('GoalCompleted', this.#data);
            return;
        }

        const newData = repeat(this.#data);
        GoalsData.add(newData);
        this.raiseEvent('GoalRepeated', {completed: this.#data, repeated: newData});
    }

    #uncomplete() {
        this.#data.completed = undefined;
        GoalsData.update(this.#data);
        this.raiseEvent('GoalUncompleted', this.#data);
    }

    #confirmDelete() {
        Modal.render({
            content: 'Are you sure you want to delete this goal?',
            buttons: [
                {label: 'No'},
                {focus: true, label: 'Yes', onClick: _ => this.#delete()},
            ],
        });
    }

    #delete() {
        GoalsData.delete(this.#data);
        this.raiseEvent('GoalDeleted', this.#data);
    }
}

customElements.define('goal-component', Goal);
