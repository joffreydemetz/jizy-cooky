import { COOKY_NAME, COOKY_VERSION } from './Constants.js';
import Core from './Core.js';
import CookyCookie from './CookyCookie.js';
import CookyElement from './elements/CookyElement.js';
import ModalElement from './elements/ModalElement.js';

const Cooky = {
    getName: () => COOKY_NAME,
    getVersion: () => COOKY_VERSION,
    isLoaded: () => Core.loaded,

    addCategory: (category) => Core.addCategory(category),
    addLanguage: (language) => Core.addLanguage(language),
    addService: (service) => Core.addService(service),
    addPlugin: (serviceId, plugin) => Core.addPlugin(serviceId, plugin),

    addTranslations: (id, translations) => Core.addTranslations(id, translations),
    appendTranslations: (translations) => Core.appendTranslations(translations),
    appendServiceData: (id, data) => Core.appendServiceData(id, data),

    appendServiceCookies(serviceId, cookies) {
        if (typeof Core.serviceStore[serviceId] === 'undefined') return;
        Core.serviceStore[serviceId].setCookies(cookies);
    },

    updateServiceCookie(serviceId, name, key, value) {
        if (typeof Core.serviceStore[serviceId] === 'undefined') return;
        const cookie = { name: name };
        cookie[key] = value;
        Core.serviceStore[serviceId].setCookies([cookie]);
    },

    reloadThePage: false,

    // $cooky is the main element that contains the disclaimer and the ad-blocker message
    // it is hidden by default.
    // it is shown only if the user has not responded yet.
    $cooky: null,

    // $modal is the modal that contains the services and languages
    $modal: null,

    /**
     * Run the Cooky library.
     * @param {object} config - The configuration object.
     * @param {boolean} force - Assume DOM is ready and run the library (used for testing).
     */
    run(config = null) {
        //console.log('|-> run()');
        if (Core.loaded) return;
        if (config) Cooky.config(config);
        Cooky.check();
        document.addEventListener("DOMContentLoaded", () => {
            Cooky.ready();
        });
        Core.loaded = true;
    },

    config(config = null) {
        if (Core.loaded) return;
        Core.updateConfig(config);
    },

    check() {
        if (Core.loaded) return;
        Core.check();
    },

    ready() {
        if (Core.loaded) return;

        Cooky.$cooky = new CookyElement();
        if (!Cooky.$cooky) return;

        Cooky.$modal = new ModalElement();
        if (!Cooky.$modal) return;

        // check navigator language and set default language
        Core.checkNavigatorLanguage();

        // get the config from the data-cooky-attributes
        Cooky.loadConfigFromDOM();

        // load default language
        Core.loadDefaultLanguage();

        // load current services status from the cookie
        CookyCookie.load();

        // exec services
        Object.keys(Core.serviceStore).forEach((id) => {
            Core.serviceStore[id].exec();
        });

        Core.updateState();

        if (Core.pending > 0) {
            document.body.classList.add("cooky-needs-consent");
        }

        Cooky.$modal.displayLanguages();
        Cooky.$modal.displayServices();
        Cooky.$modal.updateAcceptAllVisibility();

        Cooky.translate();

        this.initEventListeners();

        Cooky.$cooky.ready();
        Cooky.$modal.ready();

        Core.loaded = true;
    },

    loadConfigFromDOM() {
        const dataConfig = Cooky?.$cooky.dataConfig();
        Core.updateConfig(dataConfig);
    },

    translate() {
        Cooky.$cooky.translate();
        Cooky.$modal.translate();
    },

    show() {
        document.body.classList.add("cm-open");
        document.body.classList.remove("cooky-needs-consent");
        this.$modal.show();
    },

    hide() {
        if (Cooky.reloadThePage === true) {
            window.location.reload();
            return;
        }

        document.body.classList.remove("cm-open");
        this.$modal.hide();

        if (Core.pending > 0) {
            document.body.classList.add("cooky-needs-consent");
        }
    },

    initEventListeners() {
        document.addEventListener("cooky.show", (event) => {
            const { from } = event.detail; // from = "menu", "alert"
            Cooky.show();
        });

        document.addEventListener("cooky.hide", (event) => {
            const { from } = event.detail; // from = "keyboard", "cross"
            Cooky.hide();
        });

        document.addEventListener("cooky.translate", (event) => {
            const { code } = event.detail;
            // console.log(`translate event triggered. language: ${code}`);

            if (typeof Core.languageStore[code] === 'undefined') return;
            Core.updateConfig({
                'language': code,
                'locale': Core.languageStore[code].getLocale()
            });
            Cooky.translate(code);
        });

        document.addEventListener("cooky.respond.all", (event) => {
            const { accept, timeout } = event.detail;
            if (!timeout) timeout = 1000;
            //console.log(`respond.all event triggered. status: ${accept}`);
            if (typeof accept !== 'boolean') return;
            Cooky.respondAll(accept);
            setTimeout(() => window.location.reload(), timeout);
        });

        document.addEventListener("cooky.respond.one", (event) => {
            const { accept, serviceId, timeout } = event.detail;
            if (!timeout) timeout = 1000;
            //console.log(`respond.one event triggered. service: ${serviceId} status: ${accept}`);
            if (typeof accept !== 'boolean') return;
            if (typeof serviceId !== 'string') return;
            Cooky.respond(serviceId, accept);
            //setTimeout(() => window.location.reload(), timeout);
        });

        // Add MutationObserver to monitor body class changes
        const observer = new MutationObserver((mutationsList) => {
            for (const mutation of mutationsList) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    if (document.body.classList.contains('cooky-needs-consent')) {
                        this.$cooky.show(); // Call show() when the class is added
                    }
                }
            }
        });

        observer.observe(document.body, { attributes: true }); // Observe changes to attributes on <body>
    },

    respondAll(status) {
        Object.keys(Core.serviceStore).forEach((id) => {
            if (Core.serviceStore[id].changeStatus(status)) {
                Cooky.reloadThePage = true;
            }
        });

        Cooky.onResponse();
    },

    respond(id, status) {
        if (Core.serviceStore[id].changeStatus(status)) {
            Cooky.reloadThePage = true;
        }

        Cooky.onResponse();
    },

    onResponse() {
        Cooky.$modal.displayMessage();
        Core.updateState();
        Cooky.$modal.updateServicesState();
    }
};

export default Cooky;