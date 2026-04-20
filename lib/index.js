import Core from './js/Core.js';
import Cooky from './js/Cooky.js';

import En from './js/languages/en.js';
Core.addLanguage(new En());

import Fr from './js/languages/fr.js';
Core.addLanguage(new Fr());

// import Es from './js/languages/es.js';
// Core.addLanguage(new Es());

// import It from './js/languages/it.js';
// Core.addLanguage(new It());

import CoreService from './js/services/core.js';
Core.addService(new CoreService());

import CorePhpSessionPlugin from './js/plugins/core.phpsession.js';
Core.addPlugin('core', new CorePhpSessionPlugin());

export {
    Core,
    Cooky
};

export default Cooky;