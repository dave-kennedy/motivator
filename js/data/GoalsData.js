import ArrayData from './ArrayData.js';

export default class GoalsData extends ArrayData {
    static #items = [{
        id: '09f2f0bd-60a0-4a07-ba36-9dfa87661a6e',
        created: 1704135600000,
        name: 'Goal 1',
        description: 'This is goal 1.',
        points: 1,
        completed: 1704139200000,
    }, {
        id: '4b9c408b-bb2f-4af4-98d3-bcc4540b9eda',
        created: 1704222000000,
        name: 'Goal 2',
        description: 'This is goal 2.',
        points: 2,
        completed: 1704225600000,
    }, {
        id: 'c7689c18-84ed-47bb-a249-cc880d2c590f',
        created: 1704308400000,
        name: 'Goal 3',
        description: 'This is goal 3.',
        points: 3,
        completed: 1704312000000,
    }, {
        id: 'aaf080dc-7c6d-4271-a5fc-78cb25324857',
        created: 1704394800000,
        name: 'Goal 4',
        description: 'This is goal 4.',
        points: 4,
    }, {
        id: '9a31a3fd-6ea2-4fde-9946-e6e402083fbf',
        created: 1704481200000,
        name: 'Goal 5',
        description: 'This is goal 5.',
        points: 5,
        repeat: true,
    }];

    static get items() {
        return this.#items;
    }
}
