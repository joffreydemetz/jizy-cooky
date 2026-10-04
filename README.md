# Cooky

Cooky is a simple and extensible GDPR cookie consent manager.

## How it works

The consent manager displays an alert if user consent is needed for non-technical (third-party) cookies. If only technical cookies are present, the alert is not shown. However, the consent manager interface can always be accessed by the user for informational purposes, even if no consent is required.

Each third-party integration is a **service** (id, category, cookies, the script to load once allowed,
the fallback to run while it is not). Services are grouped in **categories** (`technical`, `api`,
`analytic`, `social`, `video`, `ads`, `comment`, `support`, `other`). The visitor's choices are stored
in the `jizy_cooky` cookie.

## Installation

```sh
npm install jizy-cooky
```

| Entry | What |
|---|---|
| `dist/js/jizy-cooky.min.js` | Browser bundle, sets the global `window.Cooky`. Built with the English and French languages and the `core` service. |
| `dist/css/jizy-cooky.min.css` | Styles; loads `dist/fonts/` and `dist/images/flags/` through relative URLs, so keep the three folders side by side. |
| `lib/index.js` | ESM entry: default export `Cooky`, named exports `{ Core, Cooky }`. Registers the English and French languages, the `core` service and the `core.phpsession` plugin. |

## Usage

```html
<link rel="stylesheet" href="/jizy-cooky/css/jizy-cooky.min.css">
<script src="/jizy-cooky/js/jizy-cooky.min.js"></script>
<script>
    Cooky.appendServiceData('core', { name: 'My site', uri: '/legal-notice' });
    Cooky.config({ defaultLanguage: 'fr', refuseAll: true });
    Cooky.check();

    document.addEventListener('DOMContentLoaded', () => Cooky.ready());
</script>

<a href="#" onclick="document.dispatchEvent(new CustomEvent('cooky.show', { detail: { from: 'menu' } })); return false;">Cookie settings</a>
```

Boot in that order: register or adjust services and plugins, `config()`, `check()`, then `ready()`
once the DOM is parsed. `ready()` builds the alert (`#cooky`) and the manager modal (`#cookyModal`),
reads the stored choices, runs each service, and shows the alert when a choice is pending. After
`ready()`, `config()` and `check()` are no-ops.

`run(config)` chains `config()` and `check()`, then runs `ready()` — at once when the DOM is already
parsed, else on `DOMContentLoaded` (before 2.1.19 it marked the library as loaded first, so the deferred
`ready()` returned early and the banner never showed).

## Configuration

`Cooky.config({...})` sets any of these keys (unknown keys and wrong types are ignored):

| Key | Default | Notes |
|---|---|---|
| `defaultLanguage` | `'en'` | Must be a registered language. |
| `navigatorLanguage` | `true` | When the browser language is registered, it replaces `defaultLanguage`. |
| `refuseAll` | `false` | Adds a "Refuse all" button to the alert. |
| `dontcare` | `false` | Adds a "Continue without accepting" link to the alert (`true` in the browser bundle). |
| `noAdBlocker`, `adBlocker` | `false` | When both are true, the alert asks the visitor to disable their ad blocker. |
| `service` | `{}` | Per-service settings, e.g. `{ matomo: { id: 1, host: 'stats.example.com' } }`. |

When the page already contains a `#cooky` element, Cooky uses that markup instead of building its
own, and reads its `data-cooky-*` attributes (or a JSON `data-cooky-config` attribute) as extra
configuration.

## API

The registration methods live on `Core` (the stores); `Cooky` proxies them, so in the browser bundle
call them on `Cooky`:

- `addLanguage(language)` — register a `Language`.
- `addTranslations(code, translations)` — merge translations into one registered language.
- `appendTranslations({ fr: {...}, en: {...} })` — merge translations into several languages.
- `addService(service)` — register a `Service` (its own translations are merged in).
- `addPlugin(serviceId, plugin)` — apply a `Plugin`'s data (cookies, …) and translations to a registered service.
- `appendServiceData(serviceId, data)` — update a service: `name`, `uri`, `required`, `js`, `fallback`, `cookies`, `classes`, `mandatory`.
- `addCategory(category)` — register a category (the built-in ones are created by `check()`).

`Cooky` only:

- `appendServiceCookies(serviceId, cookies)`, `updateServiceCookie(serviceId, name, key, value)`.
- `config(config)`, `check()`, `ready()`, `run(config)` — see Usage.
- `show()` / `hide()` — open or close the manager modal.
- `translate()` — re-apply the current language to the alert and the modal.
- `getName()`, `isLoaded()`.

Set `Cooky.debugMode = true` to log configuration errors.

## Services, plugins and languages

Shipped under `lib/js/`, and selectable for a custom build (see Build):

- services: `core` (always included), `matomo` (needs `service.matomo.id` and `service.matomo.host`),
  `googlefonts`, `hcaptcha`, `ovh`, `trustpilot`, `avisverifies`;
- plugins for the `core` service: `core.phpsession`, `core.i18n`, `core.remember`, `core.cart`
  (each declares a technical cookie);
- languages: `en`, `fr`, `es`, `it`.

## Events

The following custom events are listened to on `document`, with an optional `detail` object:

- `cooky.show` (`{ from }`) — open the manager modal.
- `cooky.hide` (`{ from }`) — close it.
- `cooky.translate` (`{ code }`) — switch to a registered language.
- `cooky.respond.all` (`{ accept, timeout }`) — accept or refuse every optional service, then reload the page after `timeout` ms (default 1000).
- `cooky.respond.one` (`{ accept, serviceId }`) — accept or refuse one service; when its status changed, closing the modal reloads the page.

A `MutationObserver` watches the body classes: adding `cooky-needs-consent` to the `<body>` shows
the alert. The body gets `cm-open` while the modal is open.

## Theming

Override these custom properties at `:root`, in a stylesheet loaded after this one:
`--jizy-cooky-green`, `--jizy-cooky-blue`, `--jizy-cooky-orange`, `--jizy-cooky-red`,
`--jizy-cooky-gray`, `--jizy-cooky-darkgray` (with `--jizy-cooky-darkgray-translucent`, its 20%
`rgba()` form), `--jizy-cooky-layer` (z-index), and the flags `--jizy-cooky-flag-<code>`.

The font path is the LESS variable `@FONT_PATH` (CSS variables do not work in `@font-face`), so
serving the fonts from another path takes a custom build.

## Build

```sh
npm run jpack:dist          # rebuild dist/ (en + fr, core service; dist/ is committed)
npm run export <name>       # build exports/<name>/ from exports/<name>/cooky.config.json
npm run export:all          # build every exports/*/cooky.config.json
```

An export config selects what goes in the bundle:

```json
{
    "languages": ["fr", "en"],
    "services": ["matomo"],
    "plugins": ["core.phpsession"],
    "defaults": { "dontcare": true, "defaultLanguage": "fr" }
}
```

`core` is always added first; `defaults` are applied with `Core.updateConfig()` when the bundle
loads. `exports/` is not versioned.

## Tests

```sh
npm test                    # vitest (happy-dom)
npm run test:watch
npm run test:coverage
```

## License

MIT — see [LICENSE](LICENSE).
