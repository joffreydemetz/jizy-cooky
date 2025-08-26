import { COOKY_NAME, COOKY_VERSION, COOKY_CATEGORIES } from './Constants.js';
import Config from './Config.js';
import Utils from './Utils.js';
import Category from './Category.js';

let category_ordering = 1;
let service_ordering = 1;

const Core = {
    name: COOKY_NAME,
    version: COOKY_VERSION,
    languageStore: {},
    serviceStore: {},
    categoryStore: {},
    total: 0,
    denied: 0,
    allowed: 0,
    pending: 0,
    loaded: false,

    thrown: Utils.thrown,

    getConfig: () => Config.all(),

    /**
     * Add a language to the language store.
     * @param {object} language - The language to add. 
     */
    addLanguage(language) {
        if (!language) return;
        const code = language.getCode();
        if (typeof Core.languageStore[code] !== 'undefined') return;
        Core.languageStore[code] = language;
    },

    /**
     * Add translations to a specific language in the language store.
     * @param {string} id - The language code.
     * @param {object} translations - The translations to add.
     */
    addTranslations(id, translations) {
        if (typeof Core.languageStore[id] === 'undefined') {
            console.error(`Language ${id} not found in the language store.`);
            return;
        }
        if (typeof translations !== 'object') return;
        Core.languageStore[id].setTranslations(translations);
    },

    /**
     * Used by language and service plugins to append data to the languages.
     * @param {object} translations - The translations to append to each language.
     */
    appendTranslations(translations) {
        if (typeof translations !== 'object') return;

        Object.keys(translations).forEach((lang) => {
            if (typeof Core.languageStore[lang] !== 'undefined') {
                Core.languageStore[lang].setTranslations(translations[lang]);
            }
        });
    },

    /**
     * Add a service to the service store.
     * @param {object} service - The service to add.
     */
    addService(service) {
        if (!service) return;
        const id = service.id;
        if (typeof Core.serviceStore[id] !== 'undefined') return;
        Core.serviceStore[id] = service;

        // Add translations for the service
        const translations = service.getTranslations();
        if (translations) {
            Core.appendTranslations(translations);
        }
    },

    addPlugin(serviceId, plugin) {
        if (!plugin) return;

        if (typeof Core.serviceStore[serviceId] === 'undefined') {
            console.error(`Service ${serviceId} not found in the service store.`);
            return;
        }

        const translations = plugin.getTranslations();
        const data = plugin.getData();

        if (translations) {
            Core.appendTranslations(translations);
        }

        Core.serviceStore[serviceId].setData(data);
    },

    /**
     * Used by service plugins to append data to the service.
     * @param {string} id - The service ID.
     * @param {object} data - The data to append to the service. 
     */
    appendServiceData(id, data) {
        if (typeof Core.serviceStore[id] === 'undefined') {
            console.error(`Service ${id} not found in the service store.`);
            return;
        }

        if (typeof data !== 'object') return;
        Core.serviceStore[id].setData(data);
    },

    /**
     * Add a category to the category store.
     * @param {object} category - The category to add. 
     */
    addCategory(category) {
        if (!category) return;
        const id = category.id;
        if (typeof Core.categoryStore[id] !== 'undefined') return;
        if (id === 'technical') {
            category.order = 0; // Force "technical" to have order 0
        } else if (id === 'other') {
            category.order = COOKY_CATEGORIES.length + 99; // Force "other" to be at the end
        } else {
            category.order = category_ordering++;
        }
        Core.categoryStore[id] = category;
    },

    /**
     * Update config in the config store.
     * @param {object} config - The config to update.
     */
    updateConfig(config) {
        if (!config) return;
        if (typeof config !== 'object') return;
        if (Object.keys(config).length === 0) return;

        Object.keys(config).forEach((key) => {
            Config.set(key, config[key]);
        });
    },

    check() {
        Core.loadCategories(); // initialize services
        this.reorderServices(); // Reorder services in the service store
    },

    loadCategories() {
        Core.categoryStore = {};

        // Create categories and add them to the category store
        COOKY_CATEGORIES.forEach((cat) => {
            // Create a new category
            const category = new Category(cat);
            this.addCategory(category);

            // Add services assigned to that category
            Object.keys(Core.serviceStore).forEach((id) => {
                const type = Core.serviceStore[id].getType();
                if (type === cat) {
                    if (id === 'core') {
                        Core.serviceStore[id].order = 0; // Force "core" to have order 0
                    }
                    else {
                        Core.serviceStore[id].order = service_ordering++; // Set the order property for the service
                    }

                    // Add the service to the category
                    Core.categoryStore[type].addService(Core.serviceStore[id]);
                }
            });
        });

        // Add unknown service types
        Object.keys(Core.serviceStore).forEach((id) => {
            if (Core.serviceStore[id].isInCategory()) return;

            const category = new Category(Core.serviceStore[id].getType());
            this.addCategory(category);

            if (id === 'core') {
                Core.serviceStore[id].order = 0; // Force "core" to have order 0
            }
            else {
                Core.serviceStore[id].order = service_ordering++; // Set the order property for the service
            }

            category.addService(Core.serviceStore[id]);
        });

        // reorder categories by order property
        const orderedCategories = Object.values(Core.categoryStore).sort((a, b) => a.order - b.order);

        // Reconstruct categoryStore as an object after sorting
        Core.categoryStore = orderedCategories.reduce((acc, category) => {
            acc[category.id] = category;
            return acc;
        }, {});
    },

    reorderServices() {
        // Create an array of all services with their category order and service order
        const servicesWithOrder = [];

        Object.values(Core.categoryStore).forEach((category) => {
            // Add each service to the array with its category and service order
            Object.values(category.services).forEach((service) => {
                servicesWithOrder.push({
                    categoryOrder: category.order,
                    serviceOrder: service.order,
                    service: service
                });
            });
        });

        // Sort the services by category order first, then by service order
        servicesWithOrder.sort((a, b) => {
            if (a.categoryOrder !== b.categoryOrder) {
                return a.categoryOrder - b.categoryOrder; // Sort by category order
            }
            return a.serviceOrder - b.serviceOrder; // Sort by service order within the same category
        });

        // Reconstruct Core.serviceStore with the sorted services
        Core.serviceStore = servicesWithOrder.reduce((acc, item, index) => {
            const service = item.service;
            service.order = index + 1; // Update the service's order based on its final position
            acc[service.id] = service;
            return acc;
        }, {});
    },

    reset: function () {
        Core.resetState();

        Core.serviceStore = {};
        Core.languageStore = {};
        Core.categoryStore = {};
    },

    resetState() {
        Core.total = 0;
        Core.denied = 0;
        Core.allowed = 0;
        Core.pending = 0;
    },

    updateState() {
        Object.keys(Core.serviceStore).forEach((id) => {
            if (Core.serviceStore[id].type === 'technical') return;

            Core.total++;

            if (Core.serviceStore[id].denied) {
                Core.denied++;
            } else if (Core.serviceStore[id].allowed) {
                Core.allowed++;
            } else {
                Core.pending++;
            }
        });
    },

    checkNavigatorLanguage() {
        if (Config.get('navigatorLanguage') && typeof navigator !== 'undefined' && navigator.language) {
            const userLanguage = navigator.language.substring(0, 2);
            if (typeof Core.languageStore[userLanguage] !== 'undefined') {
                Config.set('defaultLanguage', userLanguage);
            }
        }
    },

    loadDefaultLanguage() {
        const defaultLang = Config.get('defaultLanguage');
        const lang = Core.languageStore[defaultLang];

        if (lang) {
            Config.set('language', lang.getCode());
            Config.set('locale', lang.getLocale());
        } else {
            console.error(`Language ${defaultLang} not found in the language store.`);
        }
    },

    respondToConsent(accept = false) {
        Object.keys(Core.serviceStore).forEach((id) => {
            if (Core.serviceStore[id].type === 'technical') return;
            Core.serviceStore[id].respondToConsent();
        });
    }
};

export default Core;
export { COOKY_NAME, COOKY_VERSION, COOKY_CATEGORIES };