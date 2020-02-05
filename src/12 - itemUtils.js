// Item utils
(function($) {
    'use strict';

    const ItemCountRegex = /(.*?)\s?\(([0-9]+)\)/;
    const ItemLevelRegex = /\[[0-9]+\](.*)/;

    class AEItemUtils {
        constructor() {
            this.invalidItemNames = {};
        }

        determineItemProperties(name) {
            let prop = {
                fullName: name.trim(),
                name: name.trim(),
                count: 1,
                type: AE.data.ItemType.Unknown,
                subType: undefined,
                isKnown: false
            };

            let levelMatch = ItemLevelRegex.exec(prop.name);
            if(levelMatch !== null) {
                prop.name = levelMatch[1].trim();
                prop.fullName = prop.name;
            }

            let countMatch =ItemCountRegex.exec(prop.name);
            if(countMatch !== null) {
                prop.name = countMatch[1].trim();
                prop.count = parseInt(countMatch[2]);
            }

            // Handle potions
            for(let key in AE.data.Potions) {
                if (prop.name === AE.data.Potions[key]) {
                    prop.type = AE.data.ItemType.Consumable;
                    prop.subType = AE.data.ConsumableSubType.Potion;
                    prop.isKnown = true;
                    break;
                }
            }

            // Check enchantment state and normalize item name
            if (prop.name.startsWith('Enchanted') || prop.name.startsWith('enchanted')) {
                prop.name = prop.name.replace(/enchanted/gi, "").trim();
                prop.fullName = prop.fullName.replace(/enchanted/gi, "").trim();
                prop.isEnchanted = true;
            }

            for(let i = 0; i < AE.data.EnchantItemNotations.length; i++){
                let notation = AE.data.EnchantItemNotations[i];
                if(prop.name.includes(notation)){
                    prop.name = prop.name.replace(notation, "").trim();
                    prop.isEnchanted = true;
                }
            }

            // Check for special items
            if (prop.isKnown === false) {
                for(let key in AE.data.SpecialItems) {
                    if(prop.name === key) {
                        prop.type = AE.data.SpecialItems[key].type;
                        prop.subType = AE.data.SpecialItems[key].subType;
                        prop.isSpecialItem = true;
                        prop.isKnown = true;
                        break
                    }
                }
            }

            // Check the material
            if (prop.isKnown === false) {
                for(let key in AE.data.ItemMaterials) {
                    let materialString = AE.data.ItemMaterials[key].name+" ";
                    if(prop.name.startsWith(materialString)) {
                        prop.name = prop.name.replace(materialString, "").trim();
                        prop.material = key;
                        prop.level = AE.data.ItemMaterials[key].lvl;
                        break;
                    }
                }
            }

            // Check if its an accessory
            if(prop.isKnown === false) {
                for(let key in AE.data.Accessories) {
                    if(prop.name === AE.data.Accessories[key].name) {
                        prop.type = AE.data.ItemType.Accessory;
                        prop.subType = AE.data.Accessories[key].subType;
                        if(prop.level === undefined) {
                            prop.level = 0;
                        }
                        prop.level += AE.data.Accessories[key].lvl;
                        prop.isKnown = true;
                        break;
                    }
                }
            }

            // Check if its an Armor
            if(prop.isKnown === false) {
                for(let key in AE.data.Armor) {
                    if(prop.name === AE.data.Armor[key].name) {
                        prop.type = AE.data.ItemType.Armor;
                        prop.subType = AE.data.Armor[key].subType;
                        if(prop.level === undefined) {
                            prop.level = 0;
                        }
                        prop.level += AE.data.Armor[key].lvl;
                        prop.isKnown = true;
                        break;
                    }
                }
            }

            // Check if its a Weapon
            if(prop.isKnown === false) {
                for(let key in AE.data.Weapons) {
                    if(prop.name === AE.data.Weapons[key].name) {
                        prop.type = AE.data.ItemType.Weapon;
                        prop.subType = AE.data.Weapons[key].subType;
                        if(prop.level === undefined) {
                            prop.level = 0;
                        }
                        prop.level += AE.data.Weapons[key].lvl;
                        prop.isKnown = true;
                        break;
                    }
                }
            }

            return prop;
        }

        determineEnchantProperties(enchants) {
            if(enchants === null || enchants === undefined || enchants === "" || !isNaN(enchants)){
                return undefined;
            }

            let result = {
                level: 0,
                mods: {},
                unknown: []
            };

            let values = enchants.split(',');
            for(let i = 0; i < values.length; i++){
                let key = values[i].trim();
                if(AE.data.EnchantData[key] === undefined) {
                    console.warn("Unknown Enchant: " + key);
                    result.unknown.push(key);
                    continue;
                }

                result.level += AE.data.EnchantData[key].level;

                if(AE.data.EnchantData[key].mods !== undefined) {
                    this.mergeMods(result.mods, AE.data.EnchantData[key].mods);
                }
            }

            return result;
        }

        mergeMods(target, source) {
            for(let modKey in source) {
                let value = source[modKey];
                if(isNaN(value)){
                    if(target[modKey] === undefined) {
                        target[modKey] = {};
                    }

                    for(let modParam in value) {
                        if(target[modKey][modParam] === undefined){
                            target[modKey][modParam] = 0
                        }

                        target[modKey][modParam] += value[modParam];
                    }
                } else {
                    if(target[modKey] === undefined){
                        target[modKey] = 0;
                    }

                    target[modKey] += value;
                }
            }
        }

        processItemEntry(sourceEl, name, targetEl, conf){
            if(conf === undefined){
                conf = {};
            }

            if(this.invalidItemNames[name] === true){
                return;
            }

            let properties = this.determineItemProperties(name);
            if (properties.type === AE.data.ItemType.Unknown){
                console.warn("Unknown Item:");
                console.warn(properties);
                this.invalidItemNames[name] = true;
                return;
            }

            if(conf.hideConsumables === true && properties.type === AE.data.ItemType.Consumable) {
                sourceEl.hide();
                return;
            }

            if(properties.isSpecialItem === true) {
                $(targetEl).css('color', 'blue').css('font-style', 'italic');
            }
            else if(properties.isEnchanted === true) {
                $(targetEl).css('color', 'purple').css('font-style', 'italic');
            }

            if(properties.level !== undefined) {
                $(targetEl).text("[" + properties.level + "] " + properties.fullName);
            }
        }
    }

    AE.itemUtils = new AEItemUtils();

})(window.jQuery);