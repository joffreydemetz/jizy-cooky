class Language {
	constructor(code, name, locale) {
		this.code = code;
		this.name = name;
		this.locale = locale;
		this.translations = {};
	}

	setTranslations(translations) {
		this.translations = { ...this.translations, ...translations };
	}

	get(key) {
		return this.translations[key] !== undefined ? this.translations[key] : key;
	}

	getCode() {
		return this.code;
	}

	getName() {
		return this.name;
	}

	getLocale() {
		return this.locale;
	}

	getTranslations() {
		return this.translations;
	}

	sortedCategories() {
		const categories = [
			'technical',
			'ads',
			'analytic',
			'api',
			'comment',
			'social',
			'support',
			'video',
		];

		return categories.sort((a, b) => {
			if (this.get(`${a}.title`) > this.get(`${b}.title`)) return 1;
			if (this.get(`${a}.title`) < this.get(`${b}.title`)) return -1;
			return 0;
		});
	}
}

export default Language;
