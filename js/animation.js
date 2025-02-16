import ConfigData from './data/ConfigData.js';

const mediaQuery = matchMedia('(prefers-reduced-motion)');

function reduceMotion() {
    return document.body.classList.contains('reduce-motion');
}

function setBodyClass() {
    if (mediaQuery.matches || ConfigData.get('animations') === 'reduced') {
        document.body.classList.add('reduce-motion');
    } else {
        document.body.classList.remove('reduce-motion');
    }
}

document.addEventListener('ConfigUpdated', setBodyClass);
mediaQuery.addEventListener('change', setBodyClass);
setBodyClass();

export function fadeIn({element, delay, direction, duration, fill}) {
    return element.animate({
        opacity: [0, 1],
    }, {
        delay: reduceMotion() ? 0 : delay,
        direction,
        duration: reduceMotion() ? 1 : duration,
        easing: 'ease-in-out',
        fill,
    }).finished;
}

export function fadeOut(params) {
    return fadeIn({direction: 'reverse', ...params});
}

export function peelOut({element, translation, delay, direction, duration, fill}) {
    return element.animate({
        translate: [0, translation],
    }, {
        delay: reduceMotion() ? 0 : delay,
        direction,
        duration: reduceMotion() ? 1 : duration,
        easing: 'cubic-bezier(0.5, 0, 0.5, -0.5)',
        fill,
    }).finished;
}

export function peelOutLeft(params) {
    return peelOut({translation: '-100vw 0', ...params});
}

export function peelOutRight(params) {
    return peelOut({translation: '100vw 0', ...params});
}

export function popIn({element, delay, direction, duration, fill}) {
    return element.animate({
        opacity: [0, 1],
        scale: [0.5, 1],
    }, {
        delay: reduceMotion() ? 0 : delay,
        direction,
        duration: reduceMotion() ? 1 : duration,
        easing: 'ease-in-out',
        fill,
    }).finished;
}

export function popOut(params) {
    return popIn({direction: 'reverse', ...params});
}

export function shiftDown({element, delay, direction, duration, fill}) {
    return element.animate({
        marginTop: [`-${element.scrollHeight}px`, 0],
    }, {
        delay: reduceMotion() ? 0 : delay,
        direction,
        duration: reduceMotion() ? 1 : duration,
        easing: 'ease-in-out',
        fill,
    }).finished;
}

export function shiftUp(params) {
    return shiftDown({direction: 'reverse', ...params});
}

export function slideOpen({element, delay, direction, duration, fill}) {
    return element.animate({
        height: [0, `${element.scrollHeight}px`],
    }, {
        delay: reduceMotion() ? 0 : delay,
        direction,
        duration: reduceMotion() ? 1 : duration,
        easing: 'ease-in-out',
        fill,
    }).finished;
}

export function slideClose(params) {
    return slideOpen({direction: 'reverse', ...params});
}
