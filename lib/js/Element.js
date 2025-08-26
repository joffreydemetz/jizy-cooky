import Config from './Config.js';
import Core from './Core.js';

export default class Element {
    constructor(id) {
        this.id = id;

        this.element = document.querySelector(`#${id}`);

        if (!this.element) {
            this.build();

            this.element = document.querySelector(`#${id}`);

            if (!this.element) {
                console.error(`Element ${id} not found and could not be created.`);
                return null;
            }
        }

        this.ready();
    }

    build() {
        // Default build overridden in subclasses
    }

    ready() {
        // Default events overridden in subclasses
    }

    dataConfig() {
        const configObject = {};

        const configAttributes = Array.from(this.element.attributes).filter(attr => attr.name.startsWith('data-cooky-'));

        configAttributes.forEach(attr => {
            const key = attr.name.replace('data-cooky-', '');

            if (key === 'config') {
                try {
                    const config = JSON.parse(attr.value);
                    Object.keys(config).forEach((k) => {
                        if (k !== 'config') {
                            configObject[k] = config[k];
                        }
                    });
                } catch (e) {
                    console.error('Invalid JSON in data-cooky-config:', attr.value, e);
                }
                return;
            }

            configObject[key] = attr.value;
        });

        return configObject;
    }

    translate() {
        const code = Config.get('language', Config.get('defaultLanguage'));
        if (!code) {
            return;
        }

        const i18n = Core.languageStore[code] ?? null;
        if (!i18n) {
            return;
        }

        this.element.querySelectorAll("[data-cooky-i18n]").forEach((el) => {
            const key = el.dataset.cookyI18n;
            const text = i18n.get(key);
            el.innerHTML = text;

            if (el.hasAttribute('aria-label')) {
                el.setAttribute('aria-label', text.replace('/"/', '\"'));
            }
        });

        this.element.querySelectorAll("[data-cooky-i18n-title]").forEach((el) => {
            const key = el.dataset.cookyI18nTitle;
            const text = i18n.get(key).replace('/"/', '\"')
            el.setAttribute('title', text);
            el.setAttribute('aria-label', text);
        });
    }

    applyOnOne(elements, selector, callback) {
        const el = elements.querySelector(selector);
        if (el) {
            callback(el);
        }
    }

    applyOnEach(elements, selector, callback) {
        const children = Array.from(elements.querySelectorAll(selector));
        if (children.length > 0) {
            for (let i = 0; i < children.length; i++) {
                const el = children[i];
                callback(el);
            }
        }
    }

    show() {
        //document.body.setAttribute('aria-hidden', 'true'); // Hide background content
        //this.element.style.display = 'block';
        //this.element.removeAttribute('aria-hidden');
        //this.element.setAttribute('inert', ''); // Add inert to the modal
        this.element.focus();

        this.trapFocus();
    }

    hide() {
        //document.body.removeAttribute('aria-hidden'); // Restore background content
        //this.element.style.display = 'none';
        //this.element.setAttribute('aria-hidden', 'true');
        //this.element.removeAttribute('inert'); // Remove inert from the modal

        if (this.triggerElement) {
            this.triggerElement.focus();
        }
    }

    trapFocus() {
        const focusableElements = this.element.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        this.element.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                if (e.shiftKey) {
                    // Shift + Tab
                    if (document.activeElement === firstElement) {
                        e.preventDefault();
                        lastElement.focus();
                    }
                } else {
                    // Tab
                    if (document.activeElement === lastElement) {
                        e.preventDefault();
                        firstElement.focus();
                    }
                }
            }
        });
    }
};
