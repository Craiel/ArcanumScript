// Page utils
(function($) {
    'use strict';

    class AEPageUtils {
        getVitalValues(id) {
            let rawValues = $('.bars').find('tr[data-key="' + id + '"').find('.bar-text').text().split('/');
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

        getUpgradeButtons(keyDict) {
            let taskArea = $('div.main-tasks');
            if(taskArea.length === 0) {
                return [];
            }

            let matchingButtons = [];
            taskArea.find('span.task-btn').each(function() {
                if($(this).hasClass("locked") === true) {
                    return;
                }

                let button = $(this).find('button');
                if(button.length === 0) {
                    return;
                }

                let dataKey = $(this).data("key");
                if(dataKey === undefined || keyDict[dataKey] === undefined) {
                    return;
                }

                matchingButtons.push(button);
            });

            return matchingButtons;
        }

        checkData(){
            let unknownResources = [];
            $('div.res-list').find('div.rsrc').each(function() {
                let resourceKey = $(this).data('key');
                let isKnown = false;
                for(let id in AE.data.PlayerResources) {
                    if(resourceKey === AE.data.PlayerResources[id]){
                        isKnown = true;
                        break;
                    }
                }
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
                let isKnown = false;
                for(let id in AE.data.PlayerVitals) {
                    if(vitalKey === AE.data.PlayerVitals[id]){
                        isKnown = true;
                        break;
                    }
                }
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

        refreshInventorySubContent(conf){
            if(conf === undefined) {
                conf = {};
            }

            let itemTable = $('div.inventory').find('div.item-table');
            if(itemTable.length === 0){
                return;
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
    }

    AE.pageUtils = new AEPageUtils();

})(window.jQuery);