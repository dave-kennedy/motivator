import ConfigData from './data/ConfigData.js';
import CustomElement from './CustomElement.js';
import Header from './Header.js';
import Intro from './Intro.js';
import Pager from './Pager.js';
import Tour from './Tour.js';

const stylesheet = new CSSStyleSheet();

stylesheet.replace(`app-component {
    display: block;
    height: 100%;
}

app-component header-component {
    height: 10%;
}

app-component pager-component {
    height: 90%;
}`);

export default class App extends CustomElement {
    #darkThemeQuery = matchMedia('(prefers-color-scheme: dark)');
    #reduceMotionQuery = matchMedia('(prefers-reduced-motion)');

    connectedCallback() {
        this.#render();

        document.addEventListener('ConfigUpdated', this.#setBodyClass);
        this.#darkThemeQuery.addEventListener('change', this.#setBodyClass);
        this.#reduceMotionQuery.addEventListener('change', this.#setBodyClass);
    }

    disconnectedCallback() {
        document.removeEventListener('ConfigUpdated', this.#setBodyClass);
        this.#darkThemeQuery.removeEventListener('change', this.#setBodyClass);
        this.#reduceMotionQuery.removeEventListener('change', this.#setBodyClass);
    }

    #render() {
        this.applyStylesheet(stylesheet);

        if (!ConfigData.get('introFinished')) {
            Intro.render().addEventListener('close', _ => Tour.prompt());
        }

        const $header = new Header();
        this.appendChild($header);

        const $pager = new Pager();
        this.appendChild($pager);

        this.#setBodyClass();
    }

    #setBodyClass = _ => {
        if (this.#darkThemeQuery.matches || ConfigData.get('theme') === 'dark') {
            document.body.classList.add('dark-theme');
        } else {
            document.body.classList.remove('dark-theme');
        }

        if (this.#reduceMotionQuery.matches || ConfigData.get('animations') === 'reduced') {
            document.body.classList.add('reduce-motion');
        } else {
            document.body.classList.remove('reduce-motion');
        }
    };
}

customElements.define('app-component', App);
