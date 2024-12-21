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

    static get redeemed() {
        return this.items.filter(item => item.redeemed);
    }

    static get redeemedPoints() {
        return this.redeemed.reduce((total, item) => total + item.points, 0);
    }

    static get unredeemed() {
        return this.items.filter(item => !item.redeemed);
    }
}
