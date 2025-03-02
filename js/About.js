import CustomElement from './CustomElement.js';
import Modal from './Modal.js';

const stylesheet = new CSSStyleSheet();

stylesheet.replace(`about-component {
    display: flex;
    align-items: center;
    flex-direction: column;
    gap: 1em;
}

about-component .logo {
    max-width: 100%;
}`);

export default class About extends CustomElement {
    connectedCallback() {
        this.#render();
    }

    #render() {
        this.applyStylesheet(stylesheet);

        this.innerHTML = `<img alt="Motivator" class="logo" src="img/logo.png" />
            <div>Version 2.3.1 © ${new Date().getFullYear()}</div>
            <div>
                <a href="https://github.com/dave-kennedy/motivator-android">Android app source code</a>
            </div>
            <div>
                <a href="https://github.com/dave-kennedy/motivator">Web app source code</a>
            </div>
            <div>
                <a href="https://github.com/dave-kennedy/motivator/blob/main/PRIVACY.md">Privacy policy</a>
            </div>
            <div>
                <a href="https://github.com/dave-kennedy/motivator/blob/main/LICENSE.txt">License/TOU</a>
            </div>
            <div>
                <a href="mailto:motivator@dkennedy.io">Contact</a>
            </div>`;
    }

    static render() {
        Modal.render({content: new About()});
    }
}

customElements.define('about-component', About);
