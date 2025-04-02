import CheckButton from './CheckButton.js';
import CustomElement from './CustomElement.js';
import Icon from './Icon.js';
import Menu from './Menu.js';
import Modal from './Modal.js';
import RewardEditor from './RewardEditor.js';
import RewardsData from './data/RewardsData.js';

import {repeat} from './repeat.js';

const stylesheet = new CSSStyleSheet();

stylesheet.replace(`reward-component {
    display: block;
    padding-bottom: 1em;
    padding-left: 1.25em;
}

reward-component .content {
    background-color: var(--item-bg-color);
    border-radius: 1em;
    box-shadow: 0 3px 3px rgba(0, 0, 0, 0.25);
    box-sizing: border-box;
    padding: 1em 1em 1em 2em;
    position: relative;

    display: flex;
    flex-direction: column;
    gap: 0.5em;
}

reward-component .name {
    font-weight: bold;
}

reward-component .points,
reward-component .repeat,
reward-component .start-date,
reward-component .redeemed {
    display: flex;
    align-items: center;
    gap: 0.5em;
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
    right: 0.25em;
    top: 0.25em;
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
        $points.append(new Icon('star'), `${this.#data.points} points`);
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

            $repeat.append(new Icon('repeat'), textParts.join(' '));
            $content.appendChild($repeat);
        }

        if (this.#data.startDate > Date.now()) {
            const $startDate = document.createElement('div');
            $startDate.className = 'start-date';

            const date = new Date(this.#data.startDate).toLocaleDateString();
            $startDate.append(new Icon('calendar'), `Starts ${date}`);
            $content.appendChild($startDate);
        }

        if (this.#data.redeemed) {
            const $redeemed = document.createElement('div');
            $redeemed.className = 'redeemed';

            const date = new Date(this.#data.redeemed).toLocaleDateString();
            $redeemed.append(new Icon('calendar'), `Redeemed ${date}`);
            $content.appendChild($redeemed);
        }

        const $checkButton = new CheckButton({
            checked: this.#data.redeemed,
            onClick: _ => this.#data.redeemed ? this.#unredeem() : this.#redeem(),
            upcoming: this.#data.startDate > Date.now(),
        });

        $content.appendChild($checkButton);

        const $menu = new Menu({
            handle: {
                icon: 'more',
                title: 'Menu',
            },
            items: [{
                icon: 'edit',
                label: 'Edit',
                onClick: _ => RewardEditor.render(this.#data),
            }, {
                icon: 'delete',
                label: 'Delete',
                onClick: _ => this.#confirmDelete(),
            }],
        });

        $content.appendChild($menu);
    }

    #redeem() {
        this.#data.redeemed = Date.now();
        RewardsData.update(this.#data);

        if (!this.#data.repeat) {
            this.raiseEvent('RewardRedeemed', this.#data);
            return;
        }

        const newData = repeat(this.#data);
        RewardsData.add(newData);
        this.raiseEvent('RewardRepeated', {redeemed: this.#data, repeated: newData});
    }

    #unredeem() {
        this.#data.redeemed = undefined;
        RewardsData.update(this.#data);
        this.raiseEvent('RewardUnredeemed', this.#data);
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

    #delete() {
        RewardsData.delete(this.#data);
        this.raiseEvent('RewardDeleted', this.#data);
    }
}

customElements.define('reward-component', Reward);
