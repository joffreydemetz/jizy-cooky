import fs from 'fs';
import path from 'path';

import {
    LogMe,
    jPackConfig,
    generateLessVariablesFromConfig,
    deleteLessVariablesFile
} from 'jizy-packer';

function pluginClass(name) {
    const parts = name.split('.');
    parts.forEach((part, index) => {
        parts[index] = part.charAt(0).toUpperCase() + part.slice(1);
    });
    return parts.join('');
}

function availableLanguages() {
    const languagesDir = path.join(jPackConfig.get('basePath'), 'lib/js/languages');
    return fs.readdirSync(languagesDir)
        .filter(file => file.endsWith('.js'))
        .map(file => file.slice(0, -3));
}

function availableServices() {
    const servicesDir = path.join(jPackConfig.get('basePath'), 'lib/js/services');
    return fs.readdirSync(servicesDir)
        .filter(file => file.endsWith('.js'))
        .map(file => file.slice(0, -3));
}

function availablePlugins() {
    const pluginsDir = path.join(jPackConfig.get('basePath'), 'lib/js/plugins');
    return fs.readdirSync(pluginsDir)
        .filter(file => file.endsWith('.js'))
        .map(file => file.slice(0, -3));
}

const jPackData = function () {
    const lessBuildVariablesPath = path.join(jPackConfig.get('basePath'), 'lib/less/_variables.less');

    jPackConfig.sets({
        name: 'Cooky',
        alias: 'jizy-cooky',
        lessVariables: {
            desktopBreakpoint: '900px',
            cookyGreen: '#5cb85c',
            cookyBlue: '#5bc0de',
            cookyOrange: '#f0ad4e',
            cookyRed: '#d9534f',
            cookyGray: '#EEE',
            cookyDarkgray: '#999'
        },
        languages: [],
        services: [],
        plugins: [],
        defaults: {
            dontcare: true
        }
    });

    jPackConfig.set('onCheckConfig', () => {
        let services = jPackConfig.get('services');
        let plugins = jPackConfig.get('plugins');
        let languages = jPackConfig.get('languages');

        if (languages.length > 0) {
            const languagesOk = availableLanguages();
            languages = languages.filter(lang => languagesOk.includes(lang));
        }

        if (services.length > 0) {
            const servicesOk = availableServices();
            services = services.filter(service => servicesOk.includes(service));
        }

        if (plugins.length > 0) {
            const pluginsOk = availablePlugins();
            plugins = plugins.filter(plugin => pluginsOk.includes(plugin));
        }

        if (languages.length === 0) {
            languages = ['en', 'fr'];
        }

        // Ensure "core" is always the first service
        if (services && !services.includes('core')) {
            services.unshift('core');
        } else {
            // Move "core" to the first position if it already exists
            services = ['core', ...services.filter(service => service !== 'core')];
        }

        // Ensure "debug" and "devmode" are the first and second plugins if present
        const prioritizedPlugins = ['debug', 'devmode'];
        plugins = [
            ...prioritizedPlugins.filter(plugin => plugins.includes(plugin)), // Add prioritized plugins in order
            ...plugins.filter(plugin => !prioritizedPlugins.includes(plugin)) // Add the rest of the plugins
        ];

        languages = [...new Set(languages)];
        services = [...new Set(services)];
        plugins = [...new Set(plugins)];

        jPackConfig.set('languages', languages);
        jPackConfig.set('services', services);
        jPackConfig.set('plugins', plugins);
    });

    jPackConfig.set('onGenerateBuildJs', (code) => {
        LogMe.log('Build lib/less/_variables.less');
        const lessVariables = jPackConfig.get('lessVariables') ?? {};
        const lessOriginalVariablesPath = path.join(jPackConfig.get('basePath'), 'lib', 'less', 'variables.less');
        generateLessVariablesFromConfig(lessOriginalVariablesPath, lessBuildVariablesPath, lessVariables);

        const services = jPackConfig.get('services');
        const languages = jPackConfig.get('languages');
        const plugins = jPackConfig.get('plugins');
        const defaults = jPackConfig.get('defaults');
        const importPrefix = jPackConfig.get('importPrefix');

        const flagsImports = languages
            .map((language) => `import '${importPrefix}lib/images/flags__${language}.png';`)
            .join('\n');

        const languagesImports = languages
            .map((language) => {
                const ClassName = pluginClass(language);
                return `import ${ClassName} from '${importPrefix}lib/js/languages/${language}.js';`
                    + "\n"
                    + `Core.addLanguage(new ${ClassName}());`;
            })
            .join('\n');

        const servicesImports = services
            .map((service) => {
                const ClassName = pluginClass(service);
                const filename = service.toLowerCase();
                return `import ${ClassName}Service from '${importPrefix}lib/js/services/${filename}.js';`
                    + "\n"
                    + `Core.addService(new ${ClassName}Service());`;
            })
            .join('\n');

        const pluginsImports = plugins
            .map((plugin) => {
                const ClassName = pluginClass(plugin);
                const filename = plugin.toLowerCase();
                return `import ${ClassName} from '${importPrefix}lib/js/plugins/${filename}.js';`
                    + "\n"
                    + `Core.addPlugin(new ${ClassName}());`;
            })
            .join('\n');

        const setDefaults = defaults
            ? 'Core.updateConfig(' + JSON.stringify(defaults, null, 4) + ');'
            : '';

        return code
            .replace(/{{FLAGS}}/g, flagsImports)
            .replace(/{{SERVICES}}/g, servicesImports)
            .replace(/{{LANGUAGES}}/g, languagesImports)
            .replace(/{{PLUGINS}}/g, pluginsImports)
            .replace(/{{CONFIG}}/g, setDefaults);
    });

    jPackConfig.set('onGenerateWrappedJs', (wrapped) => wrapped);

    jPackConfig.set('onPacked', () => {
        deleteLessVariablesFile(lessBuildVariablesPath);

        // create flags directory if it doesn't exist
        if (!fs.existsSync(jPackConfig.get('targetPath') + '/images/flags')) {
            fs.mkdirSync(jPackConfig.get('targetPath') + '/images/flags', { recursive: true });
        }

        // Move flag images from images directory to flags directory
        fs.readdirSync(jPackConfig.get('targetPath') + '/images').forEach(file => {
            if (file.startsWith('flags__') && file.endsWith('.png')) {
                const newFileName = file.replace('flags__', '');
                fs.renameSync(
                    `${jPackConfig.get('targetPath')}/images/${file}`,
                    `${jPackConfig.get('targetPath')}/images/flags/${newFileName}`
                );
            }
        });
    });
};

export default jPackData;

