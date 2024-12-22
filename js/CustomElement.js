export default class CustomElement extends HTMLElement {
    constructor() {
        super();
    }

    applyStylesheet(stylesheet) {
        if (!document.adoptedStyleSheets.includes(stylesheet)) {
            document.adoptedStyleSheets.push(stylesheet);
        }
    }

    afterAnimations(callback) {
        requestAnimationFrame(async _ => {
            try {
                await Promise.all(this.getAnimations().map(a => a.finished));
                callback();
            } catch (error) {
                if (error.message.includes('operation was aborted')) {
                    // Animation was canceled, no problem
                } else {
                    throw error;
                }
            }
        });
    }
}
