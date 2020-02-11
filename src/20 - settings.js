// Settings
(function($) {
    'use strict';

    const SettingsSaveKey = "at_settings";
    const SettingsVersion = 2;

    class AESettings {

        constructor() {
            this.data = {
                version: SettingsVersion,
                quickSlotTimes: [],
                quickSlotEnabled: [],
                quickSlotPresets: {},
                quickSlotPresetNames: {},
                mainScreenAlternateDisplay: false,
                enchantScreenGroupedDisplay: false,
                gameVersion: undefined
            };
        }

        initializeSettings(target){
            if(target.quickSlotEnabled === undefined){
                target.quickSlotEnabled = [];
            }

            if(target.quickSlotTimes === undefined) {
                target.quickSlotTimes = [];
            }

            if(this.data.quickSlotPresets === undefined) {
                this.data.quickSlotPresets = {};
            }

            if(this.data.quickSlotPresetNames === undefined) {
                this.data.quickSlotPresetNames = {};
            }

            for(let i = 0; i < AE.config.quickSlotCount; i++) {
                if(i === target.quickSlotTimes.length) {
                    target.quickSlotTimes.push(undefined);
                }

                if(target.quickSlotTimes[i] === null) {
                    target.quickSlotTimes[i] = undefined;
                }

                if(i === target.quickSlotEnabled.length) {
                    target.quickSlotEnabled.push(true);
                }
            }

            if(target.mainScreenAlternateDisplay === undefined) {
                target.mainScreenAlternateDisplay = false;
            }

            target.version = SettingsVersion;
        }

        save() {
            localStorage.setItem(SettingsSaveKey, JSON.stringify(this.data));
        }

        load() {
            let data = localStorage.getItem(SettingsSaveKey);
            if(data === undefined || data === null){
                return;
            }

            AE.log("Loading Settings...");
            let newSettings = JSON.parse(data);
            if(newSettings === undefined || newSettings === null){
                return;
            }

            this.initializeSettings(newSettings);
            this.data = newSettings;
            AE.log("Done");
        }
    }

    AE.settings = new AESettings();

})(window.jQuery);