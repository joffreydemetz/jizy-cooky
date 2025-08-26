export default class Category {
    constructor(id) {
        this.id = id;
        this.title = id + '.title';
        this.details = id + '.details';
        this.order = 0;
        this.services = {}; // list of services in this category
    }

    addService(service) {
        if (this.services[service.id]) {
            return;
        }
        this.services[service.id] = service;
        service.category = this;
    }

    getServices() {
        return this.services;
    }

    isUsed() {
        return Object.keys(this.services).length > 0;
    }

    sortServices() {
        if (!this.isUsed()) return; // Skip empty categories

        let ordering = 1;
        Object.values(this.services).forEach((service) => {
            if (service.id === 'core') {
                service.order = 0; // Force "core" to have order 0
                return;
            }
            service.order = ordering++;
        });

        // reorder services by order property
        const orderedServices = Object.values(this.services).sort((a, b) => a.order - b.order);

        // Reconstruct services as an object after sorting
        this.services = orderedServices.reduce((acc, service) => {
            acc[service.id] = service;
            return acc;
        }, {});
    }

    render() {
        if (!this.isUsed()) return ''; // Skip empty categories
        //console.dir(this.services);
        let html = '';
        html += '<hr />';
        html += `<p class="L3" data-cooky-i18n="${this.title}"></p>`;
        html += `<p data-cooky-i18n="${this.details}"></p>`;
        Object.keys(this.services).forEach((id) => {
            const service = this.services[id];
            html += service.render();
        });
        return html;
    }
}

