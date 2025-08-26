import Service from '../../Service.js';

export default class InstagramService extends Service {
    constructor() {
        super('instagram', 'Instagram');

        this.uri = 'https://help.instagram.com/155833707900388';
        this.icon = 'instagram';
        this.type = 'social';

        this.setClasses([
            { classnames: ['instagram-feed'], type: 'box' }
        ], true);

        this.setCookies([
            { name: 'ig_nrcb', duration: 360 * 24 * 60 * 60, secure: true },
            { name: 'ig_cb', duration: 360 * 24 * 60 * 60, secure: true },
            { name: 'csrftoken' },
            { name: 'datr' },

            // { name: 'rur', duration: 'browser', secure: true },
            // { name: 'urlgen', duration: 'browser', secure: true },
            // { name: 'fsbr_***', duration: 'browser', secure: true },
            // { name: 'mid', duration: 360 * 24 * 60 * 60, secure: true },
            // { name: 'sessionid', duration: 360 * 24 * 60 * 60, secure: true },
            // { name: 'ds_user_id', duration: 28 * 24 * 60 * 60, secure: true },
            // { name: 'shbid', duration: 4 * 24 * 60 * 60, secure: true },
            // { name: 'shbts', duration: 4 * 24 * 60 * 60, secure: true },
            // { name: 'ig_did', secure: true }
        ], true);
    }

    js() {
        this.emptyHtml();
        this.addScript('//www.instagram.com/embed.js');
    }

    getTranslations() {
        return {
            fr: {
                "instagram.details": "Instagram est une plateforme de partage de photos et de vidéos."
            },
            en: {
                "instagram.details": "Instagram is a platform for sharing photos and videos."
            },
            it: {
                "instagram.details": "Instagram è una piattaforma per condividere foto e video."
            },
            es: {
                "instagram.details": "Instagram es una plataforma para compartir fotos y videos."
            }
        };
    }
};
