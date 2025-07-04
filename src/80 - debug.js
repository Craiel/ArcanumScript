// Debug
(function($) {
    'use strict';

    class AEDebug {
        constructor() {
        }

        load() {
            let parent = $('div.quickbar');
            if(parent.length === 0) {
                return;
            }

            let button = $('<button id="at_Debug_btn" style="margin-left: auto;">Debug</button>');
            button.click(this.printDebugInfo);
            parent.append(button);
        }

        printDebugInfo() {
            console.log(unsafeWindow.game);
            console.log(AE.damageMeter.combatStats);
        }
    }

    AE.debug = new AEDebug();

})(window.jQuery);