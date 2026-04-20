import Config from '../Config.js';
import Element from '../Element.js';
import Core from '../Core.js';

let tOutMessage = null;

export default class ModalElement extends Element {
    constructor() {
        super('cookyModal');

        let backdrop = document.querySelector("#cookyModalBackdrop");
        if (!backdrop) {
            backdrop = document.createElement('div');
            backdrop.id = 'cookyModalBackdrop';
            document.body.appendChild(backdrop);
        }

        let languages = this.element.querySelector(".c-languages");
        if (!languages) {
            console.error(".c-languages not found in modal");
            return null;
        }

        let services = this.element.querySelector("#cooky-services");
        if (!services) {
            console.error("#cooky-services not found in modal");
            return null;
        }

        let message = this.element.querySelector(".c-message");
        if (!message) {
            console.error(".c-message not found in modal");
            return null;
        }
    }

    build() {
        this.element = document.createElement('div');
        this.element.id = this.id;
        this.element.setAttribute('role', 'dialog');
        //this.element.setAttribute('inert', ''); // Make the modal inert to screen readers);
        //this.element.setAttribute('aria-hidden', 'true'); // Hide the modal from screen readers
        //this.element.setAttribute('aria-labelledby', 'cookyModalLabel'); // Associate with the title
        //this.element.setAttribute('tabindex', '-1'); // Make the modal focusable
        document.body.appendChild(this.element);

        this.element.appendChild(this.createInner());
    }

    ready() {
        // select default language in the modal
        const activeLanguage = this.element.querySelector(".c-languages button[data-cooky-language='" + Config.get('language') + "']");
        if (activeLanguage) activeLanguage.classList.add("active");

        // initialize the service buttons with current status
        this.updateServicesState();

        // initialize string translation
        this.translate();

        this.element.addEventListener("keyup", (e) => {
            if (e.key === 'Escape' || e.key === 'Esc' || e.keyCode === 27) {
                const event = new CustomEvent("cooky.hide", { detail: { from: 'keyboard' } });
                document.dispatchEvent(event);
            }
        });

        this.applyOnEach(this.element, ".c-languages button[data-cooky-language]", (el) => {
            el.addEventListener("click", (e) => {
                e.preventDefault();

                if (el.classList.contains("active")) return;

                this.applyOnEach(this.element, ".c-languages button[data-cooky-language].active", (el) => {
                    el.classList.remove("active");
                });

                el.classList.add("active");

                const code = el.dataset.cookyLanguage;
                const event = new CustomEvent("cooky.translate", { detail: { code: code } });
                document.dispatchEvent(event);
            });
        });

        this.applyOnEach(this.element, "header button", (el) => {
            el.addEventListener("click", (e) => {
                e.preventDefault();
                const event = new CustomEvent("cooky.hide", { detail: { from: 'cross' } });
                document.dispatchEvent(event);
            });
        });

        this.applyOnEach(this.element, ".cooky-allow-all", (el) => {
            el.addEventListener("click", (e) => {
                e.preventDefault();
                const event = new CustomEvent("cooky.respond.all", { detail: { accept: true, timeout: 2000 } });
                document.dispatchEvent(event);
            });
        });

        this.applyOnEach(this.element, ".cooky-deny-all", (el) => {
            el.addEventListener("click", (e) => {
                e.preventDefault();
                const event = new CustomEvent("cooky.respond.all", { detail: { accept: false, timeout: 2000 } });
                document.dispatchEvent(event);
            });
        });

        this.applyOnEach(this.element, ".cooky-allow", (el) => {
            el.addEventListener("click", (e) => {
                e.preventDefault();
                const serviceId = el.dataset.cookyService;
                if (!serviceId) return;
                const event = new CustomEvent("cooky.respond.one", { detail: { accept: true, serviceId: serviceId, timeout: 2000 } });
                document.dispatchEvent(event);
            });
        });

        this.applyOnEach(this.element, ".cooky-deny", (el) => {
            el.addEventListener("click", (e) => {
                e.preventDefault();
                const serviceId = el.dataset.cookyService;
                if (!serviceId) return;
                const event = new CustomEvent("cooky.respond.one", { detail: { accept: false, serviceId: serviceId, timeout: 2000 } });
                document.dispatchEvent(event);
            });
        });

        this.applyOnEach(this.element, ".c-read-more-toggler", (el) => {
            el.addEventListener("click", (e) => {
                e.preventDefault();
                // @todo add .hidden class in css
                // @todo cookyI18n should be togglable
                const $cookyR = el.closest(".cooky-r");
                if (!$cookyR) return;
                const readmoreBox = $cookyR.querySelector(".c-read-more");
                if (readmoreBox.classList.contains("in")) {
                    readmoreBox.style.maxHeight = '0'; // Collapse the box
                    readmoreBox.classList.remove("in");

                    el.classList.remove("active");
                } else {
                    readmoreBox.classList.add("in");
                    readmoreBox.style.maxHeight = readmoreBox.scrollHeight + 'px'; // Expand to fit content

                    el.classList.add("active");
                }
            });
        });
    }

    updateAcceptAllVisibility() {
        const withButtons = this.element.querySelector(".cooky-accept-all");
        const noApproval  = this.element.querySelector(".cooky-no-approval");
        if (!withButtons || !noApproval) return;

        if (Core.total === 0) {
            withButtons.style.display = 'none';
            noApproval.style.display  = '';
        } else {
            withButtons.style.display = '';
            noApproval.style.display  = 'none';
        }
    }

    updateServicesState() {
        this.element.querySelectorAll(".cooky-deny-all").forEach((el) => {
            if (Core.denied === Core.total) {
                el.classList.add("active");
            } else {
                el.classList.remove("active");
            }
        });

        this.element.querySelectorAll(".cooky-allow-all").forEach((el) => {
            if (Core.allowed === Core.total) {
                el.classList.add("active");
            } else {
                el.classList.remove("active");
            }
        });

        if (!Core.serviceStore) return;
        if (Object.keys(Core.serviceStore).length === 0) return;

        const $denys = Array.from(this.element.querySelectorAll(".cooky-deny"));
        const $allows = Array.from(this.element.querySelectorAll(".cooky-allow"));

        Object.keys(Core.serviceStore).forEach((id) => {
            const $deny = $denys.find((el) => el.dataset.cookyService === id);
            const $allow = $allows.find((el) => el.dataset.cookyService === id);
            if (!$deny && !$allow) return;

            if (Core.serviceStore[id].denied) {
                $deny?.classList.add("active");
                $allow?.classList.remove("active");
            } else if (Core.serviceStore[id].allowed) {
                $deny?.classList.remove("active");
                $allow?.classList.add("active");
            } else {
                $deny?.classList.remove("active");
                $allow?.classList.remove("active");
            }
        });
    }

    displayMessage() {
        const el = this.element.querySelector(".c-message");
        if (!el) return;

        if (tOutMessage) {
            clearTimeout(tOutMessage);
        }

        if (el.classList.contains("in")) {
            tOutMessage = setTimeout(() => {
                clearTimeout(tOutMessage);
                el.classList.remove("in");
            }, 3000);

            return;
        }

        tOutMessage = setTimeout(() => {
            clearTimeout(tOutMessage);
            el.classList.remove("in");
        }, 2000);

        el.classList.add("in");
    }

    /**
     * Append language flags to .c-languages containers
     */
    displayLanguages() {
        let html = '';
        Object.keys(Core.languageStore).forEach((code) => {
            html += Core.languageStore[code].render();
        });

        this.applyOnEach(this.element, ".c-languages", (el) => {
            el.innerHTML = html;

            // Add aria-label to each language button
            el.querySelectorAll('button[data-cooky-language]').forEach((button) => {
                const language = button.dataset.cookyLanguage;
                button.setAttribute('aria-label', `Select language: ${language}`);
            });
        });
    }

    /**
     * Append services to the modal
     */
    displayServices() {
        let html = '';
        Object.keys(Core.categoryStore).forEach((category) => {
            html += Core.categoryStore[category].render();
        });
        this.element.querySelector("#cooky-services").innerHTML = html;
    }

    createInner() {
        const inner = document.createElement('div');
        inner.classList.add('cm-inner');

        inner.appendChild(this.createHeader());

        const section = document.createElement('section');
        section.appendChild(this.createLanguages());
        section.appendChild(this.createDisclaimer());
        section.appendChild(document.createElement('hr'));
        section.appendChild(this.createMessage());
        section.appendChild(this.createAcceptAll());
        section.appendChild(this.createServices());

        inner.appendChild(section);

        return inner;
    }

    createHeader() {
        const header = document.createElement('header');

        const title = document.createElement('p');
        title.classList.add('L1');
        title.id = 'cookyModalLabel';
        title.setAttribute('data-cooky-i18n', 'main.title');
        header.appendChild(title);

        const button = document.createElement('button');
        button.type = 'button';
        button.setAttribute('data-cooky-i18n-title', 'main.close');
        button.setAttribute('aria-label', 'Close');
        button.innerHTML = '<span aria-hidden="true" class="cooky-icon-times"></span>';
        header.appendChild(button);

        return header;
    }

    createLanguages() {
        const languages = document.createElement('div');
        languages.classList.add('c-languages');
        return languages;
    }

    createDisclaimer() {
        const disclaimer = document.createElement('p');
        disclaimer.classList.add('disclaimer');
        disclaimer.setAttribute('data-cooky-i18n', 'main.disclaimer');
        return disclaimer;
    }

    createMessage() {
        const message = document.createElement('div');
        message.classList.add('c-message');
        message.innerHTML = '<p data-cooky-i18n="alert.updated"></p>';
        return message;
    }

    createAcceptAll() {
        const acceptAll = document.createElement('div');
        acceptAll.classList.add('cooky-d');

        const withButtons = document.createElement('div');
        withButtons.classList.add('cooky-accept-all');

        const title = document.createElement('p');
        title.classList.add('L2');
        title.setAttribute('data-cooky-i18n', 'main.acceptAll');
        withButtons.appendChild(title);

        const buttons = document.createElement('div');
        buttons.classList.add('c-buttons');
        buttons.appendChild(this.createAllowAllButton());
        buttons.appendChild(this.createDenyAllButton());
        withButtons.appendChild(buttons);

        acceptAll.appendChild(withButtons);

        const noApproval = document.createElement('p');
        noApproval.classList.add('cooky-no-approval', 'L2');
        noApproval.setAttribute('data-cooky-i18n', 'main.noServicesApproval');
        acceptAll.appendChild(noApproval);

        return acceptAll;
    }

    createAllowAllButton() {
        const button = document.createElement('button');
        button.classList.add('c-btn', 'c-big', 'c-green', 'cooky-allow-all');
        button.setAttribute('data-cooky-i18n', 'service.allow');
        button.setAttribute('aria-label', 'Allow all cookies'); // Add accessible label
        return button;
    }

    createDenyAllButton() {
        const button = document.createElement('button');
        button.classList.add('c-btn', 'c-big', 'c-red', 'cooky-deny-all');
        button.setAttribute('data-cooky-i18n', 'service.deny');
        button.setAttribute('aria-label', 'Deny all cookies'); // Add accessible label
        return button;
    }

    createServices() {
        const services = document.createElement('div');
        services.id = 'cooky-services';
        return services;
    }
}
