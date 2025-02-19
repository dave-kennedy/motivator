import LocalStorage from './LocalStorage.js';

export default class ConfigData {
    static #data;

    static get data() {
        if (this.#data === undefined) {
            this.#data = this.#load();
        }

        return this.#data;
    }

    static #load() {
        return LocalStorage.get('config') || {};
    }

    static #save() {
        LocalStorage.set('config', this.#data);
    }

    static get(key) {
        return this.data[key];
    }

    static set(key, value) {
        this.data[key] = value;
        this.#save();
    }

    static delete(key) {
        delete this.data[key];
        this.#save();
    }
}
