import ColorPicker from './ColorPicker.js';
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
    $accentColor;
    $animations;
    $theme;

    connectedCallback() {
        this.#render();
    }

    #render() {
        this.applyStylesheet(stylesheet);

        this.$accentColor = new ColorPicker({
            id: 'accent-color-picker',
            label: 'Accent color',
            placeholder: this.#getThemeColor('--accent-color'),
            value: ConfigData.get('accentColor'),
        });

        this.appendChild(this.$accentColor);

        this.$animations = new Select({
            id: 'animations-select',
            label: 'Animations',
            options: ['fancy', 'reduced'],
            placeholder: 'default',
            value: ConfigData.get('animations'),
        });

        this.appendChild(this.$animations);

        this.$theme = new Select({
            id: 'theme-select',
            label: 'Theme',
            options: ['light', 'dark'],
            placeholder: 'default',
            value: ConfigData.get('theme'),
        });

        this.appendChild(this.$theme);
    }

    #getThemeColor(name) {
        const customColor = getComputedStyle(this).getPropertyValue(name);
        document.body.style.removeProperty(name);

        const themeColor = getComputedStyle(this).getPropertyValue(name);
        document.body.style.setProperty(name, customColor);

        if (!themeColor) {
            return;
        }

        if (themeColor.startsWith('#') && themeColor.length === 4) {
            const rr = themeColor[1].repeat(2);
            const gg = themeColor[2].repeat(2);
            const bb = themeColor[3].repeat(2);
            return `#${rr}${gg}${bb}`;
        }

        return themeColor;
    }

    save() {
        const accentColor = this.$accentColor.value || undefined;
        ConfigData.set('accentColor', accentColor);

        const animations = this.$animations.value || undefined;
        ConfigData.set('animations', animations);

        const theme = this.$theme.value || undefined;
        ConfigData.set('theme', theme);

        this.raiseEvent('ConfigUpdated', {accentColor, animations, theme});
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
