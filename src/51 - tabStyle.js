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

                case AE.data.GameTabs.Adventure: {
                    this.updateAdventureTab();
                    break;
                }

                case AE.data.GameTabs.Equip: {
                    this.updateEquipTab();
                    break;
                }

                case AE.data.GameTabs.Bestiary: {
                    this.updateBestiaryTab();
                    break;
                }

                case AE.data.GameTabs.Enchanting: {
                    this.updateEnchantingTab();
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

                let buttonText = $(button).text();
                if(buttonText.includes('(')) {
                    return;
                }

                let homeKey = buttonText.toLocaleLowerCase();
                if(AE.data.HomeData[homeKey] === undefined) {
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

                let buttonText = $(button).text();
                if(buttonText.includes('(')) {
                    return;
                }

                let mountKey = buttonText.toLocaleLowerCase();
                if(AE.data.MountData[mountKey] === undefined) {
                    return;
                }

                $(button).text(buttonText + ' (' + AE.data.MountData[mountKey].dist + ')')
            });
        }

        updateAdventureTab() {
            let root = $('div.adventure');
            if(root.length === 0){
                return;
            }

            let raid = root.find('div.raid-bottom');
            if(raid.length === 0){
                return;
            }

            AE.pageUtils.refreshInventorySubContent({removeEquip: true});
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

        updateEquipTab() {
            AE.pageUtils.refreshInventorySubContent();

            let equipRoot = $('div.equip');
            equipRoot.css("grid-template-columns", "repeat( auto-fill, minmax(18rem,1fr))");

            // Process equipped items
            $('div.equip').find('div.equip-slot').find('.slot-item').each(function() {
                let slot = $(this);
                let nameSpan = slot.find('span.item-name');
                if(nameSpan.length === 0) {
                    return;
                }

                let name = nameSpan.text();
                AE.itemUtils.processItemEntry($(this), name, nameSpan);
            });
        }

        updateEnchantingTab() {
            AE.pageUtils.refreshInventorySubContent({hideConsumables: true});
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