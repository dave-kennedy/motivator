export default class ArrayData {
    static get items() {
        throw new Error('Not implemented');
    }

    static add(item) {
        this.items.push(item);
    }

    static remove(item) {
        const index = this.items.findIndex(other => other.id === item.id);
        this.items.splice(index, 1);
    }

    static update(item) {
        const index = this.items.findIndex(other => other.id === item.id);
        const oldItem = this.items[index];
        const newItem = {...oldItem, ...item};
        this.items[index] = newItem;
    }
}
