import About from './About.js';
import CustomElement from './CustomElement.js';
import HistoryData from './data/HistoryData.js';
import Menu from './Menu.js';
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
        document.addEventListener('GoalDeleted', this.#onDataChange);
        document.addEventListener('GoalEdited', this.#onDataChange);
        document.addEventListener('GoalRepeated', this.#onDataChange);
        document.addEventListener('GoalUncompleted', this.#onDataChange);
        document.addEventListener('RewardDeleted', this.#onDataChange);
        document.addEventListener('RewardEdited', this.#onDataChange);
        document.addEventListener('RewardRedeemed', this.#onDataChange);
        document.addEventListener('RewardRepeated', this.#onDataChange);
        document.addEventListener('RewardUnredeemed', this.#onDataChange);
    }

    disconnectedCallback() {
        document.removeEventListener('GoalCompleted', this.#onDataChange);
        document.removeEventListener('GoalDeleted', this.#onDataChange);
        document.removeEventListener('GoalEdited', this.#onDataChange);
        document.removeEventListener('GoalRepeated', this.#onDataChange);
        document.removeEventListener('GoalUncompleted', this.#onDataChange);
        document.removeEventListener('RewardDeleted', this.#onDataChange);
        document.removeEventListener('RewardEdited', this.#onDataChange);
        document.removeEventListener('RewardRedeemed', this.#onDataChange);
        document.removeEventListener('RewardRepeated', this.#onDataChange);
        document.removeEventListener('RewardUnredeemed', this.#onDataChange);
    }

    #render() {
        this.applyStylesheet(stylesheet);

        this.$points = document.createElement('div');
        this.$points.className = 'points';
        this.$points.textContent = HistoryData.points;
        this.appendChild(this.$points);

        const $menu = new Menu({
            handle: {
                icon: {alt: 'Menu', src: 'img/menu.svg'},
                title: 'Menu',
            },
            items: [{
                icon: {src: 'img/info.svg'},
                label: 'About',
                onClick: _ => About.render(),
            }, {
                icon: {src: 'img/settings.svg'},
                label: 'Settings',
                onClick: _ => SettingsEditor.render(),
            }, {
                icon: {src: 'img/lightbulb.svg'},
                label: 'Tutorial',
                onClick: _ => Tutorial.restart(),
            }],
        });

        this.appendChild($menu);
    }

    #onDataChange = _ => {
        this.$points.textContent = HistoryData.points;
    };
}

customElements.define('header-component', Header);
