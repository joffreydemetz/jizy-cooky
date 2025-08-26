/*! Cooky v@VERSION | @DATE | [@BUNDLE] */
(function (global) {
    "use strict";

    if (typeof global !== "object" || !global || !global.document) {
        throw new Error("Cooky requires a window and a document");
    }

    if (typeof global.Cooky !== "undefined") {
        throw new Error("Cooky is already defined");
    }

    // @CODE 

    global.Cooky = Cooky;

})(typeof window !== "undefined" ? window : this);