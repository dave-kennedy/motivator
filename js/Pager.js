import CustomElement from './CustomElement.js';
import GoalsPage from './GoalsPage.js';
import HistoryPage from './HistoryPage.js';
import RewardsPage from './RewardsPage.js';

const stylesheet = new CSSStyleSheet();

stylesheet.replace(`pager-component {
    display: flex;
    flex-direction: column;
}

pager-component .tabs {
    display: flex;
    position: relative;
}

pager-component .tabs::after {
    background-color: #0aa;
    content: '';
    display: block;
    height: 2px;
    width: calc(100% / var(--num-pages));

    position: absolute;
    bottom: 0;
    left: calc(var(--page-index) / var(--num-pages) * 100%);
    transition: left 300ms;
}

pager-component .tabs > * {
    box-sizing: border-box;
    color: #0aa;
    cursor: pointer;
    flex: 0 0 calc(100% / var(--num-pages));
    padding: 0.5em;
    text-align: center;
}

pager-component .pages {
    display: flex;
    overflow-x: hidden;
}

pager-component .pages > * {
    box-sizing: border-box;
    flex: 0 0 100%;
    overflow-y: auto;
    padding: 1em;

    position: relative;
    left: calc(var(--page-index) * -100%);
    transition: left 300ms;
}`);

export default class Pager extends CustomElement {
    #pages;
    #pageIndex;

    constructor() {
        super();

        addEventListener('hashchange', _ => this.#onHashChange());
    }

    connectedCallback() {
        this.#render();
    }

    #render() {
        this.applyStylesheet(stylesheet);

        const $tabs = document.createElement('div');
        $tabs.className = 'tabs';
        this.appendChild($tabs);

        const $pages = document.createElement('div');
        $pages.className = 'pages';
        this.appendChild($pages);

        this.#pages = [
            new GoalsPage(),
            new RewardsPage(),
            new HistoryPage(),
        ];

        this.style.setProperty('--num-pages', this.#pages.length);

        for (const $page of this.#pages) {
            const $tab = document.createElement('div');
            $tab.addEventListener('click', _ => location.hash = $page.pageId);
            $tab.textContent = $page.pageTitle;
            $tabs.appendChild($tab);

            $pages.appendChild($page);
        }

        this.#onHashChange();
    }

    #onHashChange() {
        const pageId = location.hash.slice(1);
        const pageIndex = this.#pages.findIndex($page => $page.pageId === pageId);

        if (pageIndex === -1) {
            location.hash = this.#pages[0].pageId;
            return;
        }

        if (pageIndex === this.#pageIndex) {
            return;
        }

        this.style.setProperty('--page-index', pageIndex);

        const $page = this.#pages[pageIndex];
        $page.onPageVisible();

        this.#pageIndex = pageIndex;
    }
}

customElements.define('pager-component', Pager);
