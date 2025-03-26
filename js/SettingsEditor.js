import ConfigData from './data/ConfigData.js';
import CustomElement from './CustomElement.js';
import Modal from './Modal.js';
import Select from './Select.js';

const stylesheet = new CSSStyleSheet();

stylesheet.replace(`settings-editor-component {
    display: flex;
    flex-direction: column;
    gap: 1em;
}`);

export default class SettingsEditor extends CustomElement {
    $animations;
    $theme;

    connectedCallback() {
        this.#render();
    }

    #render() {
        this.applyStylesheet(stylesheet);

        this.$animations = new Select({
            className: 'row',
            id: 'animations-select',
            label: 'Animations',
            options: ['fancy', 'reduced'],
            placeholder: 'default',
            value: ConfigData.get('animations'),
        });

        this.appendChild(this.$animations);

        this.$theme = new Select({
            className: 'row',
            id: 'theme-select',
            label: 'Theme',
            options: ['light', 'dark'],
            placeholder: 'default',
            value: ConfigData.get('theme'),
        });

        this.appendChild(this.$theme);
    }

    save() {
        const animations = this.$animations.value || undefined;
        ConfigData.set('animations', animations);

        const theme = this.$theme.value || undefined;
        ConfigData.set('theme', theme);

        this.raiseEvent('ConfigUpdated', {animations, theme});
    }

    static render() {
        const $editor = new SettingsEditor();

        Modal.render({
            content: $editor,
            buttons: [
                {label: 'Cancel'},
                {focus: true, label: 'Save', onClick: _ => $editor.save()},
            ],
        });
    }
}

customElements.define('settings-editor-component', SettingsEditor);
