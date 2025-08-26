import Service from '../../Service.js';
import Utils from '../../Utils.js';

export default class LinkedInService extends Service {
	constructor() {
		super('linkedin', 'LinkedIn');

		this.uri = 'https://www.linkedin.com/legal/cookie_policy';
		this.icon = 'linked-in';
		this.type = 'social';

		this.setClasses([
			{ classnames: ['linkedin-share'], type: 'button' },
			{ classnames: ['linkedin-follow-company'], type: 'button' },
			{ classnames: ['linkedin-member-profile'], type: 'box' }
		], true);

		this.setCookies([
			{ name: 'bcookie', duration: 2 * 30 * 24 * 60 * 60, secure: true },
			{ name: 'lidc', duration: 1 * 30 * 24 * 60 * 60, secure: true }
		], true);
	}

	js() {
		this.addScript('//platform.linkedin.com/in.js');

		this.html((el) => {
			let html = '';

			for (let i = 0, n = this.classes.length; i < n; i++) {
				if (Utils.hasAllClasses(el, this.classes[i].classnames)) {
					if (this.classes[i].classnames.includes('linkedin-share')) {
						html += '<script type="IN/Share"';
					} else if (this.classes[i].classnames.includes('linkedin-follow-company')) {
						html += '<script type="IN/FollowCompany"';
					} else if (this.classes[i].classnames.includes('linkedin-member-profile')) {
						html += '<script type="IN/MemberProfile"';
					} else {
						return '';
					}

					for (const key in el.dataset) {
						html += ` data-${key}="${el.dataset[key]}"`;
					}
					html += '></script>';
					break;
				}
			}

			setTimeout(() => {
				if (typeof IN !== 'undefined') {
					IN.parse();
				}
			}, 1000);

			return html;
		});
	}

	getTranslations() {
		return {
			fr: {
				"linkedin.details": "LinkedIn est une plateforme professionnelle permettant de partager des contenus."
			},
			en: {
				"linkedin.details": "LinkedIn is a professional platform for sharing content."
			},
			it: {
				"linkedin.details": "LinkedIn è una piattaforma professionale per condividere contenuti."
			},
			es: {
				"linkedin.details": "LinkedIn es una plataforma profesional para compartir contenido."
			}
		};
	}
};