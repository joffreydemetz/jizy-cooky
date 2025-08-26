import Service from '../../Service.js';

export default class YoutubePlaylistService extends Service {
	constructor() {
		super('youtubeplaylist', 'YouTube (playlist)');

		this.uri = 'https://www.google.fr/intl/fr/policies/privacy/';
		this.type = 'video';

		this.setCookies([
			{ name: 'VISITOR_INFO1_LIVE', duration: 6 * 30 * 24 * 60 * 60, secure: true },
			{ name: 'YSC', duration: 6 * 30 * 24 * 60 * 60, secure: true },
			{ name: 'PREF', duration: 6 * 30 * 24 * 60 * 60, secure: true },
			{ name: 'GEUP', duration: 6 * 30 * 24 * 60 * 60, secure: true }
		], true);

		this.setClasses([
			{ classnames: ['youtube_playlist_player'], type: 'box' }
		], true);
	}

	js() {
		this.html((el, service) => {
			if (el.dataset.playlistId) {
				let videoUrl = `//www.youtube-nocookie.com/embed/videoseries?list=${el.dataset.playlistId}`;

				['list', 'rel', 'controls', 'showinfo', 'autoplay'].forEach((key) => {
					const value = el.dataset[key];
					if (value !== undefined) {
						videoUrl += `&${key}=${value}`;
					}
				});

				el.dataset.frameUrl = videoUrl;
				el.dataset.fullscreen = true;
				el.dataset.transparency = true;
				return service.responsiveHtml(el);
			}

			return '';
		});
	}

	getTranslations() {
		return {
			fr: {
				"youtubeplaylist.details": "YouTube est une plateforme de partage de vidéos.",
			},
			en: {
				"youtubeplaylist.details": "YouTube is a video-sharing platform.",
			},
			it: {
				"youtubeplaylist.details": "YouTube è una piattaforma per condividere video.",
			},
			es: {
				"youtubeplaylist.details": "YouTube es una plataforma para compartir videos.",
			}
		};
	}
};
