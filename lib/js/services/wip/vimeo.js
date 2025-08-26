import Service from '../../Service.js';

export default class VimeoService extends Service {
	constructor() {
		super('vimeo', 'Vimeo');

		this.uri = 'http://vimeo.com/privacy';
		this.icon = 'vimeo';
		this.type = 'video';

		this.setCookies([
			{ name: 'vuid', duration: 2 * 365 * 24 * 60 * 60, secure: true },
			{ name: 'player', duration: 2 * 365 * 24 * 60 * 60, secure: true },
			{ name: '__utma', duration: 2 * 365 * 24 * 60 * 60, secure: true },
			{ name: '__utmb', duration: 2 * 365 * 24 * 60 * 60, secure: true },
			{ name: '__utmc', duration: 2 * 365 * 24 * 60 * 60, secure: true },
			{ name: '__utmv', duration: 2 * 365 * 24 * 60 * 60, secure: true },
			{ name: '__utmz', duration: 2 * 365 * 24 * 60 * 60, secure: true },
			{ name: '__utmt_player', duration: 2 * 365 * 24 * 60 * 60, secure: true }
		], true);

		this.setClasses([
			{ classnames: ['jizy-player', 'vimeo'], type: 'box' }
		], true);
	}

	js() {
		this.html((el) => {
			if (el.dataset.videoId) {
				el.dataset.frameUrl = `//player.vimeo.com/video/${el.dataset.videoId}`;
				return this.responsiveHtml(el);
			}

			return '';
		});
	}

	getTranslations() {
		return {
			fr: {
				"vimeo.details": "Vimeo est une plateforme de partage de vidéos.",
			},
			en: {
				"vimeo.details": "Vimeo is a video-sharing platform.",
			},
			it: {
				"vimeo.details": "Vimeo è una piattaforma per condividere video.",
			},
			es: {
				"vimeo.details": "Vimeo es una plataforma para compartir videos.",
			}
		};
	}
};
