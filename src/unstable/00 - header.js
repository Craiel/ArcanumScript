// ==UserScript==
// @name         Arcanum Enhancements unstable
// @version      2025.0.12.2.38
// @author       Craiel
// @description  Automation
// @updateURL    https://github.com/Craiel/ArcanumScript/raw/master/ArcanumEnhancements.user.unstable.js
// @downloadURL  https://github.com/Craiel/ArcanumScript/raw/master/ArcanumEnhancements.user.unstable.js
// @match        https://arcanumtesting.gitlab.io/arcanum/
// @match        http://localhost:8080/dev/
// @run-at       document-idle
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// ==/UserScript==

// Game Address:
// https://arcanumtesting.gitlab.io/arcanum/

let AE = (function($){
    'use strict';

    class AE {
        log(msg){
            console.log("ATM: " + msg);
        }
    }

    return new AE();
})(window.jQuery);