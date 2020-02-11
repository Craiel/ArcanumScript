// Item utils
(function($) {
    'use strict';

    const ItemCountRegex = /(.*?)\s?\(([0-9]+)\)/;
    const ItemLevelRegex = /\[[0-9]+\](.*)/;

    const ItemSpecialCharacters = ['🔻', '👍'];

    class AEItemUtils {
        constructor() {
            this.invalidItemNames = {};
        }

        determineItemProperties(name) {
            // Get rid of special characters first
            for(let i = 0; i < ItemSpecialCharacters.length; i++){
                name = name.replace(ItemSpecialCharacters[i], '').trim();
            }

            let prop = {
                fullName: name.trim(),
                name: name.trim(),
                count: 1,
                type: AE.data.ItemType.Unknown,
                subType: undefined,
                isKnown: false,
                enchantNotations: []
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
            for(let key in AE.data.PotionData) {
                let potionData = AE.data.PotionData[key];
                if (prop.name === potionData.name) {
                    prop.type = AE.data.ItemType.Consumable;
                    prop.subType = AE.data.ConsumableSubType.Potion;
                    prop.isKnown = true;
                    break;
                }
            }

            if(prop.isKnown === false) {
                // Check enchantment state and normalize item name
                if (prop.name.startsWith('Enchanted') || prop.name.startsWith('enchanted')) {
                    prop.name = prop.name.replace(/enchanted/gi, "").trim();
                    prop.fullName = prop.fullName.replace(/enchanted/gi, "").trim();
                    prop.isEnchanted = true;
                }

                for (let i = 0; i < AE.data.EnchantItemNotations.length; i++) {
                    let notation = AE.data.EnchantItemNotations[i];
                    if (prop.name.includes(notation)) {
                        prop.name = prop.name.replace(notation, "").trim();
                        prop.isEnchanted = true;
                        prop.enchantNotations.push(notation);
                    }
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
                for(let key in AE.data.MaterialData) {
                    let materialString = key+" ";
                    if(prop.name.startsWith(materialString)) {
                        prop.name = prop.name.replace(materialString, "").trim();
                        prop.material = key;
                        prop.level = AE.data.MaterialData[key].level;
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

            if(prop.isKnown === true) {
                prop.itemSlot = this.determineItemSlot(prop.type, prop.subType);
            }

            return prop;
        }

        determineItemSlot(type, subType) {
            switch (type) {
                case AE.data.ItemType.Armor: {
                    switch (subType) {
                        case AE.data.ArmorSubType.Back: {
                            return [AE.data.ItemSlot.Back];
                        }

                        case AE.data.ArmorSubType.Chest: {
                            return [AE.data.ItemSlot.Chest];
                        }

                        case AE.data.ArmorSubType.Feet: {
                            return [AE.data.ItemSlot.Feet];
                        }

                        case AE.data.ArmorSubType.Hands: {
                            return [AE.data.ItemSlot.Hands];
                        }

                        case AE.data.ArmorSubType.Head: {
                            return [AE.data.ItemSlot.Head];
                        }

                        case AE.data.ArmorSubType.Shins: {
                            return [AE.data.ItemSlot.Shins];
                        }

                        case AE.data.ArmorSubType.Waist: {
                            return [AE.data.ItemSlot.Waist];
                        }

                        default: {
                            return undefined;
                        }
                    }
                }

                case AE.data.ItemType.Accessory: {
                    switch (subType) {
                        case AE.data.AccessorySubType.Neck: {
                            return [AE.data.ItemSlot.Neck];
                        }

                        case AE.data.AccessorySubType.Ring: {
                            return [AE.data.ItemSlot.Finger];
                        }

                        default: {
                            return undefined;
                        }
                    }
                }

                case AE.data.ItemType.Weapon: {
                    switch (subType) {
                        case AE.data.WeaponSubType.Axe2H:
                        case AE.data.WeaponSubType.Mace2H:
                        case AE.data.WeaponSubType.Spear:
                        case AE.data.WeaponSubType.Staff:
                        case AE.data.WeaponSubType.Sword2H: {
                            return [AE.data.ItemSlot.WeaponRight];
                        }

                        case AE.data.WeaponSubType.Axe1H:
                        case AE.data.WeaponSubType.Orb:
                        case AE.data.WeaponSubType.Mace1H:
                        case AE.data.WeaponSubType.Sword1H:
                        case AE.data.WeaponSubType.Dagger: {
                            return [AE.data.ItemSlot.WeaponLeft, AE.data.ItemSlot.WeaponRight];
                        }

                        default: {
                            return undefined;
                        }
                    }
                }

                default: {
                    return undefined;
                }
            }
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

        modifyItemElement(properties, targetEl, conf) {
            if(properties.isSpecialItem === true) {
                $(targetEl).css('color', '#FF8000').css('font-weight', 'bold');
            }
            else if(properties.type === AE.data.ItemType.Consumable) {
                $(targetEl).css('color', '#3955cb');
            }
            else if(properties.isEnchanted === true) {
                $(targetEl).css('color', '#b60083').css('font-style', 'italic');
            }

            if(properties.level !== undefined) {
                let fullText = properties.fullName;
                if(conf.showLevelInName !== false) {
                    fullText = "[" + properties.level + "] " + fullText;
                }

                if(conf.compareEquip === true && properties.itemSlot !== undefined) {
                    let equippedItems = AE.playerState.getEquippedItemToCompareFor(properties);
                    if(equippedItems !== undefined) {
                        let lowestItem = undefined;
                        for(let i = 0; i < equippedItems.length; i++) {
                            let item = equippedItems[i];
                            if(item.level === undefined) {
                                continue;
                            }

                            if(lowestItem === undefined || lowestItem.level > item.level) {
                                lowestItem = item;
                            }
                        }

                        if(lowestItem !== undefined) {
                            if(lowestItem.level > properties.level) {
                                fullText = fullText + " 🔻";
                            } else if (lowestItem.level < properties.level) {
                                fullText = fullText + " 👍";
                            }
                        }
                    } else {
                        fullText = fullText + " 👍";
                    }
                }

                $(targetEl).text(fullText);
            }
        }

        processItemEntry(sourceEl, name, targetEl, conf){
            if(conf === undefined){
                conf = {};
            }

            if(this.invalidItemNames[name] === true){
                return undefined;
            }

            let properties = this.determineItemProperties(name);
            if (properties.type === AE.data.ItemType.Unknown){
                console.warn("Unknown Item:");
                console.warn(properties);
                this.invalidItemNames[name] = true;
                return undefined;
            }

            if(conf.hideConsumables === true && properties.type === AE.data.ItemType.Consumable) {
                sourceEl.hide();
                return properties;
            }

            this.modifyItemElement(properties, targetEl, conf);

            return properties;
        }
    }

    AE.itemUtils = new AEItemUtils();

})(window.jQuery);