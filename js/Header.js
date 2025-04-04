import About from './About.js';
import CustomElement from './CustomElement.js';
import HistoryData from './data/HistoryData.js';
import Menu from './Menu.js';
import Modal from './Modal.js';
import SettingsEditor from './SettingsEditor.js';
import Tour from './Tour.js';

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

        const items = [{
            icon: {src: 'img/export.svg'},
            label: 'Export',
            onClick: _ => this.#exportData(),
        }, {
            icon: {src: 'img/import.svg'},
            label: 'Import',
            onClick: _ => this.#importConfirm(),
        }, {
            icon: {src: 'img/info.svg'},
            label: 'About',
            onClick: _ => About.render(),
        }, {
            icon: {src: 'img/settings.svg'},
            label: 'Settings',
            onClick: _ => SettingsEditor.render(),
        }, {
            icon: {src: 'img/tour.svg'},
            label: 'Tour',
            onClick: _ => Tour.start(),
        }];

        if (navigator.userAgent !== 'io.dkennedy.motivator') {
            items.push({
                icon: {src: 'img/play-store.svg'},
                label: 'Get the app',
                onClick: _ => open('https://play.google.com/store/apps/details?id=io.dkennedy.motivator'),
            });
        }

        const $menu = new Menu({
            handle: {
                icon: {alt: 'Menu', src: 'img/menu.svg'},
                title: 'Menu',
            },
            items,
        });

        this.appendChild($menu);
    }

    #onDataChange = _ => {
        this.$points.textContent = HistoryData.points;
    };

    #exportData() {
        const data = encodeURIComponent(JSON.stringify(localStorage));
        const $link = document.createElement('a');
        $link.download = `motivator-export-${Date.now()}.json`;
        $link.href = `data:application/json;charset=UTF-8,${data}`;
        $link.click();
    }

    #importConfirm() {
        Modal.render({
            content: 'Importing will overwrite all data. Continue?',
            buttons: [
                {label: 'No'},
                {focus: true, label: 'Yes', onClick: _ => this.#importData()},
            ],
        });
    }

    #importData() {
        const $input = document.createElement('input');
        $input.type = 'file';
        $input.addEventListener('change', event => this.#onImportFileChange(event));
        $input.click();
    }

    #onImportFileChange(event) {
        const file = event.target.files[0];

        if (!file) {
            Modal.render({content: 'Please select a file.'});
            return;
        }

        if (file.type !== 'application/json') {
            Modal.render({content: 'Unsupported file type. Please select a JSON file.'});
            return;
        }

        const reader = new FileReader();

        reader.addEventListener('error', _ => {
            Modal.render({content: `Unable to read file. Please make sure it's accessible.`});
        });

        reader.addEventListener('load', _ => this.#onImportFileLoad(reader.result));
        reader.readAsText(file);
    }

    #onImportFileLoad(text) {
        try {
            const data = JSON.parse(text);

            for (const key of ['config', 'goals', 'rewards']) {
                if (data[key]) {
                    localStorage.setItem(key, data[key]);
                }
            }

            location.reload();
        } catch (error) {
            Modal.render({content: `Unable to parse file. Please make sure it's correctly formatted.`});
            throw error;
        }
    }
}

customElements.define('header-component', Header);
