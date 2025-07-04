// TabStyle - Equip
(function($) {
    'use strict';

    class AETabStyleLoot {
        constructor() {
            this.resetState();
        }

        resetState() {
        }

        updateUI() {
            if(AE.playerState.activeTab !== AE.data.GameTabs.Loot) {
                this.resetState();
                return;
            }

            AE.pageUtils.updateInventorySubContent({compareEquip: true});
            AE.pageUtils.updateItemPopup();
        }
    }

    AE.tabStyleLoot = new AETabStyleLoot();

})(window.jQuery);