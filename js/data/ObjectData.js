import LocalStorage from './LocalStorage.js';

export default class ObjectData {
    static get data() {
        throw new Error('Not implemented');
    }

    static get localStorageKey() {
        throw new Error('Not implemented');
    }

    static load() {
        return LocalStorage.load(this.localStorageKey) || {};
    }

    static get(key) {
        return this.data[key];
    }

    static set(key, value) {
        this.data[key] = value;
        LocalStorage.save(this.localStorageKey, this.data);
    }

    static remove(key) {
        delete this.data[key];
        LocalStorage.save(this.localStorageKey, this.data);
    }
}
