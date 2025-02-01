import Button from './Button.js';
import CheckButton from './CheckButton.js';
import CustomElement from './CustomElement.js';
import GoalEditor from './GoalEditor.js';
import GoalsData from './data/GoalsData.js';
import Modal from './Modal.js';
import repeat from './repeat.js';

const stylesheet = new CSSStyleSheet();

stylesheet.replace(`goal-component {
    background-color: #eee;
    border-radius: 1em;
    box-sizing: border-box;
    margin-left: 1.25em;
    padding: 1em 1em 1em 2em;
    position: relative;

    display: flex;
    flex-direction: column;
    gap: 0.5em;
}

@media (min-width: 400px) {
    goal-component {
        align-self: center;
        width: 80%;
    }
}

@media (min-width: 800px) {
    goal-component {
        align-self: center;
        width: 60%;
    }
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

goal-component .menu {
    position: absolute;
    bottom: 1em;
    right: 1em;
}

goal-component .menu button-component {
    position: absolute;
    bottom: 0;
    right: 0;
}

goal-component .menu .edit-button,
goal-component .menu .delete-button {
    visibility: hidden;
    transition: right 250ms, visibility 250ms;
}

goal-component .menu.open .edit-button,
goal-component .menu.open .delete-button {
    visibility: visible;
    transition: right 250ms, visibility 0ms;
}

goal-component .menu.open .edit-button {
    right: 7em;
}

goal-component .menu.open .delete-button {
    right: 3.5em;
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

        const $name = document.createElement('div');
        $name.className = 'name';
        $name.textContent = this.#data.name;
        this.appendChild($name);

        if (this.#data.description) {
            const $description = document.createElement('div');
            $description.textContent = this.#data.description;
            this.appendChild($description);
        }

        const $points = document.createElement('div');
        $points.className = 'points';
        $points.textContent = `${this.#data.points} points`;
        this.appendChild($points);

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
            this.appendChild($repeat);
        }

        if (this.#data.startDate > Date.now()) {
            const $startDate = document.createElement('div');
            $startDate.className = 'start-date';
            $startDate.textContent = `Starts ${new Date(this.#data.startDate).toLocaleDateString()}`;
            this.appendChild($startDate);
        }

        if (this.#data.completed) {
            const $completed = document.createElement('div');
            $completed.className = 'completed';
            $completed.textContent = `Completed ${new Date(this.#data.completed).toLocaleDateString()}`;
            this.appendChild($completed);
        }

        const $checkButton = new CheckButton({
            checked: this.#data.completed,
            onClick: _ => this.#data.completed ? this.#uncomplete() : this.#complete(),
            upcoming: this.#data.startDate > Date.now(),
        });

        this.appendChild($checkButton);

        const $menu = document.createElement('div');
        $menu.className = 'menu';
        this.appendChild($menu);

        const $editButton = new Button({
            className: 'edit-button round',
            icon: {alt: 'Edit', src: 'img/edit.svg'},
            onClick: _ => this.#edit(),
            title: 'Edit',
        });

        const $deleteButton = new Button({
            className: 'delete-button round',
            icon: {alt: 'Delete', src: 'img/delete.svg'},
            onClick: _ => this.#confirmDelete(),
            title: 'Delete',
        });

        const $menuButton = new Button({
            className: 'menu-button round',
            icon: {alt: 'Menu', src: 'img/menu.svg'},
            onClick: _ => $menu.classList.toggle('open'),
            title: 'Menu',
        });

        $menu.append($editButton, $deleteButton, $menuButton);
    }

    async #complete() {
        this.#data.completed = Date.now();

        GoalsData.update(this.#data);
        this.raiseEvent('GoalCompleted', this.#data);

        await this.animate({
            translate: [0, '100vw 0'],
        }, {
            delay: 750,
            duration: 500,
            easing: 'cubic-bezier(0.5, 0, 0.5, -0.5)',
            fill: 'forwards',
        }).finished;

        this.#animateRemove();

        if (!this.#data.repeat) {
            return;
        }

        const newData = repeat({
            name: this.#data.name,
            description: this.#data.description,
            points: this.#data.points,
            repeatDuration: this.#data.repeatDuration,
            repeatFrequency: this.#data.repeatFrequency,
        });

        GoalsData.add(newData);
        this.raiseEvent('GoalCreated', newData);
    }

    async #uncomplete() {
        this.#data.completed = undefined;

        GoalsData.update(this.#data);
        this.raiseEvent('GoalUncompleted', this.#data);

        await this.animate({
            translate: [0, '-100vw 0'],
        }, {
            delay: 750,
            duration: 500,
            easing: 'cubic-bezier(0.5, 0, 0.5, -0.5)',
            fill: 'forwards',
        }).finished;

        this.#animateRemove();
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

        await this.animate({
            opacity: [1, 0],
        }, {
            duration: 250,
            easing: 'ease',
            fill: 'forwards',
        }).finished;

        this.#animateRemove();
    }

    async #animateRemove() {
        const {height} = this.getBoundingClientRect();

        await this.animate({
            marginBottom: [0, `calc(${height}px * -1 - 1em)`],
        }, {
            duration: 250,
            easing: 'ease',
            fill: 'forwards',
        }).finished;

        this.remove();
    }
}

customElements.define('goal-component', Goal);
