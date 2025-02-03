import CustomElement from './CustomElement.js';

const stylesheet = new CSSStyleSheet();

stylesheet.replace(`about-component h1 {
    margin: 0;
}

about-component img {
    vertical-align: middle;
}`);

export default class About extends CustomElement {
    connectedCallback() {
        this.#render();
    }

    #render() {
        this.applyStylesheet(stylesheet);

        this.innerHTML = `<h1>Motivator</h1>
            <p>Version 2.1.0 © ${new Date().getFullYear()}</p>
            <p>
                <a href="https://github.com/dave-kennedy/motivator">
                    <img alt="GitHub" src="img/github.svg" /> dave-kennedy/motivator
                </a>
            </p>
            <p>
                <a href="mailto:motivator@dkennedy.io">
                    <img alt="Email" src="img/email.svg" /> motivator@dkennedy.io
                </a>
            </p>`;
    }
}

customElements.define('about-component', About);
