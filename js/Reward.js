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
    #id;
    #created;
    #name;
    #description;
    #points;
    #repeat;
    #redeemed;

    constructor({id, created, name, description, points, repeat, redeemed}) {
        super();

        this.#id = id;
        this.#created = created;
        this.#name = name;
        this.#description = description;
        this.#points = points;
        this.#repeat = repeat;
        this.#redeemed = redeemed;
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
            checked: this.#redeemed,
            onClick: _ => this.#redeemed ? this.#unredeem() : this.#redeem(),
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
        this.#redeemed = new Date().getTime();

        RewardsData.update({
            id: this.#id,
            redeemed: this.#redeemed,
        });

        document.dispatchEvent(new Event('RewardRedeemed'));

        if (this.#repeat) {
            const newReward = {
                id: crypto.randomUUID(),
                created: new Date().getTime(),
                name: this.#name,
                description: this.#description,
                points: this.#points,
                repeat: this.#repeat,
            };

            RewardsData.add(newReward);
            const $newReward = new Reward(newReward);
            this.after($newReward);
        }

        await this.animate({
            translate: [0, '100vw 0'],
        }, {
            delay: 750,
            duration: 500,
            easing: 'cubic-bezier(0.5, 0, 0.5, -0.5)',
            fill: 'forwards',
        }).finished;

        this.#animateRemove();
    }

    async #unredeem() {
        this.#redeemed = undefined;

        RewardsData.update({
            id: this.#id,
            redeemed: undefined,
        });

        document.dispatchEvent(new Event('RewardUnredeemed'));

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
        const $editor = new RewardEditor({
            id: this.#id,
            created: this.#created,
            name: this.#name,
            description: this.#description,
            points: this.#points,
            repeat: this.#repeat,
            redeemed: this.#redeemed,
        });

        this.replaceWith($editor);
    }

    #confirmDelete() {
        const $modal = new Modal({
            message: 'Are you sure you want to delete this reward?',
            onConfirm: _ => this.#delete(),
        });

        this.appendChild($modal);
    }

    async #delete() {
        RewardsData.remove({id: this.#id});
        document.dispatchEvent(new Event('RewardDeleted'));

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
