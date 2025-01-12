import ConfigData from './data/ConfigData.js';
import Hint from './Hint.js';

export default class Tutorial {
    static events = [
        'GoalsPageRendered',
        'GoalCreated',
        'GoalCompleted',
        'RewardsPageRendered',
        'RewardCreated',
        'RewardRedeemed',
        'HistoryPageRendered',
    ];

    static listen() {
        for (const name of this.events) {
            document.addEventListener(name, _ => {
                if (ConfigData.get(`${name}HintShown`)) {
                    return;
                }

                if (this[`on${name}`]()) {
                    ConfigData.set(`${name}HintShown`, true);
                }
            });
        }
    }

    static showHint({anchor, position, message, onClose}) {
        const $anchor = document.querySelector(anchor);

        if (!$anchor) {
            return false;
        }

        const $hint = new Hint({
            anchor: $anchor,
            position,
            message,
        });

        document.querySelector('app-component').appendChild($hint);

        if (onClose) {
            $hint.addEventListener('close', onClose);
        }

        return true;
    }

    static onGoalsPageRendered() {
        return this.showHint({
            anchor: '#action-button',
            position: 'top-left',
            message: 'Click here to create a new goal',
        });
    }

    static onGoalCreated() {
        return this.showHint({
            anchor: 'check-button-component button',
            position: 'bottom-right',
            message: 'Click here to complete this goal',
        });
    }

    static onGoalCompleted() {
        return this.showHint({
            anchor: 'header-component .points',
            position: 'bottom-right',
            message: 'When you complete a goal, its points are added to your total',
            onClose: _ => this.onGoalCompletedHintClosed(),
        });
    }

    static onGoalCompletedHintClosed() {
        return this.showHint({
            anchor: '#rewards-tab',
            position: 'bottom-left',
            message: 'Click here to see your rewards',
        });
    }

    static onRewardsPageRendered() {
        return this.showHint({
            anchor: '#action-button',
            position: 'top-left',
            message: 'Click here to create a new reward',
        });
    }

    static onRewardCreated() {
        return this.showHint({
            anchor: 'check-button-component button',
            position: 'bottom-right',
            message: 'Click here to redeem this reward',
        });
    }

    static onRewardRedeemed() {
        return this.showHint({
            anchor: 'header-component .points',
            position: 'bottom-right',
            message: 'When you redeem a reward, its points are deducted from your total',
            onClose: _ => this.onRewardRedeemedHintClosed(),
        });
    }

    static onRewardRedeemedHintClosed() {
        return this.showHint({
            anchor: '#history-tab',
            position: 'bottom-left',
            message: 'Click here to see your completed goals and redeemed rewards',
        });
    }

    static onHistoryPageRendered() {
        return this.showHint({
            anchor: 'check-button-component button',
            position: 'bottom-right',
            message: 'Accidentally hit the check button? Click here to undo',
        });
    }
}
