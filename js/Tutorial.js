import ConfigData from './data/ConfigData.js';
import Hint from './Hint.js';
import Modal from './Modal.js';

import {reduceMotion} from './animation.js';

export default class Tutorial {
    static hints = {
        newGoal: {
            anchor: '#action-button',
            position: 'top-left',
            message: 'Click here to create a new goal',
            delay: 250,
        },
        completeGoal: {
            anchor: 'goals-page-component check-button-component button',
            position: 'bottom-right',
            message: 'Click here to complete this goal',
            delay: 500,
        },
        rewardsTab: {
            anchor: '#rewards-tab',
            position: 'bottom-left',
            message: 'Click here to see your rewards',
        },
        newReward: {
            anchor: '#action-button',
            position: 'top-left',
            message: 'Click here to create a new reward',
            delay: 250,
        },
        redeemReward: {
            anchor: 'rewards-page-component check-button-component button',
            position: 'bottom-right',
            message: 'Click here to redeem this reward',
            delay: 500,
        },
        historyTab: {
            anchor: '#history-tab',
            position: 'bottom-left',
            message: 'Click here to see your completed goals and redeemed rewards',
        },
        undoCheck: {
            anchor: 'history-page-component check-button-component button',
            position: 'bottom-right',
            message: 'Accidentally hit the check button? Click here to undo',
            delay: 250,
        },
    };

    static hintsDisplayed = [];

    static prompt() {
        if (ConfigData.get('tutorialSkipped') || ConfigData.get('tutorialStarted')) {
            return;
        }

        Modal.render('Would you like to start the tutorial?', [
            {label: 'No', onClick: _ => this.skip()},
            {focus: true, label: 'Yes', onClick: _ => this.start()},
        ]);
    }

    static skip() {
        ConfigData.set('tutorialSkipped', true);
        return true;
    }

    static start() {
        ConfigData.set('tutorialStarted', true);
        this.listen();

        if (location.hash !== '#goals') {
            location.hash = '#goals';
        } else {
            this.onGoalsPageRendered();
        }

        return true;
    }

    static restart() {
        this.hintsDisplayed = [];
        this.start();
    }

    static listen() {
        document.addEventListener('GoalsPageRendered', this.onGoalsPageRendered);
        document.addEventListener('GoalCreated', this.onGoalCreated);
        document.addEventListener('GoalCompleted', this.onGoalCompleted);
        document.addEventListener('RewardsPageRendered', this.onRewardsPageRendered);
        document.addEventListener('RewardCreated', this.onRewardCreated);
        document.addEventListener('RewardRedeemed', this.onRewardRedeemed);
        document.addEventListener('HistoryPageRendered', this.onHistoryPageRendered);
    }

    static onGoalsPageRendered = _ => this.displayHint('newGoal');
    static onGoalCreated = _ => this.displayHint('completeGoal');
    static onGoalCompleted = _ => this.displayHint('rewardsTab');
    static onRewardsPageRendered = _ => this.displayHint('newReward');
    static onRewardCreated = _ => this.displayHint('redeemReward');
    static onRewardRedeemed = _ => this.displayHint('historyTab');
    static onHistoryPageRendered = _ => this.displayHint('undoCheck');

    static async displayHint(hint) {
        if (this.hintsDisplayed.includes(hint)) {
            return;
        }

        const {
            anchor,
            position,
            message,
            delay,
        } = this.hints[hint];

        const $anchor = await new Promise(resolve => {
            setTimeout(_ => {
                resolve(document.querySelector(anchor));
            }, reduceMotion() ? 0 : delay);
        });

        if (!$anchor) {
            return;
        }

        const $hint = new Hint({
            anchor: $anchor,
            position,
            message,
        });

        document.querySelector('app-component').appendChild($hint);
        this.hintsDisplayed.push(hint);

        if (Object.keys(this.hints).every(hint => this.hintsDisplayed.includes(hint))) {
            $hint.addEventListener('close', _ => this.complete());
        }
    }

    static complete() {
        Modal.render(`That's the end of the tutorial. If you missed anything,
            you can restart it from the menu in the top-right corner.`);
    }
}
