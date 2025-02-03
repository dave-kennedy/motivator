const mediaQuery = matchMedia('(prefers-reduced-motion)');

function reduceMotion() {
    return mediaQuery.matches;
}

export function fade({element, direction, delay, duration}) {
    return element.animate({
        opacity: direction === 'in' ? [0, 1] : [1, 0],
    }, {
        delay: reduceMotion() ? 0 : delay,
        duration: reduceMotion() ? 1 : duration,
        easing: 'ease',
        fill: 'forwards',
    }).finished;
}

export function grow({element, dimension, delay, duration}) {
    const keyframes = dimension === 'height'
        ? {height: [0, `${element.scrollHeight}px`]}
        : {width: [0, `${element.scrollWidth}px`]};

    return element.animate(keyframes, {
        delay: reduceMotion() ? 0 : delay,
        duration: reduceMotion() ? 1 : duration,
        easing: 'ease',
        fill: 'forwards',
    }).finished;
}

export function peelOut({element, direction, delay, duration}) {
    return element.animate({
        translate: [0, direction === 'left' ? '-100vw 0' : '100vw 0'],
    }, {
        delay: reduceMotion() ? 0 : delay,
        duration: reduceMotion() ? 1 : duration,
        easing: 'cubic-bezier(0.5, 0, 0.5, -0.5)',
        fill: 'forwards',
    }).finished;
}

export function shrink({element, dimension, delay, duration}) {
    const keyframes = dimension === 'height'
        ? {height: [`${element.scrollHeight}px`, 0]}
        : {width: [`${element.scrollWidth}px`, 0]};

    return element.animate(keyframes, {
        delay: reduceMotion() ? 0 : delay,
        duration: reduceMotion() ? 1 : duration,
        easing: 'ease',
        fill: 'forwards',
    }).finished;
}
