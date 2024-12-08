import ArrayData from './ArrayData.js';

export default class RewardsData extends ArrayData {
    static #items = [{
        id: '4d6c49b3-2e27-40ed-a9b2-a0b42d748534',
        created: 1704136200000,
        name: 'Reward 1',
        description: 'This is reward 1.',
        points: 1,
        redeemed: 1704139800000,
    }, {
        id: 'e2acb6c3-c6ee-42ad-bc70-28afba2ecd7c',
        created: 1704222600000,
        name: 'Reward 2',
        description: 'This is reward 2.',
        points: 2,
        redeemed: 1704226200000,
    }, {
        id: 'ac25ae4d-fe5a-4efc-9b14-d2e7f1b6d121',
        created: 1704309000000,
        name: 'Reward 3',
        description: 'This is reward 3.',
        points: 3,
        redeemed: 1704312600000,
    }, {
        id: 'e4d3ab9b-a09b-41ee-9c6c-6101d338dcce',
        created: 1704395400000,
        name: 'Reward 4',
        description: 'This is reward 4.',
        points: 4,
    }, {
        id: '2196907c-c513-4277-b4bc-13fd6a225c2a',
        created: 1704481800000,
        name: 'Reward 5',
        description: 'This is reward 5.',
        points: 5,
        repeat: true,
    }];

    static get items() {
        return this.#items;
    }
}
