import ArrayData from './ArrayData.js';

export default class RewardsData extends ArrayData {
    static #items;

    static get items() {
        if (this.#items === undefined) {
            this.#items = this.load();
        }

        return this.#items;
    }

    static get localStorageKey() {
        return 'rewards';
    }
}
