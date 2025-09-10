# Cooky 

Cooky is a simple and extensible GDPR Cookie consent management tool.

## How it works

The consent manager displays an alert if user consent is needed for non-technical (third-party) cookies. If only technical cookies are present, the alert is not shown. However, the consent manager interface can always be accessed by the user for informational purposes, even if no consent is required.

## Build

The Cooky object is added to the global `window` object when the script is loaded. You can also import the classes individually if you are using a module bundler.

## Usage 

See example files in `example/` for practical usage.

## Useful methods

It is easy to interact with the Cooky manager programmatically. Here are some useful methods:
- `Cooky.init(options)`: Initialize the Cooky manager with optional configuration
- `Cooky.config(config)`: Update the Cooky configuration
- `Cooky.show()`: Show the Cooky manager interface
- `Cooky.hide()`: Hide the Cooky manager interface

When using the devmode Plugin you can also use:
- `Cooky.addCategory(category)`: Add a new Category
- `Cooky.addLanguage(language)`: Add a new Language
- `Cooky.addService(service)`: Add a new Service
- `Cooky.addPlugin(plugin)`: Add a new Plugin
- `Cooky.addTranslations(code, translations)`: Add new translations for a language code
- `Cooky.appendTranslations(translations)`: Append translations for multiple languages
- `Cooky.appendServiceData(serviceId, data)`: Append data to an existing Service
- `Cooky.appendServiceCookies(serviceId, cookies)`: Append cookies to an existing Service

## Events

The following custom events are dispatched on the `document` object:
- `cooky.show`: Show the consent manager interface
- `cooky.hide`: Hide the consent manager interface
- `cooky.translate`: Translate the consent manager interface. The event detail contains the `code` of the new language.
- `cooky.respond.all`: Triggered when the user responds to all services (accept or reject). The event detail contains `accept` (boolean) and optional `timeout` (ms before reload).
- `cooky.respond.one`: Triggered when the user responds to a single service (accept or reject). The event detail contains `accept` (boolean), `serviceId` (string), and optional `timeout` (ms before reload).

An `Observer` checks for DOM changes.
For example adding `class="cooky-needs-consent"` to the body, triggers the consent manager.
