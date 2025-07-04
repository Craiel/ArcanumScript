// Storage Boost
(function($) {
    'use strict';

    class AEStorageBoost {
        constructor() {
            this.isApplied = false;
        }

        initialize(){
            if(AE.settings.data.storageBoostApplied === true){
                this.apply();
            }
        }

        update(delta) {
        }

        apply() {
            if(this.isApplied === true) {
                return;
            }

            this.isApplied = true;
            console.debug("Applying Storage Boost!")

            let gameData = unsafeWindow.game.gdata;
            for(let homeId in AE.data.HomeData) {
                let currentValue = gameData[homeId].mod.space.max.value;
                let boostedValue = (10 + currentValue) * 5;
                if(AE.config.enableDebugMode === true) {
                    console.log(homeId + ": " + currentValue + " -> " + boostedValue);
                }

                gameData[homeId].mod.space.max.value = boostedValue;
            }

            unsafeWindow.game.recalcSpace();

            let spaceData = unsafeWindow.game.state.getData("homes");
            for(let i = 0; i < spaceData.length; i++) {
                let data = spaceData[i];
                if(data.needORG === undefined) {
                    data.needORG = data.need;
                    data.need = function (t, o, _) {
                        // Disable this check
                        return true;
                    }
                }
            }
        }

        remove() {
            if(this.isApplied !== true) {
                return;
            }

            this.isApplied = false;
            console.debug("Removing Storage Boost!");

            let gameData = unsafeWindow.game.gdata;
            for(let homeId in AE.data.HomeData) {
                let currentValue = gameData[homeId].mod.space.max.value;
                let unboostedValue = (currentValue / 5) - 10;

                if(AE.config.enableDebugMode === true) {
                    console.log(homeId + ": " + currentValue + " -> " + unboostedValue);
                }

                gameData[homeId].mod.space.max.value = unboostedValue;
            }

            unsafeWindow.game.recalcSpace();

            let spaceData = unsafeWindow.game.state.getData("homes");
            for(let i = 0; i < spaceData.length; i++) {
                let data = spaceData[i];
                if(data.needORG !== undefined) {
                    data.needORG = data.need;
                    data.need = data.needORG;
                    data.needORG = undefined;
                }
            }
        }
    }

    AE.storageBoost = new AEStorageBoost();

})(window.jQuery);