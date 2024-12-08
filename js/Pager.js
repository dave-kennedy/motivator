import CustomElement from './CustomElement.js';

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
            'goals',
            'rewards',
            'history',
        ];

        this.style.setProperty('--num-pages', this.#pages.length);

        for (const page of this.#pages) {
            const $tab = document.createElement('div');
            $tab.addEventListener('click', _ => location.hash = `#${page}`);
            $tab.className = `${page}-tab`;
            $tab.textContent = `${page}-tab`;
            $tabs.appendChild($tab);

            const $page = document.createElement('div');
            $page.className = `${page}-page`;
            $page.textContent = `${page}-page`;
            $pages.appendChild($page);
        }

        this.#onHashChange();
    }

    #onHashChange() {
        const pageId = location.hash.slice(1);
        const pageIndex = this.#pages.indexOf(pageId);

        if (pageIndex === -1) {
            location.hash = this.#pages[0];
            return;
        }

        this.style.setProperty('--page-index', pageIndex);
    }
}

customElements.define('pager-component', Pager);
