export default class ServiceCookie {
    constructor(data) {
        if (typeof data === 'string') {
            data = {
                name: data,
                details: '',
                secure: false,
                duration: null
            };
        }

        this.name = data.name;
        this.details = data.details || '';
        this.secure = data.secure || false;
        this.duration = data.duration || null;
    }

    toString() {
        let cookieString = `${this.name}=;`;

        if (this.duration) {
            cookieString += ` Max-Age=${this.duration};`;
        }

        if (this.secure) {
            cookieString += ' Secure;';
        }

        return cookieString;
    }

    getName() {
        return this.name;
    }

    update(key, value) {
        if (key === 'name') {
            return;
        }

        if (typeof this[key] !== undefined) {
            this[key] = value;
        }
    }

    delete() {
        document.cookie = `${this.name}=; Max-Age=0;`;
    }

    has() {
        const cookies = document.cookie.split(';');

        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();

            if (cookie.startsWith(`${this.name}=`)) {
                return true; // Cookie found
            }
        }

        return false; // Cookie not found or expired
    }

    formatDuration() {
        if (this.duration === 'browser') {
            return '<span data-cooky-i18n="cookie.duration.browser" data-cooky-i18n-title="cookie.duration.browsermore"></span>';
        }

        if (this.duration && this.duration > 0) {
            if (this.duration < 60) {
                return `~ ${this.duration} <span data-cooky-i18n="cookie.duration.seconds"></span>`;
            }

            if (this.duration < 60 * 60) {
                const minutes = Math.round(this.duration / 60);
                return `~ ${minutes} <span data-cooky-i18n="cookie.duration.minute${minutes > 1 ? 's' : ''}"></span>`;
            }

            if (this.duration < 24 * 60 * 60) {
                const hours = Math.round(this.duration / (60 * 60));
                return `~ ${hours} <span data-cooky-i18n="cookie.duration.hour${hours > 1 ? 's' : ''}"></span>`;
            }

            if (this.duration < 365 * 24 * 60 * 60) {
                const days = Math.round(this.duration / (24 * 60 * 60));
                return `~ ${days} <span data-cooky-i18n="cookie.duration.day${days > 1 ? 's' : ''}"></span>`;
            }

            const years = Math.round(this.duration / (365 * 24 * 60 * 60));
            return `~ ${years} <span data-cooky-i18n="cookie.duration.year${years > 1 ? 's' : ''}"></span>`;
        }

        return '<span data-cooky-i18n="cookie.duration.na"></span>';
    }

    render() {
        let html = '';

        html += '<div class="c-item">';
        html += '<div class="c-item-name">';
        if (this.secure) {
            html += '<span class="cooky-icon-lock"></span>';
        }
        html += `<strong>${this.name}</strong>`;
        html += '</div>';
        if (this.details) {
            html += `<div class="c-item-details" data-cooky-i18n="${this.details}"></div>`;
        }
        html += `<div class="c-item-duration" data-cooky-i18n-title="cookie.table.duration">${this.formatDuration()}</div>`;
        html += '</div>';

        return html;
    }
}
