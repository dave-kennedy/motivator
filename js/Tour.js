import Hint from './Hint.js';
import Modal from './Modal.js';

export default class Tour {
    static #hints = [{
        anchor: 'pager-component .tabs > :first-child',
        content: 'This is the goals page. It lists your current goals.',
    }, {
        anchor: 'pager-component .tabs > :nth-child(2)',
        content: 'The rewards page lists your current rewards.',
    }, {
        anchor: 'pager-component .tabs > :last-child',
        content: 'The history page lists your completed goals and redeemed rewards.',
    }, {
        anchor: '#action-button',
        content: 'Click here to create a new goal.',
    }, {
        anchor: 'goals-page-component check-button-component button',
        content: `After you've completed this goal, click here to check it off and earn points.`,
        onError: _ => this.#createGoal(),
    }, {
        anchor: 'goals-page-component menu-component',
        content: 'Click here to edit or delete this goal.',
        onError: _ => this.#createGoal(),
    }, {
        anchor: 'header-component menu-component',
        content: 'The main menu contains additional information and options.',
    }];

    static #createGoal() {
        document.addEventListener('GoalCreated', this.#onGoalCreated, {once: true});
        document.querySelector('#action-button').click();
    }

    static #onGoalCreated = event => {
        setTimeout(async _ => {
            const $goal = document.getElementById(event.detail.id);
            await Promise.all($goal.getAnimations().map(a => a.finished));
            this.#showHint(this.#resumeFromIndex);
        });
    };

    static #resumeFromIndex;

    static prompt() {
        Modal.render({
            content: `You're off to a great start! How about a quick tour?`,
            buttons: [
                {label: 'No'},
                {focus: true, label: 'Yes', onClick: _ => this.start()},
            ],
        });
    }

    static start() {
        location.hash = 'goals';
        setTimeout(_ => this.#showHint(0));
    }

    static #showHint(index) {
        if (index === this.#hints.length) {
            this.#finish();
            return;
        }

        const {anchor, content, onError} = this.#hints[index];
        const $anchor = document.querySelector(anchor);

        if (!$anchor) {
            onError();
            this.#resumeFromIndex = index;
            return;
        }

        const backButton = index > 0
            ? {
                icon: 'arrow-left',
                label: 'Back',
                onClick: _ => this.#showHint(index - 1),
            }
            : undefined;

        const nextButton = {
            className: 'icon-right',
            icon: 'arrow-right',
            label: 'Next',
            onClick: _ => this.#showHint(index + 1),
        };

        Hint.render({
            anchor: $anchor,
            content,
            backButton,
            nextButton,
            progress: `${index + 1} of ${this.#hints.length}`,
        }).addEventListener('beforeclose', event => {
            // Assuming they don't want to exit the tour
            if (event.detail.reason === 'Backdrop') {
                this.#showHint(index + 1);
            }
        });
    }

    static #finish() {
        Modal.render({content: `That's the end of the tour. If you missed anything, you can restart
            it from the main menu at any time.`});
    }
}
