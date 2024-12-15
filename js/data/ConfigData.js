import ObjectData from './ObjectData.js';

export default class ConfigData extends ObjectData {
    static #data;

    static get data() {
        if (this.#data === undefined) {
            this.#data = this.load();
        }

        return this.#data;
    }

    static get localStorageKey() {
        return 'config';
    }
}
