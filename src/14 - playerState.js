// Player State
(function($) {
    'use strict';

    class AEPlayerState {
        constructor() {
            this.activeTab = undefined;
            this.resources = {};
            this.vitals = {};
        }

        initialize(){
            for(let vital in AE.data.PlayerVitals) {
                this.vitals[vital] = {current: 0, max: 0};
            }

            for(let resource in AE.data.PlayerResources){
                this.resources[resource] = {current: 0, max: 0};
            }
        }

        update(delta) {
            for(let vital in AE.data.PlayerVitals) {
                this.vitals[vital] = AE.pageUtils.getVitalValues(AE.data.PlayerVitals[vital]);
            }

            for(let resource in AE.data.PlayerResources) {
                this.resources[resource] = AE.pageUtils.getResourceValues(AE.data.PlayerResources[resource]);
            }

            this.updateActiveTab();
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