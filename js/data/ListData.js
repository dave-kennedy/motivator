export default class ListData {
    #items;

    constructor(items = []) {
        this.#items = items;
    }

    add(item) {
        this.#items.push(item);
    }

    delete(item) {
        const index = this.#items.findIndex(i => i.id === item.id);
        this.#items.splice(index, 1);
    }

    update(item) {
        const index = this.#items.findIndex(i => i.id === item.id);
        this.#items.splice(index, 1, item);
    }

    getItems({filter, sort, start, count} = {}) {
        let items = [...this.#items];
        if (filter) { items = items.filter(filter); }
        if (sort)   { items = items.toSorted(sort); }
        if (start)  { items = items.slice(start); }
        if (count)  { items = items.slice(0, count); }
        return items;
    }

    getPage({filter, sort, start, count}) {
        const items = this.getItems({filter, sort});

        return {
            items: items.slice(start, start + count),
            isLast: items.length <= start + count,
        };
    }

    getPosition({filter, sort, item}) {
        const items = this.getItems({filter, sort});
        return items.findIndex(i => i.id === item.id);
    }
}
