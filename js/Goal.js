import CheckButton from './CheckButton.js';
import CustomElement from './CustomElement.js';
import GoalEditor from './GoalEditor.js';
import GoalsData from './data/GoalsData.js';

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
}

customElements.define('goal-component', Goal);
