(function () {

    console.log('init Cooky');
    console.dir(Cooky);

    Cooky.appendServiceData("core", {
        "name": "JiZy Platform",
        "uri": "https://jizy-platform.com/rgpd/"
    });

    // cooky.session
    // This cookie is used to store the session ID of the user.
    // It is set to expire when the user closes their browser.
    // The cookie is secure, meaning it will only be sent over HTTPS connections.
    // The cookie is HTTP only, meaning it cannot be accessed via JavaScript.
    Cooky.appendServiceCookies('core', [
        {
            name: 'PHPSESSID',
            duration: 'browser',
            secure: true,
            details: 'phpsessid.details'
        },
    ]);

    Cooky.appendTranslations({
        fr: {
            "phpsessid.details": "Cookie de session du site. Il permet la sauvegarde de votre identifiant de session.",
        },
        en: {
            "phpsessid.details": "Site session cookie. It allows the saving of your session identifier.",
        },
        it: {
            "phpsessid.details": "Cookie di sessione del sito. Consente il salvataggio dell'identificatore di sessione.",
        },
        es: {
            "phpsessid.details": "Cookie de sesión del sitio. Guarda su ID de sesión.",
        }
    });

    // cooky.user
    // This cookie is used to remember the user's login information when they check the "Stay logged in" box on the login form. 
    // The data is encrypted for security purposes.
    // It is set to expire after 365 days.
    // The cookie is secure, meaning it will only be sent over HTTPS connections.
    Cooky.appendServiceCookies('core', [
        {
            "name": "*** (32 chars)",
            "duration": 365 * 24 * 60 * 60,
            "secure": true,
            "details": "jizy.remember"
        }
    ]);

    Cooky.appendTranslations({
        "fr": {
            "jizy.remember": "Contient vos informations de connexion lorsque vous cochez la case \"Rester connecté\" dans le formulaire de connexion. Les données y sont cryptées."
        },
        "en": {
            "jizy.remember": "Contains your user information if you check the \"Stay logged\" box when logging in. The data is encrypted there."
        },
        "it": {
            "jizy.remember": "Contiene le informazioni di login quando si seleziona la box \"Essere connessi\" nel form di login. I dati sono crittografati lì."
        },
        "es": {
            "jizy.remember": "Contiene su información de inicio de sesión cuando marca la casilla \"Permanecer conectado\" en el formulario de inicio de sesión. Los datos están encriptados allí."
        }
    });

    // cooky.i18n
    // This cookie is used to store the user's language preference. 
    // It is set to expire after 365 days.
    Cooky.appendServiceCookies('core', [
        {
            "name": "language",
            "duration": 365 * 24 * 60 * 60,
            "details": "jizy.language"
        }
    ]);

    Cooky.appendTranslations({
        "fr": {
            "jizy.language": "Contient la langue de l'utilisateur."
        },
        "en": {
            "jizy.language": "Contains the user's language."
        },
        "it": {
            "jizy.language": "Contiene la lingua dell'utente."
        },
        "es": {
            "jizy.language": "Contiene el idioma del usuario."
        }
    });

    // cooky.cart
    // This cookie is used to store the unique identifier of the user's cart. 
    // It is set to expire after 7 days.
    Cooky.appendServiceCookies('core', [
        {
            "name": "cart",
            "duration": 7 * 24 * 60 * 60,
            "details": "jizy.cart"
        }
    ]);

    Cooky.appendTranslations({
        "fr": {
            "jizy.cart": "Contient l'identifiant unique de votre panier."
        },
        "en": {
            "jizy.cart": "Contains the unique identifier of your cart."
        },
        "it": {
            "jizy.cart": "Contiene l'identificatore univoco del carrello."
        },
        "es": {
            "jizy.cart": "Contiene el identificador único de su carrito de compras."
        }
    });

    Cooky.config({
        defaultLanguage: 'en'
    });
    Cooky.check();

    document.addEventListener('DOMContentLoaded', () => {
        console.log('load Cooky');
        Cooky.ready();
    });

})();

// other way to trigger the cooky manager
document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".cooky-show").forEach((el) => {
        el.addEventListener("click", (e) => {
            e.preventDefault();
            const event = new CustomEvent("cooky.show", { detail: { from: 'menu' } });
            document.dispatchEvent(event);
        });
    });
});

