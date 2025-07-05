// Loader
(function($) {
    'use strict';

    class AELoader {
        load() {
            this.checkForOtherScripts();

            AE.settings.load();
            AE.pageUtils.checkData();
            AE.playerState.initialize();
            AE.storageBoost.initialize();

            this.checkVersion();

            this.loadHtmlModifications();

            AE.interval.add(this.reloadCheck.bind(this), 2000);

            AE.interval.add(AE.pageStyle.update.bind(AE.pageStyle), AE.config.uiUpdateInterval);

            AE.interval.add(AE.playerState.update.bind(AE.playerState), AE.config.minUpdateInterval);
            AE.interval.add(AE.storageBoost.update.bind(AE.playerState), AE.config.minUpdateInterval);

            AE.interval.add(AE.tabStyle.update.bind(AE.tabStyle), AE.config.uiUpdateInterval);

            AE.interval.add(AE.tabStyleMain.updateUI.bind(AE.tabStyleMain), AE.config.uiUpdateInterval);
            AE.interval.add(AE.tabStyleMain.updateAutomation.bind(AE.tabStyleMain), 125);

            AE.interval.add(AE.tabStyleEnchant.updateUI.bind(AE.tabStyleEnchant), AE.config.uiUpdateInterval);

            AE.interval.add(AE.tabStyleEquip.updateUI.bind(AE.tabStyleEquip), AE.config.uiUpdateInterval);
            AE.interval.add(AE.tabStyleLoot.updateUI.bind(AE.tabStyleLoot), AE.config.uiUpdateInterval);
            AE.interval.add(AE.tabStyleAdventure.updateUI.bind(AE.tabStyleAdventure), AE.config.uiUpdateInterval);
            AE.interval.add(AE.tabStyleHome.updateUI.bind(AE.tabStyleHome), AE.config.uiUpdateInterval);

            //AE.interval.add(AE.sanctum.update.bind(AE.sanctum), AE.config.minUpdateInterval);
            //AE.interval.add(AE.sanctum.updateUI.bind(AE.sanctum), AE.config.uiUpdateInterval);

            if(AE.config.arcanumAutomationPresent !== true) {
                AE.interval.add(AE.quickSlots.update.bind(AE.quickSlots), AE.config.minUpdateInterval);
            }

            AE.interval.add(AE.damageMeter.update.bind(AE.damageMeter), AE.config.minUpdateInterval);
            AE.interval.add(AE.damageMeter.updateUI.bind(AE.damageMeter), 1000);
        }

        checkVersion() {
            let versionSpan = $('span.vers');
            if(versionSpan.length === 0){
                console.warn("Missing Version Tag");
                return;
            }

            let rawText = versionSpan.text().trim();
            for(let i = 0; i < AE.data.ValidGameVersions.length; i++){
                let specialVersion = AE.data.ValidGameVersions[i];
                if(rawText === specialVersion){
                    console.log("Detected Game Version: '" + rawText + "'");
                    return;
                }
            }

            console.warn("Unknown Version: " + rawText);
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