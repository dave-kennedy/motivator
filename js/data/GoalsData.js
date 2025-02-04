import ListData from './ListData.js';
import LocalStorage from './LocalStorage.js';

export default class GoalsData {
    static #data;

    static get data() {
        if (this.#data === undefined) {
            this.#data = this.#load();
        }

        return this.#data;
    }

    static #load() {
        const items = LocalStorage.load('goals');
        return new ListData(items);
    }

    static #save() {
        const items = this.data.getItems();
        LocalStorage.save('goals', items);
    }

    static add(item) {
        this.data.add(item);
        this.#save();
    }

    static delete(item) {
        this.data.delete(item);
        this.#save();
    }

    static update(item) {
        this.data.update(item);
        this.#save();
    }

    static getItems({filter, sort, start, count}) {
        return this.data.getItems({filter, sort, start, count});
    }

    static getPage({filter, sort, start, count}) {
        return this.data.getPage({filter, sort, start, count});
    }

    static getPosition({filter, sort, item}) {
        return this.data.getPosition({filter, sort, item});
    }
}
