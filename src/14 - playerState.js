// Player State
(function($) {
    'use strict';

    class AEPlayerState {
        constructor() {
            this.activeTab = undefined;
            this.resources = {};
            this.resourceState = {};
            this.equippedItems = {};
            this.timeSinceResourceCompute = 0;
        }

        initialize(){
            for(let key in AE.data.ResourceData){
                this.resources[key] = {current: 0, max: 0};
                this.resourceState[key] = {
                    initialized: false,
                    diff: 0,
                    perSecond: 0,
                    lastUpdateState: {current: 0, max: 0}
                };
            }
        }

        update(delta) {
            this.updateResources();

            this.timeSinceResourceCompute += delta;
            if(this.timeSinceResourceCompute >= 1000) {
                this.timeSinceResourceCompute = 0;
                this.updateResourceState();
            }

            this.updateActiveTab();
        }

        getResourcePerSecond(key) {
            if(this.resourceState[key] === undefined) {
                return 0;
            }

            return this.resourceState[key].perSecond;
        }

        updateResourceState() {
            for(let key in AE.data.ResourceData) {
                let state = this.resourceState[key];
                let currentValue = this.resources[key];

                if(state.initialized === true) {
                    this.resourceState[key].perSecond = currentValue.current - state.lastUpdateState.current;
                }

                this.resourceState[key].lastUpdateState = currentValue;
                state.initialized = true;
            }
        }

        updateResources(){
            for(let key in AE.data.ResourceData) {
                let vitalValue = AE.pageUtils.getVitalValues(key);
                if(vitalValue !== undefined) {
                    this.resources[key] = vitalValue;
                } else {
                    this.resources[key] = AE.pageUtils.getResourceValues(key);
                }
            }
        }

        clearEquippedItems() {
            this.equippedItems = {};
        }

        registerEquippedItem(slot, itemProperties) {
            if(this.equippedItems[slot] === undefined) {
                this.equippedItems[slot] = [];
            }

            this.equippedItems[slot].push(itemProperties);
        }

        getEquippedItems(slots) {
            let results = [];
            for(let i = 0; i < slots.length; i++) {
                let items = this.equippedItems[slots[i]];
                if(items === undefined){
                    continue;
                }

                for(let k = 0; k < items.length; k++) {
                    results.push(items[k]);
                }
            }

            return results;
        }

        getEquippedItemToCompareFor(otherItem) {
            if(otherItem.itemSlot === undefined){
                return undefined;
            }

            let equippedItems = this.getEquippedItems(otherItem.itemSlot);
            if(equippedItems === undefined || equippedItems.length === 0) {
                return undefined;
            }

            // TODO: for now we compare against the first, this will not be good for dual wielding
            return equippedItems;
        }

        updateActiveTab(){
            $('div.menu').find('div.menu-items').find('div.menu-item').each(function() {
                let span = $(this.children[0]);
                if(span.children().length === 0){
                    let tabId = span.text().trim();
                    let tabKey = undefined;
                    for(let key in AE.data.GameTabs) {
                        if(AE.data.GameTabs[key] === tabId) {
                            tabKey = key;
                            break
                        }
                    }

                    if(tabKey === undefined){
                        console.error("Unknown Tab: " + tabId);
                        return;
                    }

                    if(AE.playerState.activeTab !== tabId){
                        AE.playerState.activeTab = tabId;
                    }
                }
            });
        }
    }

    AE.playerState = new AEPlayerState();

})(window.jQuery);