import Service from '../../Service.js';
import Utils from '../../Utils.js';

export default class TwitterService extends Service {
	constructor() {
		super('twitter', 'Twitter');

		this.uri = 'https://support.twitter.com/articles/20170514';
		this.icon = 'twitter';
		this.type = 'social';

		this.setClasses([
			{ classnames: ['twitter-share'], type: 'button' },
			{ classnames: ['twitter-follow'], type: 'button' },
			{ classnames: ['twitter-tweet'], type: 'button' },
			{ classnames: ['twitter-timeline'], type: 'box' },
			{ classnames: ['twitter-widget'], type: 'box' }
		], true);
	}

	js() {
		this.addScript('//platform.twitter.com/widgets.js', 'twitter-wjs');

		this.html((el) => {
			for (let i = 0, n = this.classes.length; i < n; i++) {
				if (Utils.hasAllClasses(el, this.classes[i].classnames)) {
					if (this.classes[i].classnames.includes('twitter-share')) {
						let html = '<a href="https://twitter.com/share" class="twitter-share-button"';
						for (const key in el.dataset) {
							html += ` data-${key}="${el.dataset[key]}"`;
						}
						html += '></a>';
						return html;
					}
					break;
				}
			}
			return '';
		});
	}

	getTranslations() {
		return {
			"fr": {
				"twitter.details": "Twitter est une plateforme permettant de partager des tweets.",
			},
			"en": {
				"twitter.details": "Twitter is a platform for sharing tweets.",
			},
			"it": {
				"twitter.details": "Twitter è una piattaforma per condividere tweet.",
			},
			"es": {
				"twitter.details": "Twitter es una plataforma para compartir tweets.",
			}
		};
	}
};
