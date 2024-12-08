import CustomElement from './CustomElement.js';

const stylesheet = new CSSStyleSheet();

stylesheet.replace(`history-page-component {
    display: flex;
    align-items: center;
    flex-direction: column;
    gap: 1em;
}

history-page-component .date {
    font-weight: bold;
}`);

export default class HistoryPage extends CustomElement {
    #groups;

    pageId = 'history';
    pageTitle = 'History';

    constructor() {
        super();
    }

    connectedCallback() {
        this.#render();
    }

    #render() {
        this.applyStylesheet(stylesheet);

        this.#groups = new Map([
            ['1/1/2024', [1, 2, 3]],
            ['1/2/2024', [1, 2, 3]],
            ['1/3/2024', [1, 2, 3]],
            ['1/4/2024', [1, 2, 3]],
            ['1/5/2024', [1, 2, 3]],
            ['1/6/2024', [1, 2, 3]],
        ]);

        for (const [date, items] of this.#groups) {
            const $date = document.createElement('div');
            $date.className = 'date';
            $date.textContent = date;
            this.appendChild($date);

            for (const item of items) {
                const $item = document.createElement('div');
                $item.textContent = `item-${item}`;
                this.appendChild($item);
            }
        }
    }
}

customElements.define('history-page-component', HistoryPage);
