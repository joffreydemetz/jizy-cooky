import Service from '../../Service.js';

export default class DailymotionService extends Service {
	constructor() {
		super('dailymotion', 'Dailymotion');

		this.uri = 'https://www.dailymotion.com/legal/cookiemanagement';
		this.type = 'video';

		this.setCookies([
			{ name: 's_fid', duration: 2 * 30 * 24 * 60 * 60, secure: true },
			{ name: 's_cc', duration: 2 * 30 * 24 * 60 * 60, secure: true },
			{ name: 's_sq', duration: 2 * 30 * 24 * 60 * 60, secure: true },
			{ name: 's_vi', duration: 2 * 30 * 24 * 60 * 60, secure: true },
			{ name: 's_vnum', duration: 2 * 30 * 24 * 60 * 60, secure: true }
			// { name: 'ts' },
			// { name: 'dmvk' },
			// { name: 'hist' },
			// { name: 'v1st' },
		], true);

		this.setClasses([
			{ classnames: ['jizy-player', 'dailymotion'], type: 'box' }
		], true);
	}

	js() {
		this.html((el) => {
			if (el.dataset.videoId) {
				let videoUrl = `//www.dailymotion.com/embed/video/${el.dataset.videoId}?`;

				['showinfo', 'autoplay'].forEach((key) => {
					let value = el.dataset[key];
					if (key === 'autoplay') {
						key = 'autoPlay';
					}
					if (value !== undefined) {
						videoUrl += `&${key}=${value}`;
					}
				});

				el.dataset.frameUrl = videoUrl;
				return this.responsiveHtml(el);
			}

			return '';
		});
	}

	getTranslations() {
		return {
			fr: {
				"dailymotion.details": "Dailymotion est une plateforme de partage de vidéos."
			},
			en: {
				"dailymotion.details": "Dailymotion is a video-sharing platform."
			},
			it: {
				"dailymotion.details": "Dailymotion è una piattaforma di condivisione video."
			},
			es: {
				"dailymotion.details": "Dailymotion es una plataforma para compartir videos."
			}
		}
	}
}
