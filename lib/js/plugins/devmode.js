import Plugin from "../Plugin.js";
import Cooky from "../Cooky.js";
import Core from "../Core.js";

export default class DevModePlugin extends Plugin {
    constructor() {
        super();

        Cooky.addLanguage = Core.addLanguage;
        Cooky.addTranslations = Core.addTranslations;
        Cooky.appendTranslations = Core.appendTranslations;

        Cooky.addService = Core.addService;
        Cooky.appendServiceData = Core.appendServiceData;
        Cooky.addCategory = Core.addCategory;

        Cooky.appendServiceCookies = function (serviceId, cookies) {
            if (typeof Core.serviceStore[serviceId] === 'undefined') return;
            Core.serviceStore[serviceId].setCookies(cookies);
        };

        Cooky.updateServiceCookie = function (serviceId, name, key, value) {
            if (typeof Core.serviceStore[serviceId] === 'undefined') return;
            const cookie = { name: name };
            cookie[key] = value;
            Core.serviceStore[serviceId].setCookies([cookie]);
        };
    }
};


