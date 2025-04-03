class CookInfo {
	constructor(data) {
		this.name = data.name;
		this.details = data.details || '';
		this.secure = typeof data.secure !== 'undefined' && data.secure === true;

		if (data.duration === 'browser') {
			this.duration = '<span data-cooky-i18n="cookie.duration.browser"></span>';
		} else if (typeof data.duration !== 'undefined' && data.duration > 0) {
			this.duration = this.formatDuration(data.duration);
		} else {
			this.duration = '<span data-cooky-i18n="cookie.duration.na"></span>';
		}
	}

	formatDuration(duration) {
		if (duration <= 60) {
			return `~ ${duration} <span data-cooky-i18n="cookie.duration.seconds"></span>`;
		} else if (duration <= 60 * 60) {
			const minutes = Math.floor(duration / 60);
			return `~ ${minutes} <span data-cooky-i18n="cookie.duration.minute${minutes > 1 ? 's' : ''}"></span>`;
		} else if (duration <= 24 * 60 * 60) {
			const hours = Math.floor(duration / (60 * 60));
			return `~ ${hours} <span data-cooky-i18n="cookie.duration.hour${hours > 1 ? 's' : ''}"></span>`;
		} else if (duration <= 365 * 24 * 60 * 60) {
			const days = Math.floor(duration / (24 * 60 * 60));
			return `~ ${days} <span data-cooky-i18n="cookie.duration.day${days > 1 ? 's' : ''}"></span>`;
		} else {
			const years = Math.floor(duration / (365 * 24 * 60 * 60));
			return `~ ${years} <span data-cooky-i18n="cookie.duration.year${years > 1 ? 's' : ''}"></span>`;
		}
	}

	has() {
		return document.cookie.includes(`${this.name}=`);
	}

	isSecure() {
		return this.secure;
	}

	getDetails() {
		return this.details;
	}

	getDuration() {
		return this.duration;
	}
}

export default CookInfo;
