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
                console.log(homeId + ": " + currentValue + " -> " + boostedValue);
                gameData[homeId].mod.space.max.value = boostedValue;
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
                console.log(homeId + ": " + currentValue + " -> " + unboostedValue);
                gameData[homeId].mod.space.max.value = unboostedValue;
            }
        }
    }

    AE.storageBoost = new AEStorageBoost();

})(window.jQuery);