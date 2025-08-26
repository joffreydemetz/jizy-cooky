import Service from '../../Service.js';

export default class YoutubeService extends Service {
	constructor() {
		super('youtube', 'YouTube');

		this.uri = 'https://www.google.fr/intl/fr/policies/privacy/';
		this.icon = 'youtube';
		this.type = 'video';

		this.setCookies([
			{ name: 'YSC', duration: 6 * 30 * 24 * 60 * 60, secure: true },
			{ name: 'PREF', duration: 6 * 30 * 24 * 60 * 60, secure: true },
			{ name: 'VISITOR_INFO1_LIVE', duration: 6 * 30 * 24 * 60 * 60, secure: true },
			{ name: 'GEUP', duration: 6 * 30 * 24 * 60 * 60, secure: true }
		], true);

		this.setClasses([
			{ classnames: ['jizy-player', 'youtube'], type: 'box' }
		], true);
	}

	js() {
		this.html((el, service) => {
			if (el.dataset.videoId) {
				let videoUrl = `//www.youtube-nocookie.com/embed/${el.dataset.videoId}?`;

				['rel', 'controls', 'showinfo', 'autoplay'].forEach((key, index) => {
					const value = el.dataset[key];
					if (value !== undefined) {
						videoUrl += `${index > 0 ? '&' : ''}${key}=${value}`;
					}
				});

				el.dataset.frameUrl = videoUrl;
				return service.responsiveHtml(el);
			}

			return '';
		});
	}

	getTranslations() {
		return {
			fr: {
				"youtube.details": "YouTube est une plateforme de partage de vidéos.",
			},
			en: {
				"youtube.details": "YouTube is a video-sharing platform.",
			},
			it: {
				"youtube.details": "YouTube è una piattaforma per condividere video.",
			},
			es: {
				"youtube.details": "YouTube es una plataforma para compartir videos.",
			}
		};
	}
};
