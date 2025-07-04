// TabStyle - Home
(function($) {
    'use strict';

    class AETabStyleHome {
        constructor() {
            this.resetState();
        }

        resetState() {
        }

        updateUI(delta) {
            if(AE.playerState.activeTab !== AE.data.GameTabs.Home
                && AE.playerState.activeTab != AE.data.GameTabs.Furniture
                && AE.playerState.activeTab != AE.data.GameTabs.Converters) {
                this.resetState();
                return;
            }

            this.updateHomeSelectionPopup();

            this.buildBoostToggle();
        }

        buildBoostToggle(){
            let toggle = $('#at_toggle_storage_boost');
            if(toggle.length !== 0){
                // Already built
                return;
            }

            let root = $('div.pick-slots');
            if(root.length === 0){
                console.error("could not create storage boost toggle, root element not found")
                return;
            }

            let optionToggleView = AE.utils.createOptionsToggle("at_toggle_storage_boost", "Toggle Storage Boost", this.onToggleStorageBoost.bind(this), AE.settings.data.storageBoostApplied);
            root.append(optionToggleView);
        }

        onToggleStorageBoost(checked) {
            if(AE.settings.data.storageBoostApplied !== checked) {
                // Update the settings
                AE.settings.data.storageBoostApplied = checked;
                AE.settings.save();
            }

            if(checked === true){
                AE.storageBoost.apply();
            } else {
                AE.storageBoost.remove();
            }
        }

        updateHomeSelectionPopup() {
            let root = $('div.popup');
            if(root.length === 0) {
                return;
            }

            root.find('button.task-btn').each(function() {
                let button = $(this);
                let buttonText = button.text().toLowerCase();
                if(buttonText.includes('(')) {
                    return;
                }

                let homeKey = undefined;
                for(let name in AE.data.HomeNameLookup) {
                    if(buttonText.toLowerCase().includes(name)) {
                        homeKey = AE.data.HomeNameLookup[name];
                        break;
                    }
                }

                if(homeKey === undefined) {
                    return;
                }

                let homeSize = AE.data.HomeData[homeKey].size;
                if(AE.settings.data.storageBoostApplied === true) {
                    homeSize = (10 + homeSize) * 5;
                }

                button.text(buttonText + ' (' + homeSize + ')')
            });
        }
    }

    AE.tabStyleHome = new AETabStyleHome();

})(window.jQuery);