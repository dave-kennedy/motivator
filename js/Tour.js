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
        anchor: 'goals-page-component check-button-component button',
        content: `When you've completed this goal, click here to check it off and earn points.`,
    }, {
        anchor: 'goals-page-component menu-component',
        content: 'Click here to edit or delete this goal.',
    }, {
        anchor: '#action-button',
        content: 'Click here to create a new goal.',
    }, {
        anchor: 'header-component menu-component',
        content: 'Click here for additional information and options.',
    }];

    static prompt() {
        Modal.render({
            content: `You're off to a great start! How about a quick tour to keep the momentum going?`,
            buttons: [
                {label: 'No'},
                {focus: true, label: 'Yes', onClick: _ => this.start()},
            ],
        });
    }

    static start() {
        this.#showHint(0);
    }

    static #showHint(index) {
        if (index === this.#hints.length) {
            this.#finish();
            return;
        }

        const {anchor, content} = this.#hints[index];

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
            anchor,
            content,
            backButton,
            nextButton,
            progress: `${index + 1} of ${this.#hints.length}`,
        });
    }

    static #finish() {
        Modal.render({
            content: `That's the end of the tour. If you missed anything, you can restart it from
                the main menu in the top-right corner.`,
        });
    }
}
