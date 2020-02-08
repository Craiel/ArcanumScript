// Loader
(function($) {
    'use strict';

    const VersionRegex = /.*build#\s*([0-9]+)/i;

    class AELoader {
        load() {
            this.checkForOtherScripts();

            AE.settings.load();
            AE.pageUtils.checkData();
            AE.playerState.initialize();

            this.checkVersion();

            this.loadHtmlModifications();

            AE.interval.add(this.reloadCheck.bind(this), 2000);

            AE.interval.add(AE.pageStyle.update.bind(AE.pageStyle), AE.config.uiUpdateInterval);

            AE.interval.add(AE.playerState.update.bind(AE.playerState), AE.config.minUpdateInterval);

            AE.interval.add(AE.tabStyle.update.bind(AE.tabStyle), AE.config.uiUpdateInterval);

            AE.interval.add(AE.tabStyleMain.updateUI.bind(AE.tabStyleMain), AE.config.uiUpdateInterval);
            AE.interval.add(AE.tabStyleMain.updateAutomation.bind(AE.tabStyleMain), 250);

            if(AE.config.arcanumAutomationPresent !== true) {
                AE.interval.add(AE.quickSlots.update.bind(AE.quickSlots), AE.config.minUpdateInterval);
            }

            AE.interval.add(AE.damageMeter.update.bind(AE.damageMeter), 250);
        }

        checkVersion() {
            let versionSpan = $('span.vers');
            if(versionSpan.length === 0){
                console.warn("Missing Version Tag");
                return;
            }

            let rawText = versionSpan.text();
            let parse = VersionRegex.exec(rawText);
            if(parse === undefined || parse === null || parse.length !== 2) {
                console.warn("Unknown Version: " + rawText);
                return;
            }

            let version = parseInt(parse[1]);
            if(AE.settings.data.gameVersion === version){
                // Same version
                return;
            }

            if(AE.settings.data.gameVersion !== undefined){
                // Version has changed, check how
                if(AE.settings.data.gameVersion > version){
                    console.error("Game version degraded, was " + AE.settings.data.gameVersion + " now at " + version);
                } else {
                    AE.log("Game Version updated, was " + AE.settings.data.gameVersion + " now at " + version)
                }
            } else {
                // First time start
                AE.log("Game version initialized to " + version);
            }

            AE.settings.data.gameVersion = version;
            AE.settings.save();

            if(version < AE.data.gameVersionOutdatedThreshold) {
                alert("You are running a very old version of the game: " + version + " latest should be " + AE.data.gameVersionKongregate + " or higher\n\n • Recommended version to play is 'Theory of Magic on Kongregate'");
            }
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