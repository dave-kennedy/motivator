import Button from './Button.js';

export default class ActionButton {
    static $button;

    static render({label, onClick}) {
        const $newButton = new Button({
            className: 'big fab round',
            icon: 'add',
            onClick: onClick,
            title: label,
        });

        $newButton.id = 'action-button';

        this.$button?.remove();
        this.$button = $newButton;

        document.querySelector('app-component').appendChild($newButton);
    }

    static remove() {
        this.$button?.remove();
        this.$button = undefined;
    }
}
