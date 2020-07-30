// ==UserScript==
// @name         Arcanum Enhancements
// @version      2020.0.8.1
// @author       Craiel
// @description  Automation
// @updateURL    https://github.com/Craiel/ArcanumScript/raw/master/ArcanumEnhancements.user.js
// @downloadURL  https://github.com/Craiel/ArcanumScript/raw/master/ArcanumEnhancements.user.js
// @match        http://www.lerpinglemur.com/arcanum/*
// @match        https://www.lerpinglemur.com/arcanum/*
// @match        http://game312933.konggames.com/gamez/0031/2933/*
// @match        https://game312933.konggames.com/gamez/0031/2933/*
// @match        https://www.kongregate.com/games/lerpinglemur/theory-of-magic/*
// @match        http://www.kongregate.com/games/lerpinglemur/theory-of-magic/*
// @match        http://shokkuno.gitlab.io/arcanum/
// @match        https://shokkuno.gitlab.io/arcanum/
// @match        http://localhost:8080/dev/
// @run-at       document-idle
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// ==/UserScript==

// Game Addresses:
// https://www.lerpinglemur.com/arcanum/index.html
// https://game312933.konggames.com/gamez/0031/2933/live/index.html

let AE = (function($){
    'use strict';

    class AE {
        log(msg){
            console.log("ATM: " + msg);
        }
    }

    return new AE();
})(window.jQuery);