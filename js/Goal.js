import Button from './Button.js';
import CustomElement from './CustomElement.js';
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

goal-component .complete-button {
    position: absolute;
    left: -1.25em;
    top: 1em;
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

        const $completeButton = new Button({
            className: 'complete-button round',
            icon: {
                alt: this.#completed ? 'Uncomplete' : 'Complete',
                src: this.#completed ? 'img/uncheck.svg' : 'img/check.svg',
            },
            onClick: _ => this.#completed ? this.#uncomplete() : this.#complete(),
            title: this.#completed ? 'Uncomplete' : 'Complete',
        });

        this.appendChild($completeButton);
    }

    async #complete() {
        this.#completed = new Date().getTime();

        GoalsData.update({
            id: this.#id,
            completed: this.#completed,
        });

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

        await this.animate({opacity: [1, 0]}, 300).finished;
        this.remove();
    }

    async #uncomplete() {
        this.#completed = undefined;

        GoalsData.update({
            id: this.#id,
            completed: undefined,
        });

        await this.animate({opacity: [1, 0]}, 300).finished;
        this.remove();
    }
}

customElements.define('goal-component', Goal);
