import About from './About.js';
import CustomElement from './CustomElement.js';
import GoalsData from './data/GoalsData.js';
import Menu from './Menu.js';
import Modal from './Modal.js';
import RewardsData from './data/RewardsData.js';
import SettingsEditor from './SettingsEditor.js';
import Tutorial from './Tutorial.js';

const stylesheet = new CSSStyleSheet();

stylesheet.replace(`header-component {
    background-color: #666;
    box-sizing: border-box;
    color: #fff;
    padding: 1em;

    display: flex;
    align-items: center;
    justify-content: space-between;
}

header-component .points {
    font-size: 2em;
    font-weight: bold;
}

header-component .points::after {
    content: ' points';
    font-size: 1rem;
}

@media (min-height: 800px) {
    header-component .points {
        font-size: 4em;
    }
}`);

export default class Header extends CustomElement {
    $points;

    connectedCallback() {
        this.#render();

        document.addEventListener('GoalCompleted', this.#onDataChange);
        document.addEventListener('GoalUncompleted', this.#onDataChange);
        document.addEventListener('GoalDeleted', this.#onDataChange);
        document.addEventListener('GoalEdited', this.#onDataChange);
        document.addEventListener('RewardRedeemed', this.#onDataChange);
        document.addEventListener('RewardUnredeemed', this.#onDataChange);
        document.addEventListener('RewardDeleted', this.#onDataChange);
        document.addEventListener('RewardEdited', this.#onDataChange);
    }

    disconnectedCallback() {
        document.removeEventListener('GoalCompleted', this.#onDataChange);
        document.removeEventListener('GoalUncompleted', this.#onDataChange);
        document.removeEventListener('GoalDeleted', this.#onDataChange);
        document.removeEventListener('GoalEdited', this.#onDataChange);
        document.removeEventListener('RewardRedeemed', this.#onDataChange);
        document.removeEventListener('RewardUnredeemed', this.#onDataChange);
        document.removeEventListener('RewardDeleted', this.#onDataChange);
        document.removeEventListener('RewardEdited', this.#onDataChange);
    }

    #render() {
        this.applyStylesheet(stylesheet);

        const points = GoalsData.completedPoints - RewardsData.redeemedPoints;
        this.$points = document.createElement('div');
        this.$points.className = 'points';
        this.$points.textContent = points;
        this.appendChild(this.$points);

        const $menu = new Menu({
            handle: {
                icon: {alt: 'Menu', src: 'img/menu.svg'},
                title: 'Menu',
            },
            items: [{
                icon: {src: 'img/info.svg'},
                label: 'About',
                onClick: _ => this.#showAbout(),
            }, {
                icon: {src: 'img/settings.svg'},
                label: 'Settings',
                onClick: _ => this.#showSettings(),
            }, {
                icon: {src: 'img/lightbulb.svg'},
                label: 'Tutorial',
                onClick: _ => Tutorial.restart(),
            }],
        });

        this.appendChild($menu);
    }

    #onDataChange = _ => {
        const points = GoalsData.completedPoints - RewardsData.redeemedPoints;
        this.$points.textContent = points;
    };

    #showAbout() {
        Modal.render({
            content: new About(),
            buttons: [{focus: true, label: 'OK'}],
        });
    }

    #showSettings() {
        const $editor = new SettingsEditor();

        Modal.render({
            content: $editor,
            buttons: [
                {label: 'Cancel'},
                {label: 'Save', onClick: _ => $editor.save()},
            ],
        });
    }
}

customElements.define('header-component', Header);
