// TabStyle - Enchant
(function($) {
    'use strict';

    const SlotLevelRegex = /\s*([0-9]+)\s*\/\s*([0-9]+)\s*slot-levels/i;

    class AETabStyleEnchant {
        constructor() {
            this.resetState();
        }

        resetState() {
            this.slotsRemaining = 0;
            this.slotsUsed = 0;
            this.slotsMax = 0;
            this.enchantElements = {};
        }

        updateUI() {
            if(AE.playerState.activeTab !== AE.data.GameTabs.Enchanting) {
                this.resetState();
                return;
            }

            let enchantDiv = $('div.enchants');
            if(enchantDiv.length === 0) {
                this.resetState();
                return;
            }

            AE.pageUtils.updateInventorySubContent({hideConsumables: true, compareEquip: true});
            AE.pageUtils.updateItemPopup();

            this.updateEnchantList();
            this.updateEnchantTabCustomBar();
            this.updateGroupedList();
            this.updateEnchantState();
        }

        onToggleEnchantBarTaskDisplay(checked) {
            if(AE.settings.data.enchantScreenGroupedDisplay !== checked) {
                // Update the settings
                AE.settings.data.enchantScreenGroupedDisplay = checked;
                AE.settings.save();
            }

            this.rebuildEnchantsDisplay();
        }

        updateEnchantTabCustomBar() {
            let existing = $('#at_enchant_top_bar');
            if(existing.length !== 0) {
                return;
            }

            let root = $('div.enchants');
            if(root.length === 0) {
                return;
            }

            let bar = $('<div id="at_enchant_top_bar" class="top separate"></div>');
            let options = $('<span></span>');
            let optionToggleView = AE.utils.createOptionsToggle("at_enchants_toggle_view", "Grouped Display", this.onToggleEnchantBarTaskDisplay.bind(this), AE.settings.data.enchantScreenGroupedDisplay);
            options.append(optionToggleView);
            bar.append(options);

            $(root[0]).prepend(bar);
        }

        updateEnchantState() {
            let enchantDiv = $('div.enchants');
            let activeSlots = enchantDiv.find('div.enchant-slots');
            if(activeSlots.length === 0) {
                return;
            }

            let slotInfo = SlotLevelRegex.exec(activeSlots.children()[0].innerText);
            if(slotInfo === null) {
                return;
            }

            this.slotsUsed = parseInt(slotInfo[1]);
            this.slotsMax = parseInt(slotInfo[2]);
            this.slotsRemaining = this.slotsMax - this.slotsUsed;

            // Update the enchant divs with colors based on slot count
            for(let enchantKey in AE.data.EnchantData) {
                let enchantData = AE.data.EnchantData[enchantKey];
                let div = $('#at_ench_div_' + enchantKey);
                if(div.length === 0) {
                    continue;
                }

                let nameSpan = div.find('span.ench-name');
                if(this.slotsRemaining < enchantData.level) {
                    nameSpan.css('color', 'red');
                } else {
                    nameSpan.css('color', '');
                }
            }
        }

        refreshEnchantListElements(root) {
            root.find('div.enchant').each(function () {
                let el = $(this);
                if(el.attr('id') !== undefined) {
                    return;
                }

                let textSpan = el.find('span.ench-name');
                let name = textSpan.text().toLowerCase();
                let enchantKey = AE.data.EnchantNameLookup[name];
                if(enchantKey === undefined) {
                    return;
                }

                let enchantData = AE.data.EnchantData[enchantKey];
                el.attr("id", 'at_ench_div_' + enchantKey);
                textSpan.text('[' + enchantData.level + '] ' + name);

                // Always Override the old element with this one, we keep the last one we see
                AE.tabStyleEnchant.enchantElements[enchantKey] = [this, name];
            });
        }

        updateGroupedList() {
            let vanillaList = $('#at_enchant_list_vanilla');
            if(vanillaList.length === 0){
                return;
            }

            let groupedList = $('#at_enchant_list_grouped');
            if(groupedList.length !== 0) {
                return;
            }

            let grouped = $('<div id="at_enchant_list_grouped" style="min-width: 250px"/>');
            vanillaList.after(grouped);

            this.rebuildEnchantsDisplay();
        }

        updateEnchantList() {
            let existing = $('#at_enchant_list_vanilla');
            if(existing.length !== 0) {
                if(existing.is(":visible")) {
                    this.refreshEnchantListElements(existing);
                }
                return;
            }

            let root = $('div.enchants');
            let enchantListRoot = root.find('div.enchant-list');
            if (enchantListRoot.length !== 0) {
                enchantListRoot.css('min-width', '250px');
                enchantListRoot.attr('id', 'at_enchant_list_vanilla');
                this.refreshEnchantListElements(enchantListRoot);
            }

            let filterRoot = root.find('div.filter-box');
            if(filterRoot.length !== 0) {
                filterRoot.attr('id', 'at_enchant_filter_vanilla');
            }
        }

        rebuildEnchantsDisplay() {
            let vanillaRoot = $('#at_enchant_list_vanilla');
            let groupedRoot = $('#at_enchant_list_grouped');
            let filterRoot = $('#at_enchant_filter_vanilla');

            if(AE.settings.data.enchantScreenGroupedDisplay === true) {
                vanillaRoot.hide();
                filterRoot.hide();
                groupedRoot.show();

                this.moveEnchantsToGroupedDisplay();

            } else {

                this.moveEnchantsToVanillaDisplay();

                groupedRoot.hide();
                vanillaRoot.show();
                filterRoot.show();
            }
        }

        moveEnchantsToGroupedDisplay() {
            let enchantListGrouped = $('#at_enchant_list_grouped');
            if(enchantListGrouped.length === 0) {
                return;
            }

            enchantListGrouped.empty();
            let groupedElements = {};
            for(let enchantKey in this.enchantElements){
                let element = this.enchantElements[enchantKey][0];
                let name = this.enchantElements[enchantKey][1];
                let group = 'any';
                if(enchantKey !== undefined && AE.data.EnchantData[enchantKey].target !== undefined){
                    group = AE.data.EnchantData[enchantKey].target;
                }

                if(groupedElements[group] === undefined) {
                    groupedElements[group] = [];
                }

                groupedElements[group][name] = element;
            }

            let sortedGroupNames = Object.keys(groupedElements);
            sortedGroupNames.sort();

            for(let i = 0; i < sortedGroupNames.length; i++) {
                let groupName = sortedGroupNames[i];
                let group = $('<div id="at_enchant_list_group_' + groupName + '" class="enchant-list" style="margin-bottom: 5px;"/>');
                group.append('<span style="font-weight: bold">' + groupName + '</span>');

                let sortedEnchantNames = Object.keys(groupedElements[groupName]);
                sortedEnchantNames.sort();

                for(let i = 0; i < sortedEnchantNames.length; i++){
                    let el = $(groupedElements[groupName][sortedEnchantNames[i]]);
                    el.detach();
                    group.append(el);
                }

                enchantListGrouped.append(group);
            }
        }

        moveEnchantsToVanillaDisplay() {
            let vanillaRoot = $('#at_enchant_list_vanilla');

            for(let enchantKey in this.enchantElements) {
                let element = $(this.enchantElements[enchantKey][0]);
                element.detach();
                vanillaRoot.append(element);
            }
        }
    }

    AE.tabStyleEnchant = new AETabStyleEnchant();

})(window.jQuery);