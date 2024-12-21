import Button from './Button.js';
import CheckButton from './CheckButton.js';
import CustomElement from './CustomElement.js';
import GoalEditor from './GoalEditor.js';
import GoalsData from './data/GoalsData.js';
import Modal from './Modal.js';

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

goal-component check-button-component {
    height: 6.25em;
    width: 6.25em;

    position: absolute;
    left: -3em;
    top: -1em;
}

goal-component.completed, goal-component.uncompleted {
    margin-bottom: calc(var(--height) * -1 - 1em);
    transition:
        translate 500ms cubic-bezier(0.5, 0, 0.5, -0.5) 750ms,
        margin-bottom 250ms 1250ms;
}

goal-component.completed {
    translate: 100vw 0;
}

goal-component.uncompleted {
    translate: -100vw 0;
}

goal-component.deleted {
    opacity: 0;
    margin-bottom: calc(var(--height) * -1 - 1em);
    transition:
        opacity 250ms,
        margin-bottom 250ms ease-in-out 250ms;
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
    #id;
    #created;
    #name;
    #description;
    #points;
    #repeat;
    #completed;

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

        const $name = document.createElement('div');
        $name.className = 'name';
        $name.textContent = this.#name;
        this.appendChild($name);

        if (this.#description) {
            const $description = document.createElement('div');
            $description.textContent = this.#description;
            this.appendChild($description);
        }

        const $points = document.createElement('div');
        $points.textContent = `Points: ${this.#points}`;
        this.appendChild($points);

        if (this.#repeat) {
            const $repeat = document.createElement('div');
            $repeat.textContent = `↻ Repeats`;
            this.appendChild($repeat);
        }

        const $checkButton = new CheckButton({
            checked: this.#completed,
            onClick: _ => this.#completed ? this.#uncomplete() : this.#complete(),
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
        this.#completed = new Date().getTime();

        GoalsData.update({
            id: this.#id,
            completed: this.#completed,
        });

        document.dispatchEvent(new Event('GoalCompleted'));

        if (this.#repeat) {
            const newGoal = {
                id: crypto.randomUUID(),
                created: new Date().getTime(),
                name: this.#name,
                description: this.#description,
                points: this.#points,
                repeat: this.#repeat,
            };

            GoalsData.add(newGoal);
            const $newGoal = new Goal(newGoal);
            this.after($newGoal);
        }

        this.classList.add('completed');

        const {height} = this.getBoundingClientRect();
        this.style.setProperty('--height', `${height}px`);

        await Promise.allSettled(this.getAnimations().map(a => a.finished));
        this.remove();
    }

    async #uncomplete() {
        this.#completed = undefined;

        GoalsData.update({
            id: this.#id,
            completed: undefined,
        });

        document.dispatchEvent(new Event('GoalUncompleted'));

        this.classList.add('uncompleted');

        const {height} = this.getBoundingClientRect();
        this.style.setProperty('--height', `${height}px`);

        await Promise.allSettled(this.getAnimations().map(a => a.finished));
        this.remove();
    }

    #edit() {
        const $editor = new GoalEditor({
            id: this.#id,
            created: this.#created,
            name: this.#name,
            description: this.#description,
            points: this.#points,
            repeat: this.#repeat,
            completed: this.#completed,
        });

        this.replaceWith($editor);
    }

    #confirmDelete() {
        const $modal = new Modal({
            message: 'Are you sure you want to delete this goal?',
            onConfirm: _ => this.#delete(),
        });

        this.appendChild($modal);
    }

    async #delete() {
        GoalsData.remove({id: this.#id});
        document.dispatchEvent(new Event('GoalDeleted'));

        this.classList.add('deleted');

        const {height} = this.getBoundingClientRect();
        this.style.setProperty('--height', `${height}px`);

        await Promise.allSettled(this.getAnimations().map(a => a.finished));
        this.remove();
    }
}

customElements.define('goal-component', Goal);
