// Debug
(function($) {
    'use strict';

    class AETabStyleEquip {
        constructor() {
            this.resetState();
        }

        resetState() {
        }

        updateUI() {
            if(AE.playerState.activeTab !== AE.data.GameTabs.Equip) {
                this.resetState();
                return;
            }

            AE.pageUtils.updateInventorySubContent({compareEquip: true});
            AE.pageUtils.updateItemPopup();

            let equipRoot = $('div.equip');
            equipRoot.css("grid-template-columns", "repeat( auto-fill, minmax(18rem,1fr))");

            // Process equipped items
            AE.playerState.clearEquippedItems();

            $('div.equip').find('div.equip-slot').each(function() {
                let slotName = $(this).find('.slot-name').text().replace(':', '').trim().toLowerCase();
                $(this).find('.slot-item').each(function() {
                    let slot = $(this);
                    let nameSpan = slot.find('span.item-name');
                    if(nameSpan.length === 0) {
                        return;
                    }

                    let name = nameSpan.text();
                    let properties = AE.itemUtils.processItemEntry($(this), name, nameSpan);

                    if(properties !== undefined && properties.itemSlot !== undefined) {
                        let itemSlot = properties.itemSlot[0];
                        if(properties.itemSlot.length > 1) {
                            for(let i = 0; i < properties.itemSlot.length; i++){
                                if(properties.itemSlot[i] === slotName) {
                                    itemSlot = properties.itemSlot[i];
                                    break;
                                }
                            }
                        }

                        AE.playerState.registerEquippedItem(itemSlot, properties);
                    }
                });
            });
        }
    }

    AE.tabStyleEquip = new AETabStyleEquip();

})(window.jQuery);