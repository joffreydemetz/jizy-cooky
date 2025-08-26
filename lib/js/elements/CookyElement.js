// const Config = require('../config.js').default;
// const Element = require('../element.js').default;

import Config from '../Config.js';
import Element from '../Element.js';

export default class CookyElement extends Element {
    constructor() {
        super('cooky');
    }

    build() {
        this.element = document.createElement('div');
        this.element.id = this.id;
        this.element.dataset.cookyPosition = 'bottom';
        document.body.appendChild(this.element);

        this.element.appendChild(this.createAdBlocker());
        this.element.appendChild(this.createPrivacy());

        if (Config.get('noAdBlocker') && Config.get('adBlocker')) {
            this.applyOnEach(this.element, ".ad-blocker", (el) => el.style.display = 'block');
            this.applyOnEach(this.element, ".privacy", (el) => el.style.display = 'none');
            document.body.classList.add("cooky-needs-consent");
        } else {
            this.applyOnEach(this.element, ".ad-blocker", (el) => el.style.display = 'none');
            this.applyOnEach(this.element, ".privacy", (el) => el.style.display = 'block');
        }
    }

    ready() {
        this.applyOnEach(this.element, ".ad-blocker .reload-adblocker", (el) => {
            el.addEventListener("click", (e) => {
                e.preventDefault();
                window.location.reload();
            });
        });

        this.applyOnEach(this.element, ".cooky-dontcare", (el) => {
            el.addEventListener("click", (e) => {
                e.preventDefault();
                const event = new CustomEvent("cooky.respond.all", { detail: { accept: false, timeout: 1000 } });
                document.dispatchEvent(event);
            });
        });

        this.applyOnEach(this.element, ".cooky-allow-all", (el) => {
            el.addEventListener("click", (e) => {
                e.preventDefault();
                const event = new CustomEvent("cooky.respond.all", { detail: { accept: true, timeout: 1000 } });
                document.dispatchEvent(event);
            });
        });

        this.applyOnEach(this.element, ".cooky-deny-all", (el) => {
            el.addEventListener("click", (e) => {
                e.preventDefault();
                const event = new CustomEvent("cooky.respond.all", { detail: { accept: false, timeout: 1000 } });
                document.dispatchEvent(event);
            });
        });

        this.applyOnEach(this.element, ".cooky-modal", (el) => {
            el.addEventListener("click", (e) => {
                e.preventDefault();
                const event = new CustomEvent("cooky.show", { detail: { from: 'alert' } });
                document.dispatchEvent(event);
            });
        });
    }

    createAdBlocker() {
        const adBlocker = document.createElement('div');
        adBlocker.classList.add('ad-blocker');

        const p1 = document.createElement('p');
        p1.setAttribute('data-cooky-i18n', 'adblock.enabled');
        adBlocker.appendChild(p1);

        const p2 = document.createElement('p');
        p2.setAttribute('data-cooky-i18n', 'adblock.call');
        p2.style.fontWeight = 'bold';
        adBlocker.appendChild(p2);

        const button = document.createElement('button');
        button.classList.add('c-btn', 'c-big', 'c-icon', 'c-green', 'reload-adblocker');
        button.innerHTML = '<span class="cooky-icon-refresh"></span>'
            + '<span data-cooky-i18n="adblock.reload"></span>';
        adBlocker.appendChild(button);

        return adBlocker;
    }

    createPrivacy() {
        const privacy = document.createElement('div');
        privacy.classList.add('privacy');

        if (Config.get('dontcare')) {
            const a = document.createElement('a');
            a.href = '#';
            a.classList.add('cooky-dontcare');
            a.innerHTML = '<span data-cooky-i18n="alert.dontcare"></span><span class="cooky-icon-arrow"></span>';
            privacy.appendChild(a);
        }

        const p1 = document.createElement('p');
        p1.setAttribute('data-cooky-i18n', 'alert.privacy');
        privacy.appendChild(p1);

        const p2 = document.createElement('p');
        p2.innerHTML = '<small data-cooky-i18n="alert.desc"></small>';
        privacy.appendChild(p2);

        const divButtons = document.createElement('div');
        divButtons.classList.add('c-buttons');
        privacy.appendChild(divButtons);

        const button1 = document.createElement('button');
        button1.classList.add('c-btn', 'c-big', 'c-gray', 'cooky-modal');
        button1.innerHTML = '<span data-cooky-i18n="alert.personalize"></span>';
        divButtons.appendChild(button1);

        const button2 = document.createElement('button');
        button2.classList.add('c-btn', 'c-big', 'c-green', 'cooky-allow-all');
        button2.innerHTML = '<span data-cooky-i18n="alert.acceptall"></span>';
        divButtons.appendChild(button2);

        if (Config.get('refuseAll')) {
            const button3 = document.createElement('button');
            button3.classList.add('c-btn', 'c-big', 'c-red', 'cooky-refuse-all');
            button3.innerHTML = '<span data-cooky-i18n="alert.refuseall"></span>';
            divButtons.appendChild(button3);
        }

        return privacy;
    }
}
