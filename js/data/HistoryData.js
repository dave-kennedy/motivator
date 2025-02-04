import GoalsData from './GoalsData.js';
import RewardsData from './RewardsData.js';

export default class HistoryData {
    static get points() {
        return this.getItems().reduce((sum, i) => {
            return i.completed ? sum + i.points : sum - i.points;
        }, 0);
    }

    static getItems() {
        return [
            ...GoalsData.getItems({filter: i => i.completed}),
            ...RewardsData.getItems({filter: i => i.redeemed}),
        ];
    }

    static getPage({start, count}) {
        const items = this.getItems().toSorted((a, b) => {
            return (b.completed || b.redeemed) - (a.completed || a.redeemed);
        });

        return {
            items: items.slice(start, start + count),
            isLast: items.length <= start + count,
        };
    }

    static getPosition({item}) {
        const items = this.getItems().toSorted((a, b) => {
            return (b.completed || b.redeemed) - (a.completed || a.redeemed);
        });

        return items.findIndex(i => i.id === item.id);
    }
}
