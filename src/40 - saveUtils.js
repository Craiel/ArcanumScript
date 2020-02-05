// Save Utils
(function($) {
    'use strict';

    class AESaveUtils {

        load() {
            this.loadCheckSaveButton();
            this.loadFixSaveButton();
        }

        loadCheckSaveButton() {
            let anchor = $('#drop-file');
            let button = $('<button id="at_check_save_btn" style="border: var(--tiny-gap) dashed var(--quiet-text-color);">[Check Save]</button>');
            button.on('dragenter', function (e) {
                e.stopPropagation();
                e.preventDefault();
                $(this).addClass('hilite');
            });

            button.on('dragleave', function (e) {
                e.stopPropagation();
                e.preventDefault();
                $(this).removeClass('hilite');
            });

            button.on('dragover', function (e) {
                e.stopPropagation();
                e.preventDefault();
                $(this).addClass('hilite');
            });

            button.on("drop", function(e) {
                e.preventDefault();
                e.stopPropagation();
                $(this).removeClass('hilite');

                if(e.originalEvent.dataTransfer && e.originalEvent.dataTransfer.files.length === 1) {
                    let file = e.originalEvent.dataTransfer.files[0];
                    let reader = new FileReader();
                    reader.onload = function(e) {
                        AE.saveUtils.fixSave(JSON.parse(reader.result));
                    };

                    reader.readAsText(file);
                }
            });

            anchor.after(button);
        }

        loadFixSaveButton() {
            let anchor = $('#drop-file');
            let button = $('<button id="at_fix_save_btn" style="border: var(--tiny-gap) dashed var(--quiet-text-color);">[Fix Save]</button>');
            button.on('dragenter', function (e) {
                e.stopPropagation();
                e.preventDefault();
                $(this).addClass('hilite');
            });

            button.on('dragleave', function (e) {
                e.stopPropagation();
                e.preventDefault();
                $(this).removeClass('hilite');
            });

            button.on('dragover', function (e) {
                e.stopPropagation();
                e.preventDefault();
                $(this).addClass('hilite');
            });

            button.on("drop", function(e) {
                e.preventDefault();
                e.stopPropagation();
                $(this).removeClass('hilite');

                if(e.originalEvent.dataTransfer && e.originalEvent.dataTransfer.files.length === 1) {
                    let file = e.originalEvent.dataTransfer.files[0];
                    let reader = new FileReader();
                    reader.onload = function(e) {
                        let fixedData = AE.saveUtils.fixSave(JSON.parse(reader.result));
                        if(fixedData !== undefined) {
                            let newName = file.name.replace(".json", ".fixed.json");
                            $("<a />", {
                                "download": newName,
                                "href": "data:application/json," + encodeURIComponent(JSON.stringify(fixedData))
                            }).appendTo("body")
                                .click(function () {
                                    $(this).remove()
                                })[0].click()
                        }
                    };

                    reader.readAsText(file);
                }
            });

            anchor.after(button);
        }

        fixSave(jsonData) {
            if(jsonData === undefined) {
                return;
            }

            AE.log("Attempting to Fix Save Issues...");

            if(jsonData.chars === undefined) {
                // Assume single character save
                let fixedData = this.fixSaveCharacter(jsonData);
                if(fixedData !== undefined) {
                    return fixedData;
                }

                return undefined;
            } else {
                let expectedPrestige = jsonData.hall.items.hallPoints.val || 0;

                let actualCharPrestige = 0;
                let fixedCharData = [];
                for (let i = 0; i < jsonData.chars.length; i++) {
                    let charData = jsonData.chars[i];
                    if(charData === undefined || charData === null) {
                        fixedCharData.push(charData);
                        continue;
                    }

                    actualCharPrestige += this.getSaveCharPrestige(charData);

                    let fixedData = this.fixSaveCharacter(charData);
                    if(fixedData === undefined){
                        return undefined;
                    }

                    fixedCharData.push(fixedData);
                }

                AE.log("Prestige Check: " + actualCharPrestige + " == " + expectedPrestige);

                jsonData.chars = fixedCharData;
                return jsonData;
            }
        }

        getSaveCharPrestige(charData) {
            // Prestige formula:
            // points + fame + (titles + level) / 10)

            let points = 0;
            let fame = 0;
            let level = 0;
            let titleCount = 0;

            if(charData.items.player.points !== undefined) {
                points = charData.items.player.points;
            }

            if(charData.items.fame !== undefined) {
                fame = charData.items.fame.val;
            }

            if(charData.items.level !== undefined) {
                level = charData.items.level.val;
            }

            if(charData.items.player !== undefined && charData.items.player.titles !== undefined) {
                titleCount = charData.items.player.titles.length;
            }

            let value = points + fame + ((level + titleCount) / 10);
            AE.log("Prestige for " + charData.name + " == " + value + " (L:" + level + ", F: " + fame + ", T:" + titleCount +")");
            return value;
        }

        fixSaveCharacter(charData) {
            if(charData === undefined || charData === null) {
                return undefined;
            }

            AE.log("Checking Character " + charData.name);

            // Inventory
            for(let k = 0; k < charData.items.inv.items.length; k++) {
                let itemData = charData.items.inv.items[k];
                let newItemData = this.fixSaveItem(itemData);
                if(newItemData !== undefined) {
                    charData.items.inv.items[k] = newItemData;
                }
            }

            // Equip
            for(let key in charData.equip.slots) {
                let slotData = charData.equip.slots[key];
                if(key === "neck" || key === "fingers") {
                    for(let i = 0; i < slotData.item.length; i++) {
                        let newItemData = this.fixSaveItem(slotData.item[i]);
                        if(newItemData !== undefined){
                            slotData.item[i] = newItemData;
                        }
                    }
                } else {
                    let newItemData = this.fixSaveItem(slotData.item);
                    if(newItemData !== undefined){
                        slotData.item = newItemData;
                    }
                }

                charData.equip.slots[key] = slotData;
            }

            // Reset raid
            if(charData.raid !== undefined) {
                if(charData.raid.combat !== undefined
                    && charData.raid.combat.enemies !== undefined
                    && charData.raid.combat.enemies.length > 0) {
                    AE.log("Resetting Combat Enemies");
                    charData.raid.combat.enemies = [];
                }

                if(charData.raid.combat !== undefined
                    && charData.raid.combat.allies !== undefined
                    && charData.raid.combat.allies.length > 0) {
                    AE.log("Resetting Combat Allies");
                    charData.raid.combat.allies = [];
                }
            }

            return charData;
        }

        fixSaveItem(itemData) {
            if(itemData === null || itemData === undefined || itemData.name === undefined) {
                return;
            }

            AE.log(" -- Checking item `" + itemData.name + "`");

            let properties = AE.itemUtils.determineItemProperties(itemData.name);
            if(properties.isKnown === false) {
                AE.log("Unknown Item!");
                console.log(properties);
                return;
            }

            // Re-construct the name, this gets rid of double enchanted
            let originalName = itemData.name;
            itemData.name = properties.fullName;
            if(properties.isEnchanted === true) {
                itemData.name = "enchanted " + itemData.name;
            }

            if(originalName !== itemData.name) {
                AE.log("Renaming to `" + itemData.name + "`");
            }

            if(itemData.enchants !== undefined && itemData.enchants !== "") {
                let enchantProperties = AE.itemUtils.determineEnchantProperties(itemData.enchants);
                if(enchantProperties !== undefined) {
                    // Adjust level
                    if(itemData.enchantTot !== enchantProperties.level) {
                        AE.log("Fixing Enchanting level, was " + itemData.enchantTot + " should be " + enchantProperties.level);
                        itemData.enchantTot = enchantProperties.level;
                    }

                    // Check mods
                    if(itemData.mod === undefined || typeof itemData.mod === "string") {
                        AE.log("Item has no mod info, adding");
                        itemData.mod = {};
                    }

                    for(let modKey in enchantProperties.mods) {
                        let currentModValue = JSON.stringify(itemData.mod[modKey]);
                        let expectedModValue = JSON.stringify(enchantProperties.mods[modKey]);
                        if(currentModValue === undefined || currentModValue !== expectedModValue) {
                            AE.log("Fixing Enchanting Mod for " + modKey + ", was " + currentModValue + " should be " + expectedModValue);
                            itemData.mod[modKey] = enchantProperties.mods[modKey];
                        }
                    }
                }
            }

            return itemData;
        }
    }

    AE.saveUtils = new AESaveUtils();

})(window.jQuery);