// Page utils
(function($) {
    'use strict';

    const ItemPopupCompareDiv = `
<div id="at_item_popup_compare_div">
    <div class="note-text"><hr>equipped</div>    
</div>
`;

    const ItemPopupCompareDivContent = `<span id="at_item_popup_compare_text" class="separate"></span>`;

    const PopupCostRegex = /(max )*(.*)?:\s+([0-9\.]+)/i;

    class AEPageUtils {
        getVitalValues(id) {
            let bar = $('.bars').find('tr[data-key="' + id + '"');
            if(bar.length === 0) {
                return undefined;
            }

            let rawValues = bar.find('.bar-text').text().split('/');
            return this.getValues(rawValues);
        }

        getResourceValues(id) {
            let rawValues = $('.rsrc[data-key="' + id + '"]').find('.num-align').text().split('/');
            return this.getValues(rawValues);
        }

        getValues(rawValues){
            let invalidDefault = {current: 0, max: 0};

            if(rawValues.length !== 2){
                return invalidDefault;
            }

            let current = parseFloat(rawValues[0]);
            let max = parseFloat(rawValues[1]);

            // Check parsing issues
            if(isNaN(current) || isNaN(max)){
                return invalidDefault;
            }

            // Correct potential issues
            if(current > max){
                current = max;
            }

            let pct = 0;
            if(max > 0) {
                pct = current / max;
            }

            return {
                current: current,
                max: max,
                pct: pct
            };
        }

        getResourceDiv(id) {
            id = id.trim().toLowerCase();
            let result = undefined;
            $('div.res-list').find('div.rsrc').each(function() {
                if(result !== undefined) {
                    return;
                }

                let resourceKey = $(this).data('key').trim().toLowerCase();
                if(resourceKey === id) {
                    result = $(this);
                }
            });

            return result;
        }

        getVitalsRow(id) {
            id = id.trim().toLowerCase();
            let result = undefined;
            $('table.bars').find('tr').each(function() {
                if(result !== undefined) {
                    return;
                }

                let vitalKey = $(this).data('key').trim().toLowerCase();
                if(vitalKey === id) {
                    result = $(this);
                }
            });

            return result;
        }

        checkData(){
            let unknownResources = [];
            $('div.res-list').find('div.rsrc').each(function() {
                let resourceKey = $(this).data('key');
                let isKnown = AE.data.ResourceData[resourceKey] !== undefined;
                if(isKnown === false) {
                    unknownResources.push(resourceKey);
                }
            });

            if(unknownResources.length > 0){
                AE.log("Unknown Resources: " + unknownResources);
            }

            let unknownVitals = [];
            $('table.bars').find('tr').each(function() {
                let vitalKey = $(this).data('key');
                let isKnown = AE.data.ResourceData[vitalKey] !== undefined;
                if(isKnown === false) {
                    unknownVitals.push(vitalKey);
                }
            });

            if(unknownVitals.length > 0){
                AE.log("Unknown Vitals: " + unknownVitals);
            }
        }

        fixTableLayout(target)
        {
            target.css("grid-template-columns", "repeat( auto-fit, minmax(18rem, 0.5fr))");

            target.find('.separate').each(function() {
                $(this).find('button').each(function() {
                    // Equal sized buttons
                    $(this).css("width", "60px").css("flex-shrink", "0");
                })
            });
        }

        sellInventoryJunk() {
            let inventoryDiv = $('div.inventory');
            if(inventoryDiv.length === 0) {
                return;
            }

            let itemTable = inventoryDiv.find('div.item-table');
            if(itemTable.length === 0){
                return;
            }

            itemTable.find('.separate').each(function() {
                let nameEl = $(this).children()[0];
                let buttons = $(this).find('button');
                let sellButton = undefined;
                for(let i = 0; i < buttons.length; i++){
                    if(buttons[i].innerText === "Sell"){
                        sellButton = buttons[i];
                        break;
                    }
                }

                if(sellButton !== undefined && nameEl.innerText.includes("🔻")) {
                    sellButton.click();
                }
            });
        }

        updateInventorySubContent(conf){
            if(conf === undefined) {
                conf = {};
            }

            let inventoryDiv = $('div.inventory');
            if(inventoryDiv.length === 0) {
                return;
            }

            let itemTable = inventoryDiv.find('div.item-table');
            if(itemTable.length === 0){
                return;
            }

            if(conf.addSellJunkButton === true) {
                let sellJunkButton = inventoryDiv.find('#at_inv_sell_junk_btn');
                if(sellJunkButton.length === 0){
                    let topSpan = inventoryDiv.find('span.top');
                    let sellAllButton = topSpan.find('button');
                    if(sellAllButton.length !== 0){
                        let sellJunkButtonSpan = $('<span id="at_inv_sell_junk_btn"></span>');
                        sellJunkButton = $('<button>Sell Low Level Items</button>');
                        sellJunkButton[0].addEventListener("click", event => {
                            AE.pageUtils.sellInventoryJunk();
                        }, false);
                        sellJunkButtonSpan.append(sellJunkButton);
                        topSpan.append(sellJunkButtonSpan);
                    }
                }
            }

            this.fixTableLayout(itemTable);

            itemTable.find('.separate').each(function() {
                let nameEl = $(this).children()[0];

                if(conf.removeEquip === true) {
                    $(this).find('button').each(function() {
                        let buttonText = $(this).text();
                        if(buttonText === "Equip") {
                            $(this).parent().remove();
                        }
                    });
                }

                let itemName = nameEl.innerText;
                AE.itemUtils.processItemEntry($(this), itemName, nameEl, conf);
            });
        }

        getPopupSection(root, sectionTexts) {
            let result = undefined;
            root.find('div.note-text').each(function() {
                if(result !== undefined){
                    return;
                }

                let sectionTitle = $(this).text().trim().toLowerCase();
                for(let i = 0; i < sectionTexts.length; i++) {
                    if (sectionTitle === sectionTexts[i].toLowerCase()) {
                        result = $(this).parent();
                        return;
                    }
                }
            });

            return result;
        }

        updatePopupCost() {
            let popup = $('div.item-popup');
            if(popup.length === 0) {
                return;
            }

            let itemInfo = popup.find('div.item-info');
            if(itemInfo.length === 0) {
                return;
            }

            let costSection = this.getPopupSection(itemInfo, ['cost', 'progress cost', 'purchase cost']);
            if(costSection === undefined) {
                return;
            }

            costSection.find('span').each(function() {
                let spanText = $(this).text();
                let match = PopupCostRegex.exec(spanText);
                if(match === null) {
                    console.warn("Unknown Cost Value: " + spanText);
                    return;
                }

                let costId = match[2].toLowerCase().trim();
                let costValue = parseFloat(match[3]);
                if(AE.playerState.resources[costId] === undefined) {
                    console.warn("Unknown Cost Resource: " + costId);
                    return;
                }

                let resourceDiv = AE.pageUtils.getResourceDiv(costId);
                if(resourceDiv !== undefined && resourceDiv.length > 0) {
                    resourceDiv.find('span.item-name').css('color', 'red');
                    return;
                }

                let vitalsDiv = AE.pageUtils.getVitalsRow(costId);
                if(vitalsDiv !== undefined && vitalsDiv.length > 0) {
                    $(vitalsDiv.children()[0]).css('color', 'red');
                    return;
                }
            });
        }

        updateItemPopup() {
            let popup = $('div.item-popup');
            if(popup.length === 0) {
                return;
            }

            let itemInfo = popup.find('div.item-info');
            if(itemInfo.length === 0) {
                return;
            }

            let itemNameSpan = itemInfo.find('span.item-name');
            let itemName = itemNameSpan.text();
            let properties = AE.itemUtils.determineItemProperties(itemName);
            if(properties === undefined){
                return;
            }

            AE.itemUtils.modifyItemElement(properties, itemNameSpan, {showLevelInName: false, compareEquip: true});

            let compareDiv = popup.find('#at_item_popup_compare_div');
            let equippedItems = AE.playerState.getEquippedItemToCompareFor(properties);
            if(compareDiv.length === 0) {
                compareDiv = $(ItemPopupCompareDiv);

                if(equippedItems !== undefined) {
                    for (let i = 0; i < equippedItems.length; i++) {
                        let content = $(ItemPopupCompareDivContent);
                        AE.itemUtils.modifyItemElement(equippedItems[i], content, {});
                        compareDiv.append(content);
                    }
                } else {
                    let content = $(ItemPopupCompareDiv);
                    content.text("None");
                    compareDiv.append(content);
                }

                itemInfo.append(compareDiv);
            }
        }
    }

    AE.pageUtils = new AEPageUtils();

})(window.jQuery);