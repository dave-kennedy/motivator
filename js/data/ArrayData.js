import LocalStorage from './LocalStorage.js';

export default class ArrayData {
    static get items() {
        throw new Error('Not implemented');
    }

    static get localStorageKey() {
        throw new Error('Not implemented');
    }

    static load() {
        return LocalStorage.load(this.localStorageKey) || [];
    }

    static add(item) {
        this.items.push(item);
        LocalStorage.save(this.localStorageKey, this.items);
    }

    static remove(item) {
        const index = this.items.findIndex(other => other.id === item.id);
        this.items.splice(index, 1);
        LocalStorage.save(this.localStorageKey, this.items);
    }

    static update(item) {
        const index = this.items.findIndex(other => other.id === item.id);
        const oldItem = this.items[index];
        const newItem = {...oldItem, ...item};
        this.items[index] = newItem;
        LocalStorage.save(this.localStorageKey, this.items);
    }
}
