import Button from './Button.js';
import CustomElement from './CustomElement.js';

import {popIn, popOut, shiftDown, shiftUp} from './animation.js';

const stylesheet = new CSSStyleSheet();

stylesheet.replace(`list-component {
    display: block;
}

list-component > .loading {
    animation: 1s ease-out infinite loading;
    background-image: linear-gradient(#0aa, #0aa);
    background-repeat: no-repeat;
    background-size: 50%;
    height: 2px;
}

@keyframes loading {
    0%   {background-position: -200% 0;}
    100% {background-position:  300% 0;}
}`);

export default class List extends CustomElement {
    #dataSource;
    #filter;
    #itemFactory;
    #pageSize;
    #sort;

    $items;
    $loadButton;

    constructor({dataSource, filter, itemFactory, pageSize, sort}) {
        super();

        this.#dataSource = dataSource;
        this.#filter = filter;
        this.#itemFactory = itemFactory;
        this.#pageSize = pageSize;
        this.#sort = sort;
    }

    connectedCallback() {
        this.applyStylesheet(stylesheet);

        this.$items = document.createElement('div');
        this.$items.className = 'items';
        this.appendChild(this.$items);

        this.$loadButton = new Button({
            label: 'Load more',
            onClick: _ => this.#loadPage(),
        });

        this.appendChild(this.$loadButton);

        this.$loading = document.createElement('div');
        this.$loading.className = 'loading';
        this.appendChild(this.$loading);

        this.#loadPage();
    }

    async #loadPage() {
        this.$loadButton.hidden = true;
        this.$loading.hidden = false;

        const page = await this.#dataSource.getPage({
            filter: this.#filter,
            sort: this.#sort,
            start: this.$items.children.length,
            count: this.#pageSize,
        });

        this.$loadButton.hidden = page.isLast;
        this.$loading.hidden = true;

        for (const item of page.items) {
            const $item = this.#itemFactory(item);
            this.$items.append($item);
        }
    }

    async addItem(item) {
        const position = await this.#dataSource.getPosition({
            filter: this.#filter,
            sort: this.#sort,
            item,
        });

        if (position === -1 || position > this.$items.children.length) {
            return;
        }

        const $item = this.#itemFactory(item);

        if (position < this.$items.children.length) {
            this.$items.children[position].before($item);
            shiftDown({element: $item, duration: 250});
            popIn({element: $item, delay: 250, duration: 250, fill: 'backwards'});
        } else {
            this.$items.append($item);
            popIn({element: $item, duration: 250});
        }
    }

    async deleteItem(item) {
        const $item = document.getElementById(item.id);
        const position = [...this.$items.children].indexOf($item);

        if (position === -1) {
            return;
        }

        if (position < this.$items.children.length - 1) {
            await popOut({element: $item, duration: 250, fill: 'forwards'});
            await shiftUp({element: $item, duration: 250});
        } else {
            await popOut({element: $item, duration: 250});
        }

        $item.remove();
    }

    async updateItem(item, newItem) {
        const $item = document.getElementById(item.id);
        const position = [...this.$items.children].indexOf($item);

        const newPosition = await this.#dataSource.getPosition({
            filter: this.#filter,
            sort: this.#sort,
            item: newItem || item,
        });

        if (position === -1 && newPosition === -1) {
            return;
        }

        if (position === newPosition) {
            const $newItem = this.#itemFactory(newItem || item);
            await popOut({element: $item, duration: 250});
            $item.replaceWith($newItem);
            popIn({element: $newItem, duration: 250});
            return;
        }

        if (position > -1) {
            if (position < this.$items.children.length - 1) {
                await popOut({element: $item, duration: 250, fill: 'forwards'});
                await shiftUp({element: $item, duration: 250});
            } else {
                await popOut({element: $item, duration: 250});
            }

            $item.remove();
        }

        if (newPosition === -1 || newPosition > this.$items.children.length) {
            return;
        }

        const $newItem = this.#itemFactory(newItem || item);

        if (newPosition < this.$items.children.length) {
            this.$items.children[newPosition].before($newItem);
            shiftDown({element: $newItem, duration: 250});
            popIn({element: $newItem, delay: 250, duration: 250, fill: 'backwards'});
        } else {
            this.$items.append($newItem);
            popIn({element: $newItem, duration: 250});
        }
    }
}

customElements.define('list-component', List);
