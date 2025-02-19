export default class LocalStorage {
    static get(key) {
        const json = localStorage.getItem(key);
        return json ? JSON.parse(json) : undefined;
    }

    static set(key, value) {
        const json = JSON.stringify(value);
        localStorage.setItem(key, json);
        return value;
    }
}
