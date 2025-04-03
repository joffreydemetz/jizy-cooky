const Cookie = {
	name: 'jizy_cooky',

	setName(newName) {
		this.name = newName;
	},

	create(key, status) {
		const d = new Date();
		d.setTime(d.getTime() + 31536000000); // 1 year
		const value = `${this.name}=!${key}=${status}`;
		document.cookie = `${value}; expires=${d.toGMTString()}; path=/; Secure; SameSite=strict`;
	},

	read() {
		const nameEQ = `${this.name}=`;
		const cookies = document.cookie.split(';');
		for (let c of cookies) {
			c = c.trim();
			if (c.startsWith(nameEQ)) {
				return c.substring(nameEQ.length);
			}
		}
		return '';
	},

	purge(keys) {
		keys.forEach(key => {
			document.cookie = `${key}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;`;
			document.cookie = `${key}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=.${location.hostname};`;
			document.cookie = `${key}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=.${location.hostname.split('.').slice(-2).join('.')};`;
		});
	},

	exists(key) {
		return document.cookie.includes(`${key}=`);
	},
};

export default Cookie;
