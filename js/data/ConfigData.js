import ObjectData from './ObjectData.js';

export default class ConfigData extends ObjectData {
    static #data = {};

    static get data() {
        return this.#data;
    }
}
