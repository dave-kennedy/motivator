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
            placeholder: 'normal',
            value: ConfigData.get('animations'),
        });

        this.appendChild(this.$animations);
    }

    save() {
        const animations = this.$animations.value || undefined;
        ConfigData.set('animations', animations);
        this.raiseEvent('ConfigUpdated', {animations});
    }

    static render() {
        const $editor = new SettingsEditor();

        Modal.render({
            content: $editor,
            buttons: [
                {label: 'Cancel'},
                {label: 'Save', onClick: _ => $editor.save()},
            ],
        });
    }
}

customElements.define('settings-editor-component', SettingsEditor);
