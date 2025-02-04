import CheckButton from './CheckButton.js';
import CustomElement from './CustomElement.js';
import GoalEditor from './GoalEditor.js';
import GoalsData from './data/GoalsData.js';
import Menu from './Menu.js';
import Modal from './Modal.js';

import {fade, peelOut, shrink} from './animation.js';
import {getNextRepeatStreak, repeat} from './repeat.js';

const stylesheet = new CSSStyleSheet();

stylesheet.replace(`@media (min-width: 544px) {
    goal-component {
        align-self: center;
        width: 32em;
    }
}

goal-component .content {
    background-color: #eee;
    border-radius: 1em;
    box-sizing: border-box;
    margin-bottom: 1em;
    margin-left: 1.25em;
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
goal-component .repeat-streak::before,
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

goal-component .repeat-streak::before {
    content: url('img/trend.svg');
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

        if (this.#data.repeatStreak > 1) {
            if (this.#data.completed || getNextRepeatStreak(this.#data) > this.#data.repeatStreak) {
                const $repeatStreak = document.createElement('div');
                $repeatStreak.className = 'repeat-streak';

                if (!this.#data.repeatFrequency) {
                    $repeatStreak.textContent = `Completed ${this.#data.repeatStreak} times in a day`;
                } else if (this.#data.repeatFrequency === 'daily') {
                    $repeatStreak.textContent = `Completed ${this.#data.repeatStreak} days in a row`;
                } else if (this.#data.repeatFrequency === 'weekly') {
                    $repeatStreak.textContent = `Completed ${this.#data.repeatStreak} weeks in a row`;
                } else if (this.#data.repeatFrequency === 'monthly') {
                    $repeatStreak.textContent = `Completed ${this.#data.repeatStreak} months in a row`;
                } else if (this.#data.repeatFrequency === 'yearly') {
                    $repeatStreak.textContent = `Completed ${this.#data.repeatStreak} years in a row`;
                }

                $content.appendChild($repeatStreak);
            }
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
                onClick: _ => this.#edit(),
            }, {
                icon: {alt: 'Delete', src: 'img/delete.svg'},
                label: 'Delete',
                onClick: _ => this.#confirmDelete(),
            }],
        });

        $content.appendChild($menu);
    }

    async #complete() {
        this.#data.completed = Date.now();
        GoalsData.update(this.#data);
        this.raiseEvent('GoalCompleted', this.#data);

        await peelOut({element: this, direction: 'right', delay: 750, duration: 500});
        await shrink({element: this, dimension: 'height', duration: 250});
        this.remove();

        if (!this.#data.repeat) {
            return;
        }

        const newData = repeat(this.#data);
        newData.repeatStreak = getNextRepeatStreak(this.#data);
        GoalsData.add(newData);
        this.raiseEvent('GoalCreated', newData);
    }

    async #uncomplete() {
        this.#data.completed = undefined;
        GoalsData.update(this.#data);
        this.raiseEvent('GoalUncompleted', this.#data);

        await peelOut({element: this, direction: 'left', delay: 750, duration: 500});
        await shrink({element: this, dimension: 'height', duration: 250});
        this.remove();
    }

    #edit() {
        const $editor = new GoalEditor(this.#data);

        Modal.render({
            content: $editor,
            buttons: [
                {label: 'Cancel'},
                {label: 'Save', onClick: _ => $editor.save()},
            ],
        });
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

    async #delete() {
        GoalsData.remove(this.#data);
        this.raiseEvent('GoalDeleted', this.#data);

        await fade({element: this, direction: 'out', duration: 250});
        await shrink({element: this, dimension: 'height', duration: 250});
        this.remove();
    }
}

customElements.define('goal-component', Goal);
