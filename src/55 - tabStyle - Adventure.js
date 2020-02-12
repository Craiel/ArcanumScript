// TabStyle - Adventure
(function($) {
    'use strict';

    class AETabStyleAdventure {
        constructor() {
            this.resetState();
        }

        resetState() {
        }

        updateUI() {
            if(AE.playerState.activeTab !== AE.data.GameTabs.Adventure) {
                this.resetState();
                return;
            }

            let root = $('div.adventure');
            if(root.length === 0){
                return;
            }

            let raid = root.find('div.raid-bottom');
            if(raid.length === 0){
                return;
            }

            AE.pageUtils.updateInventorySubContent({removeEquip: true, compareEquip: true, addSellJunkButton: true});
            AE.pageUtils.updateItemPopup();

            this.updateDotsLists();
        }

        updateDotsLists() {
            let view = $('div.dot-view');
            if(view.length === 0){
                return;
            }

            //view.css('flex-grow', '1');

            view.find('div.mini').each(function() {
                $(this).css('width', '26px').css('height', '26');
                if($(this).hasClass('curse')) {
                    $(this).css('background-color', 'violet');
                }
            });
        }
    }

    AE.tabStyleAdventure = new AETabStyleAdventure();

})(window.jQuery);