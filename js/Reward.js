import Button from './Button.js';
import CheckButton from './CheckButton.js';
import CustomElement from './CustomElement.js';
import RewardEditor from './RewardEditor.js';
import RewardsData from './data/RewardsData.js';
import Modal from './Modal.js';

const stylesheet = new CSSStyleSheet();

stylesheet.replace(`reward-component {
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
    reward-component {
        align-self: center;
        width: 80%;
    }
}

@media (min-width: 800px) {
    reward-component {
        align-self: center;
        width: 60%;
    }
}

reward-component .name {
    font-weight: bold;
}

reward-component check-button-component {
    height: 6.25em;
    width: 6.25em;

    position: absolute;
    left: -3em;
    top: -1em;
}

reward-component .menu {
    position: absolute;
    bottom: 1em;
    right: 1em;
}

reward-component .menu button-component {
    position: absolute;
    bottom: 0;
    right: 0;
}

reward-component .menu .edit-button,
reward-component .menu .delete-button {
    visibility: hidden;
    transition: right 250ms, visibility 250ms;
}

reward-component .menu.open .edit-button,
reward-component .menu.open .delete-button {
    visibility: visible;
    transition: right 250ms, visibility 0ms;
}

reward-component .menu.open .edit-button {
    right: 7em;
}

reward-component .menu.open .delete-button {
    right: 3.5em;
}`);

export default class Reward extends CustomElement {
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
        $points.textContent = `Points: ${this.#data.points}`;
        this.appendChild($points);

        if (this.#data.repeat) {
            const $repeat = document.createElement('div');
            $repeat.textContent = `↻ Repeats`;
            this.appendChild($repeat);
        }

        const $checkButton = new CheckButton({
            checked: this.#data.redeemed,
            onClick: _ => this.#data.redeemed ? this.#unredeem() : this.#redeem(),
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

    async #redeem() {
        this.#data.redeemed = new Date().getTime();

        RewardsData.update(this.#data);
        this.raiseEvent('RewardRedeemed', this.#data);

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

        const newData = {
            id: crypto.randomUUID(),
            created: new Date().getTime(),
            name: this.#data.name,
            description: this.#data.description,
            points: this.#data.points,
            repeat: this.#data.repeat,
        };

        RewardsData.add(newData);
        this.raiseEvent('RewardCreated', newData);
    }

    async #unredeem() {
        this.#data.redeemed = undefined;

        RewardsData.update(this.#data);
        this.raiseEvent('RewardUnredeemed', this.#data);

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
        const $editor = new RewardEditor(this.#data);

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
            content: 'Are you sure you want to delete this reward?',
            buttons: [
                {label: 'No'},
                {focus: true, label: 'Yes', onClick: _ => this.#delete()},
            ],
        });
    }

    async #delete() {
        RewardsData.remove(this.#data);
        this.raiseEvent('RewardDeleted', this.#data);

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

customElements.define('reward-component', Reward);
