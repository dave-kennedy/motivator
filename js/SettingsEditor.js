import ConfigData from './data/ConfigData.js';
import CustomElement from './CustomElement.js';
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
        const data = {animations: this.$animations.value || undefined};
        ConfigData.set('animations', data.animations);
        this.raiseEvent('ConfigUpdated', data);
        return true;
    }
}

customElements.define('settings-editor-component', SettingsEditor);
