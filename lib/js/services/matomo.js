import Service from '../Service.js';
import Config from '../Config.js';

export default class MatomoService extends Service {
    constructor() {
        super('matomo', 'Matomo');

        this.uri = 'https://matomo.org/faq/general/faq_146/';
        this.details = 'matomo.details';
        this.mandatory = ['matomo.id', 'matomo.host'];
        this.type = 'analytic';

        this.setClasses([
            { classnames: ['matomo-opt-out'], type: 'box' }
        ], true);

        this.setCookies([
            { name: '_pk_id', duration: 400 * 24 * 60 * 60 },
            { name: '_pk_ref', duration: 183 * 24 * 60 * 60 },
            { name: '_pk_ses', duration: 30 * 60 },
            { name: '_pk_cvar', duration: 30 * 60 },
            { name: '_pk_hsr', duration: 30 * 60 },
            { name: 'matomo_ignore', duration: 30 * 365 * 24 * 60 * 60, details: 'matomo.ignore' },
            { name: 'mtm_consent', duration: 30 * 365 * 24 * 60 * 60, details: 'matomo.consent' },
            { name: 'mtm_consent_removed', duration: 30 * 365 * 24 * 60 * 60, details: 'matomo.noconsent' },
            { name: 'mtm_cookie_consent', duration: 30 * 365 * 24 * 60 * 60, details: 'matomo.consentcookie' },
            { name: 'MATOMO_SESSID', duration: 14 * 24 * 60 * 60, secure: true }
        ], true);

        this.matomoLoaded = false;
    }

    js() {
        this._loadMatomo();
    }

    fallback() {
        Config.set('service.matomo.disableCookies', true);
        this._loadMatomo();
    }

    _loadMatomo() {
        if (!this.matomoLoaded) {
            this.matomoLoaded = true;

            const host = Config.get('service.matomo.host');
            const domain = Config.get('service.matomo.domain');
            const trackPrefix = Config.get('service.matomo.trackPrefix');
            const downloadClasses = Config.get('service.matomo.downloadClasses');
            const downloadExtensions = Config.get('service.matomo.downloadExtensions');

            this.addScript(`https://${host}/matomo.js`);

            const _paq = (window._paq = window._paq || []);

            if (domain) {
                _paq.push(['setDomains', [domain]]);
            }

            if (trackPrefix) {
                _paq.push([
                    'setCustomUrl',
                    `${location.protocol}//${location.hostname}/${trackPrefix}/${location.pathname}`
                ]);
            }

            _paq.push(['setDoNotTrack', true]);
            if (Config.get('service.matomo.disableCookies')) {
                _paq.push(['disableCookies']);
            }
            if (downloadClasses) {
                _paq.push(['setDownloadClasses', downloadClasses]);
            }
            if (downloadExtensions) {
                _paq.push(['setDownloadExtensions', downloadExtensions]);
            }
            _paq.push(['enableHeartBeatTimer', 15]);
            _paq.push(['setTrackerUrl', `https://${host}/matomo.php`]);
            _paq.push(['setSiteId', Config.get('service.matomo.id')]);
            _paq.push(['trackPageView']);
            _paq.push(['enableLinkTracking']);


            /* this.html(function($el, service){
                if ( $el.data("matomo-loaded") ){
                    console.log('loaded');
                    return $el.html();
                }
            	
                $el.data("matomo-loaded", true);
            	
                var url = 'https://'+Cooky.getConfig('service.matomo.host')+'/index.php?module=CoreAdminHome&action=optOutJS'
                    + '&div='+$el.prop('id')
                    + '&showIntro='+Cooky.getConfig('showIntro', '0')
                    + '&language='+Cooky.getConfig('language', 'fr')
                    + '&backgroundColor='+Cooky.getConfig('user.bgColor', 'ffffff')
                    + '&fontColor='+Cooky.getConfig('user.fgColor', '000000')
                    + '&fontSize='+Cooky.getConfig('user.fontSize', '11px')
                    + '&fontFamily='+Cooky.getConfig('user.fontFamily', 'Montserrat');
                console.log(url);
                $el.after('<script src="'+url+'"></script>');
                // this.addScript(url);
                return 'OK';
            }); */
            /* this.html(function($el, service){
                function setOptOutText(element) {
                    console.log(element);
                    _paq.push([function(){
                        element.checked = !this.isUserOptedOut();
                    	
                        if ( this.isUserOptedOut() ){
                            element.querySelector("label").innerText = Cooky.lang.get('cook.matomo.optin');
                            // service.changeStatus(false);
                        }
                        else {
                            element.querySelector("label").innerText = Cooky.lang.get('cook.matomo.optout');
                            // service.changeStatus(true);
                        }
                    }]);
                }
            	
                var uniqId = ''; //'-' + Math.random().toString(36).substr(2, 9);
            	
                var optOut = document.getElementById("matomo-opt-out"+uniqId);
                console.log(optOut);
                if ( optOut ){
                    optOut.addEventListener("click", function(){
                        try {
                            this.checked ? _paq.push(['forgetUserOptOut']) : _paq.push(['optUserOut']);
                        } catch(e){}
                    	
                        setOptOutText(optOut);
                    });
                	
                    setOptOutText(optOut);
                }
            	
                var html = '<p>'+Cooky.lang.get('cook.matomo.message')+'</p>';
                html += '<form class="wide"><input type="checkbox" id="matomo-opt-out'+uniqId+'"> <label for="matomo-opt-out'+uniqId+'"></label></form>';
                return html;
            }); */
            /* this.html(function($el, service){
                // console.log(service);
                var frameUrl = 'https://'+Cooky.getConfig('service.matomo.cdn')+'/index.php?module=CoreAdminHome&action=optOut'
                    + '&div=matomo-opt-out'
                    + '&showIntro='+Cooky.getConfig('user.showIntro', '0')
                    + '&language='+Cooky.getConfig('language')
                    + '&backgroundColor='+Cooky.getConfig('user.bgColor', 'ffffff')
                    + '&fontColor='+Cooky.getConfig('user.fgColor', '000000')
                    + '&fontSize='+Cooky.getConfig('user.fontSize', '11px')
                    + '&fontFamily='+Cooky.getConfig('user.fontFamily', 'Montserrat');
            	
                $el.data("frameUrl", frameUrl);
                return service.frameHtml($el);
            }); */
            /* this.html(function($el, service){
                var url = 'https://'+Cooky.getConfig('service.matomo.cdn')+'/index.php?module=CoreAdminHome&action=optOutJS'
                    + '&div=matomo-opt-out'
                    + '&showIntro='+Cooky.getConfig('user.showIntro', '0')
                    + '&language='+Cooky.getConfig('language')
                    + '&backgroundColor='+Cooky.getConfig('user.bgColor', 'ffffff')
                    + '&fontColor='+Cooky.getConfig('user.fgColor', '000000')
                    + '&fontSize='+Cooky.getConfig('user.fontSize', '11px')
                    + '&fontFamily='+Cooky.getConfig('user.fontFamily', 'Montserrat');
            	
                console.log($el);
                console.log(url);
            	
                $el.after('<script src="'+url+'"></script>');
            	
                return 'OK';
            }); */
        }
    }

    getTranslations() {
        return {
            fr: {
                "matomo.details": "Matomo est l'alternative à Google Analytics qui protège les données et la vie privée des visiteurs.",
                "matomo.consent": "Ce cookie est utilisé pour stocker votre consentement.",
                "matomo.consentcookie": "Ce cookie peut être utilisé pour stocker votre consentement.",
                "matomo.noconsent": "Stocke votre refus de participer à l'amélioration de notre site.",
                "matomo.ignore": "Stocke votre refus de suivi",
                "matomo.message": "Vous pouvez vous opposer au suivi de votre navigation sur ce site web. Cela protégera votre vie privée, mais empêchera également le propriétaire d'apprendre de vos actions et de créer une meilleure expérience pour vous et les autres utilisateurs.",
                "matomo.optout": "Vous n'êtes pas exclu(e). Décochez cette case pour être exclu(e).",
                "matomo.optin": "Vous êtes exclu(e). Cochez cette case pour ne plus être exclu(e)."
            },
            en: {
                "matomo.details": "Matomo is the Google Analytics alternative that protects the data and visitors' privacy.",
                "matomo.consent": "This cookie can be used to store your consent.",
                "matomo.consentcookie": "This cookie can be used to store your consent.",
                "matomo.noconsent": "Stores the info in case you don't want to be tracked to improve this website.",
                "matomo.ignore": "Stored if you ask to not be tracked.",
                "matomo.message": "You may choose not to have a unique web analytics cookie identification number assigned to your computer to avoid the aggregation and analysis of data collected on this website. To make that choice, please click below to receive an opt-out cookie.",
                "matomo.optout": "You are not opted out. Uncheck this box to opt out.",
                "matomo.optin": "You are opted out. Check this box to opt back in."
            },
            it: {
                "matomo.details": "Matomo è l'alternativa a Google Analytics che protegge i dati e la privacy dei visitatori.",
                "matomo.consent": "Questo cookie può essere utilizzato per memorizzare il tuo consenso.",
                "matomo.consentcookie": "Questo cookie può essere utilizzato per memorizzare il tuo consenso.",
                "matomo.noconsent": "Memorizza il tuo rifiuto di partecipare al miglioramento del nostro sito.",
                "matomo.ignore": "Memorizzato se chiedi di non essere tracciato.",
                "matomo.message": "Puoi opporti al tracciamento della tua navigazione su questo sito web. Questo proteggerà la tua privacy, ma impedirà anche al proprietario di apprendere dalle tue azioni e di creare un'esperienza migliore per te e per gli altri utenti.",
                "matomo.optout": "Non sei escluso. Deseleziona questa casella per essere escluso.",
                "matomo.optin": "Sei escluso. Seleziona questa casella per non essere più escluso."
            },
            es: {
                "matomo.details": "Matomo es la alternativa a Google Analytics que protege los datos y la privacidad de los visitantes.",
                "matomo.consent": "Esta cookie se puede utilizar para almacenar su consentimiento.",
                "matomo.consentcookie": "Esta cookie se puede utilizar para almacenar su consentimiento.",
                "matomo.noconsent": "Almacena su negativa a participar en la mejora de nuestro sitio.",
                "matomo.ignore": "Se almacena si solicita no ser rastreado.",
                "matomo.message": "Puede oponerse al seguimiento de su navegación en este sitio web. Esto protegerá su privacidad, pero también evitará que el propietario aprenda de sus acciones y cree una mejor experiencia para usted y otros usuarios.",
                "matomo.optout": "No estás excluido. Desmarque esta casilla para ser excluido.",
                "matomo.optin": "Estás excluido. Marque esta casilla para dejar de ser excluido."
            }
        };
    }
};
