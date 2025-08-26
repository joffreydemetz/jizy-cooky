# Cooky 

GDPR Cookie consent management

## Core files

- **Category.js**: Manages a category of services, allowing you to add, retrieve, and sort services within a category.
- **Language.js**: Handles language settings and translations for the UI, storing translation strings and locale info.
- **Plugin.js**: Base class for plugins, with methods to get translations and data (intended to be extended).
- **Service.js**: Represents a third-party service (like analytics or social media), with properties for cookies, details, icons, and consent management.
- **ServiceCookie.js**: Represents a cookie used by a service, with details like name, security, and duration.
- **Element.js**: Represents a UI element by ID, with methods to build and initialize elements, intended for subclassing.

See the source files in `lib/js/` for more details and implementation.

## Usage

Here is a basic example of how to use the main classes:

```js
import Category from './lib/js/Category.js';
import Service from './lib/js/Service.js';
import ServiceCookie from './lib/js/ServiceCookie.js';
import Language from './lib/js/Language.js';

// Create a new service
const analyticsService = new Service('analytics', 'Google Analytics');
analyticsService.cookies.push(new ServiceCookie({ name: 'ga', details: 'Google Analytics cookie', secure: true, duration: 3600 }));

// Create a category and add the service
const analyticsCategory = new Category('analytics');
analyticsCategory.addService(analyticsService);

// Create a language instance
const en = new Language('en', 'English', 'en_US');

console.log(analyticsCategory.getServices());
console.log(en.translations['alert.privacy']);
```