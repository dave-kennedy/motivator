import Button from './Button.js';
import ConfigData from './data/ConfigData.js';
import CustomElement from './CustomElement.js';
import GoalsData from './data/GoalsData.js';
import Input from './Input.js';
import RewardsData from './data/RewardsData.js';

import {fadeIn, fadeOut} from './animation.js';

const stylesheet = new CSSStyleSheet();

stylesheet.replace(`intro-component {
    background-color: #000;
    transition: background-color 1s;

    position: fixed;
    inset: 0;
    z-index: 10;
}

intro-component .content {
    background-color: rgba(0, 0, 0, 0.5);
    border-radius: 1em;
    box-sizing: border-box;
    color: #fff;
    line-height: 1.5;
    margin: auto;
    overflow: auto;
    padding: 1em;
    text-align: center;

    height: fit-content;
    width: fit-content;
    max-height: calc(100% - 2em);
    max-width: calc(100% - 2em);

    display: flex;
    flex-direction: column;
    gap: 1em;

    position: absolute;
    inset: 0;
}

@media (min-width: 352px) {
    intro-component .content {
        max-width: 20em;
    }
}

intro-component .footer {
    display: flex;
    align-items: center;
    gap: 1em;
}

intro-component .footer > :first-child {
    flex: 1;
    text-align: left;
}

intro-component .footer > :nth-child(2) {
    flex: 1;
    text-align: center;
}

intro-component .footer > :last-child {
    flex: 1;
    text-align: right;
}

intro-component svg {
    height: 100%;
    width: 100%;
}

intro-component [id|=sky] {
    opacity: 0;
    transition: opacity 1s;
}

intro-component #stars {
    scale: 0.4;
    translate: 0 -30%;
    transform-origin: center;

    opacity: 1;
    rotate: -10deg;
    transition: opacity 1s, rotate 1s;
}

intro-component :is(#moon, #sun) {
    scale: 0.4;
    translate: 0 100%;
    transform-origin: center;
    transition: translate 1s;
}

intro-component [id|=clouds] {
    opacity: 0;
    scale: 0.4;
    translate: -1% 30%;
    transform-origin: center;
    transition: fill 1s, opacity 1s, translate 1s;
}

intro-component #clouds-1 {
    mix-blend-mode: overlay;
}

intro-component #mountains {
    scale: 0.4;
    translate: 0 30%;
    transform-origin: center;

    filter: brightness(0);
    transition: filter 1s;
}

/* Scene 1 */

intro-component.scene-1 #sky-1 {
    opacity: 1;
}

intro-component.scene-1 #stars {
    opacity: 0.75;
    rotate: -5deg;
}

intro-component.scene-1 #moon {
    translate: 0 30%;
}

intro-component.scene-1 #clouds-1 {
    opacity: 1;
    translate: 0 30%;
}

/* Scene 2 */

intro-component.scene-2 {
    background-color: #333;
}

intro-component.scene-2 :is(#sky-1, #sky-2) {
    opacity: 1;
}

intro-component.scene-2 #stars {
    opacity: 0.5;
    rotate: 0deg;
}

intro-component.scene-2 #moon {
    translate: 0 -40%;
}

intro-component.scene-2 #clouds-1 {
    translate: 1% 30%;
}

intro-component.scene-2 #clouds-2 {
    opacity: 1;
    translate: 0 30%;
}

intro-component.scene-2 #mountains {
    filter: brightness(0.2);
}

/* Scene 3 */

intro-component.scene-3 {
    background-color: #666;
}

intro-component.scene-3 :is(#sky-2, #sky-3) {
    opacity: 1;
}

intro-component.scene-3 #stars {
    opacity: 0.25;
    rotate: 5deg;
}

intro-component.scene-3 #moon {
    translate: 0 -100%;
}

intro-component.scene-3 #sun {
    translate: 0 30%;
}

intro-component.scene-3 #clouds-2 {
    translate: 1% 30%;
}

intro-component.scene-3 #clouds-3 {
    opacity: 1;
    translate: 0 30%;
}

intro-component.scene-3 #mountains {
    filter: brightness(0.4);
}

/* Scene 4 */

intro-component.scene-4 {
    background-color: #fff;
}

intro-component.scene-4 :is(#sky-3, #sky-4) {
    opacity: 1;
}

intro-component.scene-4 #stars {
    opacity: 0;
    rotate: 10deg;
}

intro-component.scene-4 #moon {
    translate: 0 -100%;
}

intro-component.scene-4 #sun {
    translate: 0 -50%;
}

intro-component.scene-4 #clouds-3 {
    translate: 1% 30%;
}

intro-component.scene-4 #clouds-4 {
    opacity: 1;
    translate: 0 30%;
}

intro-component.scene-4 #mountains {
    filter: brightness(1);
}`);

export default class Intro extends CustomElement {
    #data = {};

    #scenes = [{
        content: [
            `Let's start by creating a goal.`,
            `It can be anything from saving a dollar to climbing a mountain.`,
            `Dreading a big task? Start with just a small part of it.`,
        ],
        input: {
            id: 'goal-name-input',
            label: 'Name your goal',
            type: 'text',
        },
    }, {
        content: [
            `When you complete a goal, its points are added to your total.`,
            `Points can be used to redeem rewards. We'll create one of those next.`,
        ],
        input: {
            id: 'goal-points-input',
            label: 'How many points is this goal worth?',
            min: 0,
            type: 'number',
        },
    }, {
        content: [
            `Now, let's create a reward.`,
            `It can be anything from a piece of candy to a day off from work.`,
            `It's easier to do good when you feel good, so keep it fun and practical.`,
        ],
        input: {
            id: 'reward-name-input',
            label: 'Name your reward',
            type: 'text',
        },
    }, {
        content: [
            `When you redeem a reward, its points are subtracted from your total.`,
            `Make sure to spend your points, not hoard them. Positive reinforcement is key to
                building or changing habits.`,
        ],
        input: {
            id: 'reward-points-input',
            label: 'How many points is this reward worth?',
            min: 0,
            type: 'number',
        },
    }];

    connectedCallback() {
        this.#render();
    }

    #render() {
        this.applyStylesheet(stylesheet);

        const $svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        $svg.setAttribute('viewBox', '0 0 4e3 700');
        $svg.setAttribute('preserveAspectRatio', 'xMidYMid slice');

        $svg.innerHTML = `<defs>
                <linearGradient id="linearGradient1" x2="0" y2="100%">
                    <stop offset="0"/>
                    <stop stop-color="#306" offset="1"/>
                </linearGradient>
                <linearGradient id="linearGradient2" x2="0" y2="100%">
                    <stop stop-color="#306" offset="0"/>
                    <stop stop-color="#96c" offset=".5"/>
                    <stop stop-color="#f60" offset="1"/>
                </linearGradient>
                <linearGradient id="linearGradient3" x2="0" y2="100%">
                    <stop stop-color="#036" offset="0"/>
                    <stop stop-color="#69c" offset=".5"/>
                    <stop stop-color="#fc6" offset="1"/>
                </linearGradient>
                <linearGradient id="linearGradient4" x2="0" y2="100%">
                    <stop stop-color="#06c" offset="0"/>
                    <stop stop-color="#9cf" offset="1"/>
                </linearGradient>
                <linearGradient id="linearGradient5" x2="0" y2="100%">
                    <stop stop-color="#609" offset=".3"/>
                    <stop stop-color="#f66" offset=".7"/>
                    <stop stop-color="#ff9" offset=".9"/>
                </linearGradient>
                <linearGradient id="linearGradient6" x2="0" y2="100%">
                    <stop stop-color="#654" offset=".3"/>
                    <stop stop-color="#c96" offset=".7"/>
                    <stop stop-color="#ff9" offset=".9"/>
                </linearGradient>
                <linearGradient id="linearGradient7" x2="0" y2="100%">
                    <stop stop-color="#fff" offset="0"/>
                    <stop stop-color="#fff" stop-opacity="0" offset="1"/>
                </linearGradient>
                <pattern id="pattern1" width="2e3" height="400" patternUnits="userSpaceOnUse">
                    <circle cx="2" cy="347" r="3" fill="#fff"/>
                    <circle cx="41" cy="203" r="2" fill="#fff"/>
                    <circle cx="76" cy="357" r="2" fill="#fff"/>
                    <circle cx="162" cy="155" r="3" fill="#fdd"/>
                    <circle cx="195" cy="240" r="3" fill="#fff"/>
                    <circle cx="268" cy="187" r="2" fill="#fff"/>
                    <circle cx="286" cy="38" r="2" fill="#fff"/>
                    <circle cx="332" cy="360" r="2" fill="#ffd"/>
                    <circle cx="347" cy="285" r="3" fill="#fff"/>
                    <circle cx="350" cy="21" r="2" fill="#fff"/>
                    <circle cx="404" cy="172" r="2" fill="#fff"/>
                    <circle cx="419" cy="32" r="2" fill="#ddf"/>
                    <circle cx="493" cy="146" r="3" fill="#fff"/>
                    <circle cx="516" cy="351" r="2" fill="#fff"/>
                    <circle cx="529" cy="111" r="2" fill="#fff"/>
                    <circle cx="558" cy="201" r="2" fill="#fdd"/>
                    <circle cx="897" cy="394" r="3" fill="#fff"/>
                    <circle cx="923" cy="56" r="2" fill="#fff"/>
                    <circle cx="926" cy="313" r="2" fill="#fff"/>
                    <circle cx="936" cy="295" r="3" fill="#ffd"/>
                    <circle cx="983" cy="3" r="3" fill="#fff"/>
                    <circle cx="1028" cy="215" r="2" fill="#fff"/>
                    <circle cx="1149" cy="138" r="2" fill="#fff"/>
                    <circle cx="1149" cy="29" r="2" fill="#ddf"/>
                    <circle cx="1315" cy="275" r="3" fill="#fff"/>
                    <circle cx="1328" cy="95" r="2" fill="#fff"/>
                    <circle cx="1370" cy="321" r="2" fill="#fff"/>
                    <circle cx="1475" cy="43" r="2" fill="#fdd"/>
                    <circle cx="1503" cy="239" r="3" fill="#fff"/>
                    <circle cx="1633" cy="184" r="2" fill="#fff"/>
                    <circle cx="1713" cy="384" r="2" fill="#fff"/>
                    <circle cx="1759" cy="358" r="2" fill="#ffd"/>
                    <circle cx="1762" cy="117" r="3" fill="#fff"/>
                    <circle cx="1809" cy="20" r="2" fill="#fff"/>
                    <circle cx="1855" cy="119" r="2" fill="#fff"/>
                    <circle cx="1855" cy="161" r="3" fill="#ddf"/>
                </pattern>
                <radialGradient id="radialGradient1">
                    <stop stop-color="#ffd" offset="0"/>
                    <stop stop-color="#ffd" stop-opacity="0" offset="1"/>
                </radialGradient>
            </defs>
            <rect id="sky-1" width="4e3" height="700" fill="url(#linearGradient1)"/>
            <rect id="sky-2" width="4e3" height="700" fill="url(#linearGradient2)"/>
            <rect id="sky-3" width="4e3" height="700" fill="url(#linearGradient3)"/>
            <rect id="sky-4" width="4e3" height="700" fill="url(#linearGradient4)"/>
            <rect id="stars" width="4e3" height="440" fill="url(#pattern1)"/>
            <g id="moon">
                <circle cx="1700" cy="300" r="200" fill="url(#radialGradient1)" opacity=".25"/>
                <path d="m1710 270c-13 4-22 16-22 30s9 26 22 30c13-4 22-16 22-30s-9-26-22-30z" fill="#333"/>
                <path d="m1700 268c-18 0-32 14-32 32s14 32 32 32c3 0 7-1 10-2-13-4-22-16-22-30s9-26 22-30c-3-1-7-2-10-2z" fill="#fff"/>
            </g>
            <g id="sun">
                <circle cx="1700" cy="450" r="300" fill="url(#radialGradient1)"/>
                <path d="m1910 660-200-185-10 275-10-275-200 185 185-200-275-10 275-10-185-200 200 185 10-275 10 275 200-185-185 200 275 10-275 10z" fill="url(#radialGradient1)" opacity=".5"/>
                <circle cx="1700" cy="450" r="32" fill="#fff"/>
            </g>
            <g id="clouds-1" fill="#fff">
                <path d="m1440 275a50 5 0 00-50 5 50 5 0 0050 5 50 5 0 0050-5 50 5 0 00-50-5zm-105 25a100 10 0 00-100 10 100 10 0 005 5 300 10 0 00-80 5 300 10 0 00300 10 300 10 0 00300-10 300 10 0 00-300-10 300 10 0 00-25 0 100 10 0 00-100-10zm105 40a200 10 0 00-200 10 200 10 0 00200 10 200 10 0 00200-10 200 10 0 00-200-10zm280 5a50 5 0 00-50 5 50 5 0 0050 5 50 5 0 0050-5 50 5 0 00-50-5zm-250 25a100 10 0 00-100 10 100 10 0 00100 10 100 10 0 00100-10 100 10 0 00-100-10z"/>
                <path d="m2610 295a250 10 0 00-230 5 100 5 0 00-55 0 100 5 0 00-100 5 100 5 0 00100 5 100 5 0 0055 0 250 10 0 00230 5 250 10 0 00250-10 250 10 0 00-250-10zm-165 25a300 10 0 00-300 10 300 10 0 00300 10 300 10 0 00270-5 100 5 0 0055 0 100 5 0 00100-5 100 5 0 00-100-5 100 5 0 00-55 0 300 10 0 00-270-5zm80 30a200 10 0 00-200 10 200 10 0 00200 10 200 10 0 00200-10 200 10 0 00-200-10z"/>
            </g>
            <g id="clouds-2" fill="url(#linearGradient5)">
                <path d="m1440 240c-30-5-90 0-70 30 0 0-220 20-220 50h405s-105 10-105 40h720c0-30-340-40-340-40 15-30-60-40-100-35 10-35-55-40-85-45-70-10-135 15-205 0z"/>
                <path d="m2300 140c-25-20-65-15-40 25-40-10-55 25-5 45-65 0-140 15-140 15 190-15 490 75 715 0 0 0-265 50-265-35 0-40-45-40-100-25-70-90-115-75-110-45-30-25-75-30-55 20z"/>
            </g>
            <g id="clouds-3" fill="url(#linearGradient6)">
                <path d="m1320 60c-130 30 180 150 260 150-80-60 30 0 110 0-80-60 30 0 110 0-80-60-65-155-130-140 5-55-95-70-65-10 5-105-190-180-205-60-60-50-120-10-80 60z"/>
                <path d="m2360 200c-25-15-60-5-70 20-25-25-70-15-80 20-35 135 500 115 565 65-80 10-50-30-125-25-5-10-10-15-25-15 0-40-50-55-70-25-10-30-45-45-75-30-15-55-95-60-120-10z"/>
            </g>
            <g id="clouds-4" fill="url(#linearGradient7)">
                <path d="m2395-295c-85 5-135 100-105 170-30 5-50 30-65 55-70-20-120 75-65 125-105 5-170 20-170 30 0 15 115 25 305 35-40 15-30 45 70 55-130 40 50 60 120 60-65 15-5 50 115 45 195-5 175-55 15-60 25 0 75-25 0-40 125-15 110-50 80-60 345 0 615-20 615-40 0-5-50-20-145-30 20-40-40-85-110-70 5-55-65-110-125-75 5-40-20-100-85-110 90-225-260-385-365-145-40-15-85 5-85 55z"/>
                <path d="m1285-50c-30-15-70-15-95 10-90-105-260-20-245 105-70-40-155 40-110 110-285 15-125 60 120 55-110 60 905 30 665-15 320 5 260-55-20-55 135-115-20-335-175-245-50-70-140-20-140 35z"/>
            </g>
            <g id="mountains">
                <path d="m0 660 45 5 85-45h70l20-30 80-10 20-30h50l35-25 25 35 30 10 25 35 55-45 50-10 30-30h30l40-30 20 10 35-15 115 65h165l60-25 45 15h50l75 35 60-40 20 5 45-45 30 15 35-30 70 40 20-5 35 10 60-60h25l15-20 50-5 40-35 20 5 55-50 20 5 85-90 20 5 40-30 35 35 20 5 20 25 65 45 70 70 25-10 20 25 20-10 45 55 25-25 65 95 90 40 20-15 25 15 25-15 25 10 45-20 20 25 130-95 240 45 30-45 35 5 10 20 10-20 70-5 15 45 20-40 15 10 100-25 55 25 40-15 70 40 80-35 60 30 25-10 25 10 25-25 140 50 145-75v210h-4e3z" fill="#fff"/>
                <path d="m2e3 250 50 150-100 150 50 150h500l-70-60-60-20-90-100-50-10-20-50-210-210zm235 170-25 10 200 130-65-95-25 25-45-55-20 10-20-25zm-790 60-35 30-30-15-45 45-20-5-75 50-10 25-60 40-60-20-105 70h895l-180-120-240-40-35-60zm1195 95-45 20-25-10-25 15-25-15-20 15 160 100h460l-60-30-60 20-20-30h-40l-10 30-20-30-10 10-60 10-80-40h-10l-50-40-30 10-30-35z" fill="#ccc"/>
            </g>`;

        this.appendChild($svg);

        setTimeout(_ => this.#renderScene(0));
    }

    #renderScene(index) {
        if (index === this.#scenes.length) {
            this.#finish();
            return;
        }

        this.className = `scene-${index + 1}`;

        const {content, input} = this.#scenes[index];

        const $content = document.createElement('div');
        $content.className = 'content';
        $content.innerHTML = `<div>${content.join('</div><div>')}</div>`;
        this.appendChild($content);

        const $input = new Input({
            ...input,
            required: true,
            value: this.#data[input.id],
        });

        $input.addEventListener('keydown', event => {
            if (event.key === 'Enter') {
                $nextButton.click();
            }
        });

        $content.appendChild($input);

        const $footer = document.createElement('div');
        $footer.className = 'footer';
        $content.appendChild($footer);

        const $footerLeft = document.createElement('div');
        const $footerMid = document.createElement('div');
        const $footerRight = document.createElement('div');
        $footer.append($footerLeft, $footerMid, $footerRight);

        if (index > 0) {
            const $backButton = new Button({
                icon: {src: 'img/arrow-left.svg'},
                label: 'Back',
                onClick: _ => {
                    $content.remove();
                    this.#renderScene(index - 1);
                },
            });

            $footerLeft.appendChild($backButton);
        }

        $footerMid.textContent = `${index + 1} of ${this.#scenes.length}`;

        const $nextButton = new Button({
            className: 'icon-right',
            icon: {src: 'img/arrow-right.svg'},
            label: 'Next',
            onClick: _ => {
                if (!$input.validate()) {
                    return;
                }

                $content.remove();
                this.#data[input.id] = $input.value;
                this.#renderScene(index + 1);
            },
        });

        $footerRight.appendChild($nextButton);

        fadeIn({element: $content, duration: 500});
    }

    async #finish() {
        ConfigData.set('introFinished', true);

        const goal = {
            id: crypto.randomUUID(),
            name: this.#data['goal-name-input'],
            points: this.#data['goal-points-input'],
            created: Date.now(),
        };

        GoalsData.add(goal);
        this.raiseEvent('GoalCreated', goal);

        const reward = {
            id: crypto.randomUUID(),
            name: this.#data['reward-name-input'],
            points: this.#data['reward-points-input'],
            created: Date.now(),
        };

        RewardsData.add(reward);
        this.raiseEvent('RewardCreated', reward);

        await fadeOut({element: this, duration: 250});
        this.dispatchEvent(new Event('close'));
        this.remove();
    }

    static render() {
        const $intro = new Intro();
        document.querySelector('app-component').appendChild($intro);
        return $intro;
    }
}

customElements.define('intro-component', Intro);
