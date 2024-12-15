export default class LocalStorage {
    static load(key) {
        const json = localStorage.getItem(key);

        if (!json) {
            return;
        }

        return JSON.parse(json);
    }

    static save(key, value) {
        const json = JSON.stringify(value);
        localStorage.setItem(key, json);
        return value;
    }
}
