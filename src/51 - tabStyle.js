// Tab Style helpers
(function($) {
    'use strict';

    class AETabStyle {
        update(delta) {
            switch (AE.playerState.activeTab) {
                case AE.data.GameTabs.Skills: {
                    this.updateSkillsTab();
                    break;
                }

                case AE.data.GameTabs.Home: {
                    this.updateHomeTab();
                    break;
                }

                case AE.data.GameTabs.Player: {
                    this.updatePlayerTab();
                    break;
                }

                case AE.data.GameTabs.Bestiary: {
                    this.updateBestiaryTab();
                    break;
                }

                case AE.data.GameTabs.Potions: {
                    this.updatePotionsTab();
                    break;
                }
            }
        }

        updateHomeTab() {
            this.updateHomeSelectionPopup();
        }

        updateHomeSelectionPopup() {
            let root = $('div.popup');
            if(root.length === 0) {
                return;
            }

            root.find('span.task-btn').each(function() {
                let button = $(this).find('button');
                if(button.length === 0) {
                    return;
                }

                let buttonText = $(button).text().toLowerCase();
                if(buttonText.includes('(')) {
                    return;
                }

                let homeKey = undefined;
                for(let name in AE.data.HomeNameLookup) {
                    if(buttonText.includes(name)) {
                        homeKey = AE.data.HomeNameLookup[name];
                        break;
                    }
                }

                if(homeKey === undefined) {
                    return;
                }

                $(button).text(buttonText + ' (' + AE.data.HomeData[homeKey].size + ')')
            });
        }

        updatePlayerTab(){
            this.updateMountSelectionPopup();
        }

        updateMountSelectionPopup() {
            let root = $('div.popup');
            if(root.length === 0) {
                return;
            }

            root.find('span.task-btn').each(function() {
                let button = $(this).find('button');
                if(button.length === 0) {
                    return;
                }

                let buttonText = $(button).text().toLowerCase();
                if(buttonText.includes('(')) {
                    return;
                }

                let mountKey = undefined;
                for(let name in AE.data.MountNameLookup) {
                    if(buttonText.includes(name)) {
                        mountKey = AE.data.MountNameLookup[name];
                        break;
                    }
                }

                if(mountKey === undefined) {
                    return;
                }

                $(button).text(buttonText + ' (' + AE.data.MountData[mountKey].distance + ')')
            });
        }

        updateSkillsTab() {
            let skillRoot = $('div.skills').find('div.subs');
            skillRoot.css("grid-template-columns", "repeat( auto-fit, minmax( 16rem, 1fr) )");
        }

        updateBestiaryTab() {
            let bestiaryTable = $('table.bestiary');

            bestiaryTable.find('tr').each(function(){
                $(this).find('th.sm-name').css("text-decoration", "none").css("cursor", "default");
            })
        }

        updatePotionsTab(){
            let potionColumn = $('div.potions').find('div.potion-col');
            if(potionColumn.length === 0){
                return;
            }

            AE.pageUtils.fixTableLayout(potionColumn);

            potionColumn.find('div.separate').each(function() {
                $(this).find('button').each(function() {
                    // Button colors based on action
                    if($(this).text() === "Unlock") {
                        $(this).css("background-color", "#ffa50050");
                    } else if ($(this).text() === "Brew") {
                        $(this).css("background-color", "#90ee9050");
                    }
                })
            });
        }
    }

    AE.tabStyle = new AETabStyle();

})(window.jQuery);