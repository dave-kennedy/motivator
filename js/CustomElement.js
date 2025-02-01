export default class CustomElement extends HTMLElement {
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
                if (error.name === 'AbortError') {
                    // Animation was canceled, no problem
                } else {
                    throw error;
                }
            }
        });
    }

    raiseEvent(name, detail) {
        document.dispatchEvent(new CustomEvent(name, {detail}));
    }
}
