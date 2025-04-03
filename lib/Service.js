import { isPlainObject } from './utils.js';
import Cookie from './Cookie.js';
import CookInfo from './CookInfo.js';

class Service {
	constructor(id) {
		this.id = id;
		this.name = '';
		this.type = 'other';
		this.details = '';
		this.uri = '';
		this.cookies = [];
		this.mandatory = [];
		this.classes = [];
		this.fallback = true;
		this.js = false;
		this.required = false;
		this.waiting = false;
		this.denied = false;
		this.allowed = false;
		this.loaded = false;
		this.selector = '';
	}

	setData(data) {
		for (const key in data) {
			if (key === 'cookies') {
				this.setCookies(data[key]);
			} else if (key === 'classes') {
				this.setClasses(data[key]);
			} else {
				this[key] = data[key];
			}
		}

		const selectors = this.classes.map(cls => cls.selector);
		this.selector = selectors.length === 0 ? '' : selectors.join(', ');
	}

	setConsent(cookie) {
		this.denied = cookie.includes(`${this.id}=false`);
		this.allowed = cookie.includes(`${this.id}=true`);
		this.waiting = !cookie || cookie.includes(`${this.id}=wait`);
	}

	setDenied() {
		this.allowed = false;
		this.denied = true;
		this.waiting = false;
	}

	setAllowed() {
		this.allowed = true;
		this.denied = false;
		this.waiting = false;
	}

	forceAllowed() {
		this.setAllowed();
	}

	setCookies(cookies) {
		this.cookies = cookies.map(cookie =>
			isPlainObject(cookie) ? new CookInfo(cookie) : new CookInfo({ name: cookie, duration: 0 })
		);
	}

	setClasses(classes, reset = false) {
		if (reset) {
			this.classes = [];
		}

		this.classes = classes.map(cls => ({
			...cls,
			selector: `.${cls.classnames.join('.')}`,
		}));

		const selectors = this.classes
			.map(cls => cls.classnames)
			.flat()
			.map(name => `.${name}`);
		this.selector = selectors.length === 0 ? '' : selectors.join(', ');
	}

	execJs() {
		if (this.js && typeof this.js === 'function') {
			this.js();
		}
		this.setAllowed();
		Cookie.create(this.id, true);
		this.loaded = true;
	}

	execFallback() {
		this.loaded = false;
		if (this.fallback && typeof this.fallback === 'function') {
			this.fallback();
		}
	}

	changeStatus(status) {
		if (status) {
			if (this.waiting || this.denied) {
				this.execJs();
			}
		} else {
			this.setDenied();
			Cookie.create(this.id, false);
		}
	}

	isWaiting() {
		return this.waiting;
	}

	isDenied() {
		return this.denied;
	}

	isAllowed() {
		return this.allowed;
	}

	isResponded() {
		return this.allowed || this.denied;
	}

	isLoaded() {
		return this.loaded;
	}

	purgeCookies() {
		if (this.cookies.length > 0) {
			Cookie.purge(this.cookies.map(cookie => cookie.name));
		}
	}

	addScript(url, id, cb, execute = true) {
		if (!execute) {
			if (typeof cb === 'function') {
				cb();
			}
			return;
		}

		const script = document.createElement('script');
		if (id) {
			script.id = id;
		}
		script.src = url;
		script.type = 'text/javascript';
		script.async = true;

		if (typeof cb === 'function') {
			script.onload = cb;
		}

		document.head.appendChild(script);
	}
}

export default Service;
