// Loader
(function($) {
    'use strict';

    class AELoader {
        load() {
            this.checkForOtherScripts();

            AE.settings.load();
            AE.pageUtils.checkData();
            AE.playerState.initialize();

            this.loadHtmlModifications();

            AE.interval.add(this.reloadCheck.bind(this), 2000);
            AE.interval.add(AE.pageStyle.update.bind(AE.pageStyle), AE.config.uiUpdateInterval);
            AE.interval.add(AE.playerState.update.bind(AE.playerState), AE.config.minUpdateInterval);
            AE.interval.add(AE.tabStyle.update.bind(AE.tabStyle), AE.config.uiUpdateInterval);
            AE.interval.add(AE.imbueGemShortcut.update.bind(AE.imbueGemShortcut), AE.config.uiUpdateInterval);

            if(AE.config.arcanumAutomationPresent !== true) {
                AE.interval.add(AE.quickSlots.update.bind(AE.quickSlots), AE.config.minUpdateInterval);
            }

            AE.interval.add(AE.damageMeter.update.bind(AE.damageMeter), 250);
        }

        checkForOtherScripts() {
            let arcanumAutomationConfig = $('#automate_config');
            if(arcanumAutomationConfig.length === 1) {
                AE.log("Arcanum Automation Script Detected, disabling some features!");
                AE.config.arcanumAutomationPresent = true;
            }
        }

        loadHtmlModifications() {
            if(AE.config.arcanumAutomationPresent !== true) {
                AE.quickSlots.load();
            }

            AE.damageMeter.load();
            AE.saveUtils.load();

            if (AE.config.enableDebugMode === true) {
                AE.debug.load();
            }

            let reloadCheckElement = $('<div id="at_reload_check" style="display: none"/>');
            $('div.top-bar').append(reloadCheckElement);
        }

        reloadCheck() {
            let el = $('#at_reload_check');
            if(el.length === 0) {
                AE.log("Reload Required, page state changed");
                AE.playerState.initialize();
                this.loadHtmlModifications();
            }
        }
    }

    AE.loader = new AELoader();

})(window.jQuery);