import ArrayData from './ArrayData.js';

export default class GoalsData extends ArrayData {
    static #items;

    static get items() {
        if (this.#items === undefined) {
            this.#items = this.load();
        }

        return this.#items;
    }

    static get localStorageKey() {
        return 'goals';
    }

    static get completed() {
        return this.items.filter(item => item.completed);
    }

    static get completedPoints() {
        return this.completed.reduce((total, item) => total + item.points, 0);
    }

    static get uncompleted() {
        return this.items.filter(item => !item.completed);
    }
}
