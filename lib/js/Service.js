import Utils from './Utils.js';
import ServiceCookie from './ServiceCookie.js';
import CookyCookie from './CookyCookie.js';
import Config from './Config.js';

const loadedScripts = [];

export default class Service {
    constructor(id, name) {
        this.id = id;
        this.name = name;
        this.type = 'other';
        this.cookies = [];
        this.classes = [];
        this.details = '';
        this.icon = '';
        this.uri = '';
        this.mandatory = [];
        this.fallback = true;
        this.js = false;
        this.required = false;
        this.order = 0;

        this.waiting = false;
        this.force = false;
        this.denied = false;
        this.allowed = false;

        this.loaded = false;
        this.locale = 'en_US';
        this.selector = '';

        this.category = null; // category object
    }

    getTranslations() {
        return null;
    }

    isInCategory() {
        return this.category !== null;
    }

    setCookies(cookies, reset = false) {
        if (reset) {
            this.cookies = [];
        }

        for (let i = 0, n = cookies.length; i < n; i++) {
            let update = false;
            for (let j = 0, m = this.cookies.length; j < m; j++) {
                // check if the cookie already exists
                if (this.cookies[j].getName() === cookies[i].name) {
                    // update the cookie with the new values
                    for (let key in cookies[i]) {
                        if (key === 'name') {
                            continue; // skip the name property
                        }
                        this.cookies[j].update(key, cookies[i][key]);
                    }
                    update = true;
                    break; // exit the loop once the cookie is found and updated;
                }
            }

            if (update) {
                continue;
            }

            // if the cookie does not exist, create a new one
            this.cookies.push(new ServiceCookie(cookies[i]));
        }
    }

    setClasses(classes, reset = false) {
        if (reset) {
            this.classes = [];
        }

        for (let i = 0, n = classes.length; i < n; i++) {
            classes[i].selector = '.' + classes[i].classnames.join('.');
            this.classes.push(classes[i]);
        }

        let selectors = [];
        this.classes.forEach((cls) => {
            if (cls.selector !== '') {
                selectors.push(cls.selector);
            }
        });

        // remove duplicates & empty strings
        selectors = Utils.arrayUnique(selectors)
            .filter((selector) => selector !== '');

        this.selector = selectors.join(', ');
    }

    getType() {
        return this.type === '' ? 'other' : this.type;
    }

    updateCookie(cookieName, key, value) {
        for (let i = 0, n = this.cookies.length; i < n; i++) {
            if (this.cookies[i].getName() === cookieName) {
                this.cookies[i].update(key, value);
                return;
            }
        }
    }

    exec() {
        // load the current service state
        const state = CookyCookie.get(this.id);

        switch (state) {
            case 'force':
                this.setForce();
                break;

            case true:
                this.setAllowed();
                break;

            case false:
                this.setDenied();
                break;

            case 'wait':
            default:
                this.setWaiting();
                break;
        }

        if (this.required) {
            // set the service as allowed
            this.setForce(false === this.force);
        }

        // waiting for a response
        if (!this.allowed && !this.denied) {
            /*if (Config.get('service.bypass')) {
                this.setAllowed();
                return;
            }*/

            this.setWaiting(true);
            this.execFallback();
            return;
        }

        if (this.allowed) {
            this.execJs();
            return;
        }

        if (this.denied) {
            this.execFallback();
            return;
        }
    }

    set(key, value) {
        if (typeof this[key] === 'undefined') {
            console.warn(`Service: ${this.id} - Property "${key}" does not exist.`);
            return this;
        }

        this[key] = value;
        return this;
    }

    setData(data) {
        for (const key in data) {
            if (key === 'cookies') {
                this.setCookies(data[key]);
            } else if (key === 'classes') {
                this.setClasses(data[key]);
            } else if (key === 'mandatory') {
                this.mandatory = Utils.arrayMerge(this.mandatory, data[key]);
            } else if (['name', 'uri', 'fallback', 'js', 'required'].includes(key)) {
                this.set(key, data[key]);
            } else {
                // @todo: check for data types (function, object, array, ..)
                // this.set(key, data[key]);
                console.warn(`Service: ${this.id} - Property "${key}" cannot be updated.`);
            }
        }
    }

    setDenied(update = false) {
        if (update) {
            CookyCookie.set(this.id, false);
        }
        this.allowed = false;
        this.denied = true;
        this.waiting = false;
        this.force = false;
    }

    setAllowed(update = false) {
        if (update) {
            CookyCookie.set(this.id, true);
        }
        this.allowed = true;
        this.denied = false;
        this.waiting = false;
        this.force = false;
    }

    setWaiting(update = false) {
        if (update) {
            CookyCookie.set(this.id, 'wait');
        }
        this.allowed = false;
        this.denied = false;
        this.waiting = true;
        this.force = false;
    }

    setForce(update = false) {
        if (update) {
            CookyCookie.set(this.id, 'force');
        }
        this.allowed = true;
        this.denied = false;
        this.waiting = false;
        this.force = true;
    }

    /**
     * Change status after user responded
     * @param  {boolean} status  true or false
     */
    changeStatus(status) {
        if (status) {
            if (this.allowed) {
                // already approuved 
                console.log('Already approved service ' + this.id)
                return;
            }

            this.setAllowed(true);
            this.execJs();
            return;
        }

        if (!status) {
            this.setDenied(true);
            this.purgeCookies();
            // this.execFallback();
            this.loaded = false;
        }
    }

    /**
     * Purge service cookies from the browser.
     * This function will delete the cookies from the current domain and its subdomains.
     * @param {string[]} keys - The keys of the cookies to be deleted.
     */
    purgeCookies() {
        if (this.cookies.length > 0) {
            this.cookies.forEach((key) => {
                const domainParts = location.hostname.split('.');
                const baseDomain = domainParts.slice(-2).join('.');

                document.cookie = `${key}=; expires=Thu, 01 Jan 2000 00:00:00 GMT; path=/;`;
                document.cookie = `${key}=; expires=Thu, 01 Jan 2000 00:00:00 GMT; path=/; domain=.${location.hostname};`;
                document.cookie = `${key}=; expires=Thu, 01 Jan 2000 00:00:00 GMT; path=/; domain=.${baseDomain};`;
            });
        }
    }

    addScript(url, id, cb, execute) {
        if (execute === false) {
            if (typeof cb === 'function') {
                cb();
            }
            return;
        }

        if (!loadedScripts.includes(url)) {
            loadedScripts.push(url);

            const script = document.createElement('script');
            if (id !== undefined && id) {
                script.id = id;
            }
            script.src = url;
            script.type = 'text/javascript';
            script.async = true;

            let done = false;
            if (typeof cb === 'function') {
                script.onreadystatechange = script.onload = function () {
                    const state = script.readyState;

                    if (!done && (!state || /loaded|complete/.test(state))) {
                        done = true;
                        cb();
                    }
                };
            }

            document.getElementsByTagName('head')[0].appendChild(script);
        }
    }

    execJs() {
        // check for mandatory config values
        if (this.mandatory.length > 0) {
            for (let i = 0, n = this.mandatory.length; i < n; i++) {
                if (!Config.has('service.' + this.mandatory[i])) {
                    return false;
                }
            }
        }

        if (typeof this.js === 'function') {
            this.js();
        }

        this.loaded = true;
    }

    execFallback() {
        this.loaded = false;

        if (this.fallback === false) {
            return;
        }

        if (typeof this.fallback === 'function') {
            this.fallback();
            return;
        }

        if (this.selector === '') {
            return;
        }

        const elements = document.querySelectorAll(this.selector);

        elements.forEach((el) => {
            for (let i = 0, n = this.classes.length; i < n; i++) {
                if (Utils.hasAllClasses(el, this.classes[i].classnames)) {
                    if (this.classes[i].type === 'box') {
                        el.innerHTML = this.boxFallback(el);
                        return;
                    }

                    if (this.classes[i].type === 'button') {
                        el.innerHTML = this.buttonFallback(el);
                        return;
                    }
                }
            }

            el.innerHTML = this.defaultFallback(el);
        });
    }

    emptyHtml() {
        this.html("");
    }

    html(cb) {
        if (this.selector === '') {
            return;
        }

        const allowed = this.allowed;

        document.querySelectorAll(this.selector).forEach((el) => {
            const parent = el.parentElement;

            if (parent && parent.classList.contains("jizy-social-container")) {
                allowed ? parent.classList.add("allowed") : parent.classList.remove("allowed");
            } else {
                allowed ? el.classList.add("allowed") : el.classList.remove("allowed");
            }

            let html;

            if (typeof cb === 'function') {
                html = cb(el);
            } else if (cb !== undefined) {
                html = cb;
            } else {
                html = '';
            }

            el.innerHTML = html;
        });
    }

    defaultFallback(el) {
        let html = '';
        html += '<div class="cooky-activate">';
        html += '<div>';
        html += '<p><strong>' + this.name + '<span data-cooky-i18n="fallback.deactivated"></span></strong> <span data-cooky-i18n="fallback.authorize"></span></p>';
        html += '<button class="c-btn c-green cooky-allow" data-cooky-service="' + this.id + '"><span data-cooky-i18n="service.allow"></span></button>';
        html += '</div>';
        html += '</div>';
        return html;
    }

    boxFallback(el) {
        const parent = el.parentElement;

        if (el.classList.contains("jizy-player")) {
            el.setAttribute("width", parent.offsetWidth);
            el.setAttribute("height", parent.offsetHeight);
        }

        if (parent && parent.classList.contains("jizy-social-container")) {
            parent.classList.add("jizy-cooky-boxed");
        }

        return this.defaultFallback(el);
    }

    buttonFallback(el) {
        let html = '';
        html += '<div class="cooky-activate">';
        html += '<div>';
        html += `<button class="c-btn c-icon c-green cooky-allow" data-cooky-service="${this.id}" role="button" data-toggle="tooltip" data-cooky-i18n-title="fallback.tip">`;
        if (this.icon) {
            html += `<span class="cooky-icon-${this.icon}"></span>`;
        } else {
            html += '<span class="cooky-icon-exclamation-triangle"></span>';
        }
        html += `<span data-cooky-i18n="fallback.button_ ${this.name}"></span>`;
        html += '</button>';
        html += '</div>';
        html += '</div>';
        return html;
    }

    responsiveHtml(el) {
        if (!el.dataset.size) {
            el.dataset.size = "16by9";
        }

        let html = '<div class="embed-responsive';
        if (el.dataset.size === '16by9') {
            html += ' embed-responsive-16by9';
        } else {
            html += ' embed-responsive-4by3';
        }

        html += `">${this.iframe(el)}</div>`;

        return html;
    }

    frameHtml(el) {
        if (!el.dataset.frameUrl) {
            return '';
        }

        return `<div>${this.iframe(el)}</div>`;
    }

    iframe(el) {
        if (!el.dataset.frameUrl) {
            return '';
        }

        let html = '<iframe';
        if (el.dataset.transparency === "true") {
            html += ' allowtransparency';
        }
        if (el.dataset.fullscreen === "true") {
            html += ' webkitallowfullscreen mozallowfullscreen allowfullscreen';
        }
        html += ` src="${el.dataset.frameUrl}"`;
        html += ' frameborder="0"';

        if (el.dataset.scrolling === "false") {
            html += ' scrolling="no"';
        }

        if (el.getAttribute("width")) {
            html += ` width="${el.getAttribute("width")}"`;
        }

        if (el.getAttribute("height")) {
            html += ` height="${el.getAttribute("height")}"`;
        }

        html += '></iframe>';

        return html;
    }

    render() {
        let html = '';

        html += '<div class="cooky-r">';
        html += '<p>';
        html += `<strong>${this.name}</strong><br />`;
        html += '<a href="#" class="c-read-more-toggler"><span class="cooky-icon-caret"></span><span data-cooky-i18n="service.more"><span></a>';
        html += '</p>';

        if (this.type !== 'technical') {
            html += '<div class="c-buttons">';
            html += `<button data-cooky-service="${this.id}" class="c-btn c-green cooky-allow" data-cooky-i18n="service.allow"></button>`;
            html += `<button data-cooky-service="${this.id}" class="c-btn c-red cooky-deny" data-cooky-i18n="service.deny"></button>`;
            html += '</div>';
        }

        html += '<div class="c-read-more">';
        if (this.details) {
            html += `<p data-cooky-i18n="${this.details}"></p>`;
        }
        if (this.uri) {
            html += `<p><a href="${this.uri}" target="_blank" rel="noopener" class="no-icon" data-cooky-i18n="service.source"></a></p>`;
        }
        if (this.cookies.length > 0) {
            this.cookies.forEach((cookie) => {
                html += cookie.render();
            });
        } else {
            html += '<p data-cooky-i18n="cookie.doesnt"></p>';
        }
        html += '</div>';
        html += '</div>';

        return html;
    }
}
