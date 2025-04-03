const Config = {
	data: {
		language: 'en',
		adBlocker: false,
		noAdBlocker: false,
		hideOnFullAnswer: true,
	},

	has(key) {
		return this.data[key] !== undefined;
	},

	set(key, value) {
		this.data[key] = value;
	},

	get(key, def = null) {
		if (key.includes('.')) {
			const keys = key.split('.');
			let node = this.data;

			for (let i = 0; i < keys.length; i++) {
				if (node[keys[i]] === undefined) {
					return def;
				}
				node = node[keys[i]];
			}
			return node;
		}

		return this.data[key] !== undefined ? this.data[key] : def;
	},
};

export default Config;
