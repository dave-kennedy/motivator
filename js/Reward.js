import CheckButton from './CheckButton.js';
import CustomElement from './CustomElement.js';
import Menu from './Menu.js';
import Modal from './Modal.js';
import RewardEditor from './RewardEditor.js';
import RewardsData from './data/RewardsData.js';
import repeat from './repeat.js';

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

reward-component .points::before,
reward-component .repeat::before,
reward-component .start-date::before,
reward-component .redeemed::before {
    display: inline-block;
    margin-right: 0.25em;
    vertical-align: middle;
}

reward-component .points::before {
    content: url('img/star.svg');
}

reward-component .repeat::before {
    content: url('img/repeat.svg');
}

reward-component .start-date::before,
reward-component .redeemed::before {
    content: url('img/calendar.svg');
}

reward-component check-button-component {
    height: 6.25em;
    width: 6.25em;

    position: absolute;
    left: -3em;
    top: -1em;
}

reward-component menu-component {
    position: absolute;
    bottom: 1em;
    right: 1em;
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

        if (this.#data.redeemed) {
            const $redeemed = document.createElement('div');
            $redeemed.className = 'redeemed';
            $redeemed.textContent = `Redeemed ${new Date(this.#data.redeemed).toLocaleDateString()}`;
            this.appendChild($redeemed);
        }

        const $checkButton = new CheckButton({
            checked: this.#data.redeemed,
            onClick: _ => this.#data.redeemed ? this.#unredeem() : this.#redeem(),
            upcoming: this.#data.startDate > Date.now(),
        });

        this.appendChild($checkButton);

        const $menu = new Menu({
            handle: {
                className: 'round',
                icon: {alt: 'Menu', src: 'img/menu.svg'},
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

        this.appendChild($menu);
    }

    async #redeem() {
        this.#data.redeemed = Date.now();

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

        const newData = repeat({
            name: this.#data.name,
            description: this.#data.description,
            points: this.#data.points,
            repeatDuration: this.#data.repeatDuration,
            repeatFrequency: this.#data.repeatFrequency,
        });

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
