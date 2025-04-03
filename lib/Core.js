import { 
	Selector, 
	jDOM, 
	DOM, 
	extendDOMAttributes, 
	extendDOMManipulation, 
	extendDOMAccess, 
	extendDOMMisc, 
	extendDOMContents 
} from '@jizy/jizy-dom';

// Extend DOM functionality
extendDOMAttributes(DOM);
extendDOMManipulation(DOM);
extendDOMAccess(DOM);
extendDOMMisc(DOM);
extendDOMContents(DOM);

import Modalizer from '@jizy/jizy-modalizer';
import Service from './Service.js';
import Language from './Language.js';
import Cookie from './Cookie.js';
import Config from './Config.js';

const Cooky = {
	services: {},
	languages: {},
	lang: null,
	$cooky: null,
	$modal: null,

    preload(){
        document.addEventListener("DOMContentLoaded", () => {
            // Ensure Cooky elements are visible
            jDOM("#cooky").attr("style", null);
            jDOM("#cookyModal").attr("style", null);
            jDOM("#cookyModalBackdrop").attr("style", null);
        
            // Bind click event to open the Cooky modal
            jDOM(".cooky-modal").on("click", (e) => e.preventDefault() && this.show());
        });
    },

	init(config) {
		if (config) {
			for (const key in config) {
				Config.set(key, config[key]);
			}
		}

		this.$cooky = jDOM('#cooky');
		this.$modal = Modalizer.init('#cookyModal');

		this.initLanguage();
		this.initServices();
		this.bindEvents();
	},

	// Configuration management
	hasConfig(key) {
		return Config.has(key);
	},

	setConfig(key, value) {
		Config.set(key, value);
	},

	getConfig(key, def = null) {
		return Config.get(key, def);
	},

	// Language management
	initLanguage() {
		const defaultLang = this.getConfig('language', 'en');
		this.lang = this.languages[defaultLang] || new Language(defaultLang, 'English', 'en-US');
	},

	addLanguage(code, name, locale, translations) {
		if (!this.languages[code]) {
			this.languages[code] = new Language(code, name, locale);
		}
		this.languages[code].setTranslations(translations);
	},

	// Service management
	initServices() {
		const cookie = Cookie.read();
		for (const id in this.services) {
			const service = this.services[id];
			service.setConsent(cookie);
			if (service.isAllowed()) {
				service.execJs();
			} else {
				service.execFallback();
			}
		}
	},

	addService(id, params) {
		if (!this.services[id]) {
			this.services[id] = new Service(id);
		}
		this.services[id].setData(params);
	},

	// Event binding
	bindEvents() {
		this.$modal.find('.c-allow-all').on('click', () => this.respondAll(true));
		this.$modal.find('.c-deny-all').on('click', () => this.respondAll(false));
	},

	// Respond to all services
	respondAll(status) {
		for (const id in this.services) {
			this.services[id].changeStatus(status);
		}
	},

	// Respond to a specific service
	respond(id, status) {
		if (this.services[id]) {
			this.services[id].changeStatus(status);
		}
	},

	// Modal controls
	show() {
		this.$modal.show();
	},

	hide() {
		this.$modal.hide();
	},

	// Utility
	needsAlert() {
		return Object.values(this.services).some(service => service.waiting);
	},

	needsReload() {
		return Object.values(this.services).some(service => service.isLoaded());
	},

	showUpdatedMessage() {
		const $message = this.$modal.find('.c-message');
		if (!$message.hasClass('in')) {
			$message.addClass('in');
			setTimeout(() => $message.removeClass('in'), 2000);
		}
	},

	// Cookie management
	setCookieName(name) {
		Cookie.setName(name);
	},
};

export default Cooky;
