import Plugin from "../Plugin.js";
import Cooky from "../Cooky.js";
import Core from "../Core.js";
import Config from "../Config.js";

export default class DebugPlugin extends Plugin {
    constructor() {
        super();

        Config.set('check', true);
        
        Cooky.getConfig = () => Core.getConfig();
        Cooky.getServiceStore = () => Core.serviceStore;
        Cooky.getLanguageStore = () => Core.languageStore;
    }
};
