export default class ObjectData {
    static get data() {
        throw new Error('Not implemented');
    }

    static get(key) {
        return this.data[key];
    }

    static set(key, value) {
        this.data[key] = value;
    }

    static remove(key) {
        delete this.data[key];
    }
}
