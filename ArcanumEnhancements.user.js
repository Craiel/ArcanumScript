// ==UserScript==
// @name         Arcanum Enhancements
// @version      1716.2
// @author       Craiel
// @description  Automation
// @updateURL    https://github.com/Craiel/ArcanumScript/raw/master/ArcanumEnhancements.user.js
// @downloadURL  https://github.com/Craiel/ArcanumScript/raw/master/ArcanumEnhancements.user.js
// @match        http://www.lerpinglemur.com/arcanum/*
// @match        https://www.lerpinglemur.com/arcanum/*
// @match        http://game312933.konggames.com/gamez/0031/2933/*
// @match        https://game312933.konggames.com/gamez/0031/2933/*
// @run-at       document-idle
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// ==/UserScript==

// Game Addresses:
// https://www.lerpinglemur.com/arcanum/index.html
// https://game312933.konggames.com/gamez/0031/2933/live/index.html

let AE = (function($){
    'use strict';

    class AE {
        log(msg){
            console.log("ATM: " + msg);
        }
    }

    return new AE();
})(window.jQuery); 
 
// Interval helper
(function($) {
    'use strict';

    class AEInterval {
        constructor() {
            this.intervalFunctions = [];
            this.intervalFunctionTimers = {};
            this.intervalFunctionRemaining = {};
        }

        add(target, interval, startAfterDelay) {
            let id = this.intervalFunctions.length;

            if(startAfterDelay === true) {
                this.intervalFunctionRemaining[id] = interval;
            } else {
                this.intervalFunctionRemaining[id] = 0;
            }

            this.intervalFunctionTimers[id] = interval;

            this.intervalFunctions.push(target);
        }

        remove(target) {
            let id = this.intervalFunctions.indexOf(target);
            if(id === -1) {
                return;
            }

            delete this.intervalFunctionTimers[id];
            delete this.intervalFunctionRemaining[id];
            this.intervalFunctions.splice(id, 1);
        }

        update(delta) {
            for(let id = 0; id < this.intervalFunctions.length; id++) {
                let func = this.intervalFunctions[id];
                let updateInterval = this.intervalFunctionTimers[id];

                this.intervalFunctionRemaining[id] -= delta;
                if(this.intervalFunctionRemaining[id] <= 0) {
                    func(updateInterval);
                    this.intervalFunctionRemaining[id] = updateInterval;
                }
            }
        }
    }

    AE.interval = new AEInterval();

})(window.jQuery); 
 
// Utils
(function($) {
    'use strict';

    class AEUtils {
        processTemplate(template, parameters){
            for(let key in parameters) {
                template = template.split('{{'+key+'}}').join(parameters[key]);
            }

            return template;
        }
    }

    AE.utils = new AEUtils();

})(window.jQuery); 
 
// Config
(function($) {
    'use strict';

    AE.config = {
        enableDebugMode: false,
        arcanumAutomationPresent: false,
        quickSlotCount: 10,
        quickSlotPresetCount: 3,
        minUpdateInterval: 50,
        uiUpdateInterval: 500
    }

})(window.jQuery); 
 
// Data
(function($) {
    'use strict';

    AE.data = {};
    AE.data.PlayerVitals = {
        // Core
        Stamina: 'stamina',
        Health: 'hp',
        Mana: 'mana',

        Earth: 'earth',
        Water: 'water',
        Wind: 'air',
        Fire: 'fire',

        Spirit: 'spirit',
        Nature: 'nature',

        Light: 'light',
        Dark: 'shadow',

        Chaos: 'chaos',
        Tempus: 'tempus',
        Void: 'void',

        // Seasonal
        Ice: 'ice'
    };

    AE.data.PlayerResources = {
        Gold: 'gold',

        Research: 'research',
        Arcana: 'arcana',
        Scroll: 'scrolls',
        Codex: 'codices',
        Tome: 'tomes',
        StarChart: 'starcharts',

        Body: 'bodies',
        Soul: 'souls',
        Bone: 'bones',
        BoneDust: 'bonedust',
        Skull: 'skulls',

        Gem: 'gems',
        GemMana: 'managem',
        GemFire: 'firegem',
        GemWater: 'watergem',
        GemEarth: 'earthgem',
        GemWind: 'airgem',
        GemLight: 'lightgem',
        GemDark: 'shadowgem',
        GemSpirit: 'spiritgem',
        GemNature: 'naturegem',
        GemBlood: 'bloodgem',

        RuneStone: 'runestones',
        RuneFire: 'firerune',
        RuneWater: 'waterrune',
        RuneWind: 'airrune',
        RuneEarth: 'earthrune',

        Ichor: 'ichor',
        StarShard: 'sindel',
        Dream: 'dreams',
        Herb: 'herbs',

        Machine: 'machinae',
        Puppet: 'puppets',

        // Seasonal
        EmblemOfIce: 'emblemofice',
        WinterEssence: 'winteressence',
        Frost: 'frost',
        LivingSnow: 'livingsnow',
        SnowMan: 'snowman',
    };

    AE.data.GameTabs = {
        Main: 'main',
        Skills: 'skills',
        Home: 'home',
        Adventure: 'adventure',
        Player: 'player',
        Spells: 'spells',
        Spellcraft: 'spellcraft',
        Equip: 'equip',
        Bestiary: 'bestiary',
        Enchanting: 'enchanting',
        Potions: 'potions',
    };

    AE.data.Potions = {
        PoisonWard: "poison ward",
        IronSkinSalve: "ironskin salve",
        AdamantSalve: "adamant salve",
        WaterWard: "water ward",
        FireWard: "fire ward",
        TrueStriking: "true striking",

        DraughtOfMana: "draught of mana",
        DraughtOfStamina: "draught of stamina",

        MinorHealing: "minor healing",
        HealingPotion: "healing potion",

        PotionOfStamina: "potion of stamina",
        Serenity: "serenity",
        GodsBlood: "god's blood"
    };

    AE.data.ItemType = {
        Unknown: 'unknown',
        Armor: 'armor',
        Weapon: 'weapon',
        Accessory: 'accessory',
        Consumable: 'consumable'
    };

    AE.data.ConsumableSubType = {
        Unknown: 'unknown',
        Potion: 'potion'
    };

    AE.data.WeaponSubType = {
        Unknown: 'unknown',
        Orb: 'orb',
        Sword1H: 'sword1h',
        Sword2H: 'sword2h',
        Mace1H: 'mace1h',
        Mace2H: 'mace2h',
        Axe1H: 'axe1h',
        Axe2H: 'axe2h',
        Dagger: 'dagger',
        Staff: 'staff',
        Spear: 'spear'
    };

    AE.data.ArmorSubType = {
        Unknown: 'unknown',
        Head: 'head',
        Hands: 'hands',
        Back: 'back',
        Waist: 'waist',
        Chest: 'chest',
        Shins: 'shins',
        Feet: 'feet'
    };

    AE.data.AccessorySubType = {
        Unknown: 'unknown',
        Ring: 'ring',
        Neck: 'neck'
    };

    AE.data.Armor = {
        Gloves: {name: 'gloves', lvl: 1, subType: AE.data.ArmorSubType.Hands},

        Boots: {name: 'boots', lvl: 1, subType: AE.data.ArmorSubType.Feet},

        Greaves: {name: 'greaves', lvl: 1, subType: AE.data.ArmorSubType.Shins},

        Hat: {name: 'hat', lvl: 1, subType: AE.data.ArmorSubType.Head},
        Cap: {name: 'cap', lvl: 1, subType: AE.data.ArmorSubType.Head},
        Helm: {name: 'helm', lvl: 3, subType: AE.data.ArmorSubType.Head},
        ConicalHelm: {name: 'conical helm', lvl: 1, subType: AE.data.ArmorSubType.Head},

        Jerkin: {name: 'jerkin', lvl: 2, subType: AE.data.ArmorSubType.Chest},
        PaddedArmor: {name: 'padded armor', lvl: 4, subType: AE.data.ArmorSubType.Chest},
        ChainMail: {name: 'chainmail', lvl: 5, subType: AE.data.ArmorSubType.Chest},
        PlateMail: {name: 'plate mail', lvl: 9, subType: AE.data.ArmorSubType.Chest},

        Belt: {name: 'belt', lvl: 1, subType: AE.data.ArmorSubType.Waist},
        Girdle: {name: 'girdle', lvl: 1, subType: AE.data.ArmorSubType.Waist},
        Cincture: {name: 'cincture', lvl: 1, subType: AE.data.ArmorSubType.Waist},
        Sash: {name: 'sash', lvl: 1, subType: AE.data.ArmorSubType.Waist},

        Cape: {name: 'cape', lvl: 1, subType: AE.data.ArmorSubType.Back},
        Robe: {name: 'robe', lvl: 1, subType: AE.data.ArmorSubType.Back},
        Cloak: {name: 'cloak', lvl: 1, subType: AE.data.ArmorSubType.Back},
        Wings: {name: 'wings', lvl: 20, subType: AE.data.ArmorSubType.Back}
    };

    AE.data.Accessories = {
        Ring: {name: 'ring', lvl: 5, subType: AE.data.AccessorySubType.Ring},
        Band: {name: 'band', lvl: 3, subType: AE.data.AccessorySubType.Ring},
        Loop: {name: 'loop', lvl: 1, subType: AE.data.AccessorySubType.Ring},

        Pendant: {name: 'pendant', lvl: 1, subType: AE.data.AccessorySubType.Neck},
        Collar: {name: 'collar', lvl: 1, subType: AE.data.AccessorySubType.Neck},
        Amulet: {name: 'amulet', lvl: 1, subType: AE.data.AccessorySubType.Neck},
        Necklace: {name: 'necklace', lvl: 1, subType: AE.data.AccessorySubType.Neck}
    };

    AE.data.Weapons = {
        ShortSword: {name: 'shortsword', lvl: 1, subType: AE.data.WeaponSubType.Sword1H},
        Club: {name: 'club', lvl: 0, subType: AE.data.WeaponSubType.Mace1H},
        Cane: {name: 'cane', lvl: 1, subType: AE.data.WeaponSubType.Mace1H},
        Knife: {name: 'knife', lvl: 0, subType: AE.data.WeaponSubType.Dagger},
        Staff: {name: 'staff', lvl: 1, subType: AE.data.WeaponSubType.Staff},
        BroomStick: {name: 'broomstick', lvl: 0, subType: AE.data.WeaponSubType.Mace1H},
        Dagger: {name: 'dagger', lvl: 1, subType: AE.data.WeaponSubType.Dagger},
        LongSword: {name: 'longsword', lvl: 3, subType: AE.data.WeaponSubType.Sword2H},
        Axe: {name: 'axe', lvl: 1, subType: AE.data.WeaponSubType.Axe1H},
        BattleAxe: {name: 'battleaxe', lvl: 2, subType: AE.data.WeaponSubType.Axe2H},
        Mace: {name: 'mace', lvl: 3, subType: AE.data.WeaponSubType.Mace1H},
        WarHammer: {name: 'warhammer', lvl: 3, subType: AE.data.WeaponSubType.Mace2H},
        Spear: {name: 'spear', lvl: 2, subType: AE.data.WeaponSubType.Spear},
    };

    AE.data.EnchantItemNotations = [
        'of colors',
        'of energy',
        'of air',
        'of spells',
        'of earth',
        'of biting',
        'of sanity',
        'of fire',
        'of water',
        'of luck',
        'of regeneration',
        'of speed',
        'of mana',
        'of life',
        'of clarity'
    ];

    AE.data.EnchantData = {
        en_air1: {
            level: 1,
            mods: {
                airlore: {max: 1},
                air: {rate: 0.2},
            }
        },

        en_fire1: {
            level: 1,
            mods: {
                firelore: {max:1},
                fire: {rate: 0.2}
            }
        },

        en_water1: {
            level: 1,
            mods: {
                waterlore: {max:1},
                water: {rate:0.2}
            }
        },

        en_earth1: {
            level: 1,
            mods: {
                earthlore: {max:1},
                earth: {rate:0.2}
            }
        },

        en_armor1: {
            level: 1,
            armor: 1
        },

        en_energy1: {
            level: 1,
            mods: {
                mana: {rate:1}
            }
        },

        en_clarity: {
            level: 3,
            mods: {
                bf: {rate:-0.5}
            }
        },

        en_luck1: {
            level: 1,
            mods: {
                luck: 1
            }
        },

        en_dmg1: {
            level: 1,
            attack: {
                bonus: 1
            }
        },

        en_hp1: {
            level: 1,
            mods: {
                hp: {max:1}
            }
        },

        en_mana1: {
            level: 1,
            mods: {
                mana: {max:1}
            }
        },

        en_speed1: {
            level: 7,
            mods: {
                speed: 0.5
            }
        },

        en_speed2: {
            level: 3,
            mods: {
                speed: 2,
            }
        },

        en_speed3: {
            level: 5,
            mods: {
                speed: 5
            }
        },

        en_speed4: {
            level: 7,
            mods: {
                speed: 8
            }
        },

        en_tohit1: {
            level: 1,
            attack: {
                tohit:2
            }
        },

        en_scraft: {
            level: 3,
            mods: {
                scraft: 1
            }
        },

        en_scraft2: {
            level: 6,
            mods: {
                scraft: 2
            }
        },

        en_regen1: {
            level: 2,
            mods: {
                hp: {rate:0.2}
            }
        },

        en_courage: {
            level: 5,
            mods: {
                unease: {rate:-0.5}
            }
        },

        en_sanity: {
            level: 6,
            mods: {
                madness: {rate:-1}
            }
        },

        en_stam1: {
            level: 7,
            mods: {
                stamina: {rate:0.3}
            }
        },

        en_prisma: {
            level: 8,
            mods: {
                prismatic:{rate:0.5}
            }
        }
    };

    AE.data.SpecialItems = {
        'orb of winters': {type: AE.data.ItemType.Weapon, subType: AE.data.WeaponSubType.Orb},
        "titan's hammer": {type: AE.data.ItemType.Weapon, subType: AE.data.WeaponSubType.Mace2H}
    };

    AE.data.ItemMaterials = {
        Silk: {name: 'silk', lvl: 2},
        Cotton: {name:'cotton', lvl: 0},
        Stone: {name:'stone', lvl: 0},
        Leather: {name:'leather', lvl:0},
        Wood: {name:'wood', lvl: 0},
        Bone: {name:'bone', lvl: 2},
        Bronze: {name:'bronze', lvl: 2},
        Iron: {name:'iron', lvl: 3},
        Steel: {name: 'steel', lvl: 4},
        QuickSteel: {name:'quicksteel', lvl: 5},
        Mithril: {name:'mithril', lvl: 7},
        Ebonwood: {name:'ebonwood', lvl: 8},
        Idrasil: {name:'idrasil', lvl: 8},
        Ethereal: {name:'ethereal', lvl: 8},
        Adamant: {name:'adamant', lvl: 9},

        // Seasonal
        CrimsonIce: {name: 'crimsonice', lvl: 5},
        ColdSteel: {name: 'coldsteel', lvl: 5},
        PermaFrost: {name: 'permafrost', lvl: 7}
    };

    AE.data.HomeData = {
        alcove: {size:5},
        'earthen spire': {size:300},
        'attic bedroom': {size:10},
        'lodge at inn': {size:12},
        hut: {size:15},
        camp: {size:14},
        "tinker's wagon": {size:12},
        cottage: {size:20},
        house: {size:30},
        shop:{size:25},
        inn: {size:50},
        lodge: {size:30},
        'gabled mansion': {size:65},
        'half-timber house': {size:75},
        cave: {size:25},
        pavilion: {size:50},
        'haunted manse': {size:75},
        'ancient ruins': {size:110},
        tower: {size:55},
        lighthouse: {size:80},
        cataract: {size:70},
        citadel: {size:200},
        academy: {size:300},
        temple: {size:200},
        'mage tower': {size:420},
        'idrasil seedling': {size:300},
        palace: {size:400},
        castle: {size:400},
        cove: {size:350},
        'volcanic lair': {size:200},
        cavern: {size:200},
        'enchanted grove': {size:420},
        'shrouded isle': {size:420}
    };

    AE.data.MountData = {
        'magic broomstick': {dist:115},
        'ebonwood broomstick': {dist:355},
        'flying carpet': {dist:300},
        mule: {dist:30},
        'old nag': {dist:30},
        'demure gelding': {dist:55},
        'fine bay': {dist:100},
        'skeletal charger': {dist:270},
        'fire charger': {dist:275},
        fly: {dist:525},
        'chariot of fire': {dist:550},
        pegasus: {dist:320},
        gryffon: {dist:325}
    };

    AE.data.GemCraftButtonDataKeys = {
        imbuelifegem: 0,
        imbuemanagem: 1,
        imbuebloodgem: 2,
        imbuefiregem: 3,
        imbueairgem: 4,
        imbueearthgem: 5,
        imbuewatergem: 6,
        imbuelightgem: 7,
        imbueshadowgem: 8,
        imbuespiritgem: 9
    };

})(window.jQuery); 
 
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
 
// Settings
(function($) {
    'use strict';

    const SettingsSaveKey = "at_settings";
    const SettingsVersion = 2;

    class AESettings {

        constructor() {
            this.data = {
                version: SettingsVersion,
                quickSlotTimes: [],
                quickSlotEnabled: [],
                quickSlotPresets: {},
                quickSlotPresetNames: {}
            };
        }

        initializeSettings(target){
            if(target.quickSlotEnabled === undefined){
                target.quickSlotEnabled = [];
            }

            if(target.quickSlotTimes === undefined) {
                target.quickSlotTimes = [];
            }

            if(this.data.quickSlotPresets === undefined) {
                this.data.quickSlotPresets = {};
            }

            if(this.data.quickSlotPresetNames === undefined) {
                this.data.quickSlotPresetNames = {};
            }

            for(let i = 0; i < AE.config.quickSlotCount; i++) {
                if(i === target.quickSlotTimes.length) {
                    target.quickSlotTimes.push(undefined);
                }

                if(target.quickSlotTimes[i] === null) {
                    target.quickSlotTimes[i] = undefined;
                }

                if(i === target.quickSlotEnabled.length) {
                    target.quickSlotEnabled.push(true);
                }
            }

            target.version = SettingsVersion;
        }

        save() {
            localStorage.setItem(SettingsSaveKey, JSON.stringify(this.data));
        }

        load() {
            let data = localStorage.getItem(SettingsSaveKey);
            if(data === undefined || data === null){
                return;
            }

            AE.log("Loading Settings...");
            let newSettings = JSON.parse(data);
            if(newSettings === undefined || newSettings === null){
                return;
            }

            this.initializeSettings(newSettings);
            this.data = newSettings;
            AE.log("Done");
        }
    }

    AE.settings = new AESettings();

})(window.jQuery); 
 
// Damage Meter
(function($) {
    'use strict';

    const DamageMeterHTML = `
    <div id="at_dmg_meter" style="height: 200px;">
        <div id="at_dmg_meter_header" style="background-color: lightgrey; display: flex;">
            <span id="at_dmg_meter_header_title" style="margin-top: 6px">Damage</span>
            <div style="margin-left: auto;">
                <button id="at_dmg_meter_change_mode">M</button>
                <button id="at_dmg_meter_reset">R</button>
            </div>            
        </div>
        <table id="at_dmg_meter_values" style="width: 100%">
            <thead>
                <tr style="display: block">
                    <th style="width: 80px">Name</th>
                    <th style="width: 70px">Value</th>
                    <th>/s</th>
                </tr>            
            </thead>
            <tbody style="display:block;overflow:auto;height:130px;width:100%;">
                            
            </tbody>
        </table>
    </div>
    `;

    const DamageMeterEntry = `
    <tr id="at_dmg_meter_entry_{{id}}">
        <td >{{name}}</td>
        <td style="width: 50px">{{damage}}</td>
        <td style="width: 50px">{{dps}}</td>
    </tr>
    `;

    const DamageMeterMode = {
        Default: 0,
        DamageDoneBySource: 1,
        DamageTakenBySource: 2,
        OtherFriend: 3,
        OtherFoe: 4
    };

    const CombatHitRegex = /(.*)\shits\s(strongly )*(.*?):\s*([0-9\.]+)\s*(\(absorb: ([0-9\.]+)%\))*/i;
    const CombatParryRegex = /(.*)\s(parries|dodges)\s(.*)/i;
    const CombatLifeStealRegex = /(.*)\ssteals\s([0-9\.]+)\slife/i;

    class AEDamageMeter {
        constructor() {
            this.combatStats = {};
            this.mode = DamageMeterMode.Default;
            this.lastCombatLogLine = undefined;
        }

        load() {
            this.resetCombatStats();

            let parent = $('div.log-view');

            let panel = $(DamageMeterHTML);
            parent.append(panel);

            $('#at_dmg_meter_change_mode').click(this.toggleMode.bind(this));
            $('#at_dmg_meter_reset').click(this.resetCombatStats.bind(this));
        }

        hide(){
            let meter = $('#at_dmg_meter');
            if(meter.length === 0){
                return;
            }

            meter.hide();
        }

        update(delta) {
            let meter = $('#at_dmg_meter');
            if(meter.length === 0){
                return;
            }

            // Only show in adventure tab
            let root = $('div.adventure');
            if(root.length === 0){
                this.hide();
                return;
            }

            meter.show();

            this.parseCombatants();
            this.parseCombatLog();

            this.combatStats.combatTime += delta / 1000;

            switch (this.mode) {
                case DamageMeterMode.Default:
                {
                    this.refreshValuesSource(this.combatStats.damage);
                    break;
                }

                case DamageMeterMode.DamageDoneBySource: {
                    this.refreshValuesSource(this.combatStats.damageDoneBySource);
                    break;
                }

                case DamageMeterMode.DamageTakenBySource: {
                    this.refreshValuesSource(this.combatStats.damageTakenBySource);
                    break;
                }

                case DamageMeterMode.OtherFriend: {
                    this.refreshValuesSource(this.combatStats.otherFriend);
                    break;
                }

                case DamageMeterMode.OtherFoe: {
                    this.refreshValuesSource(this.combatStats.otherFoe);
                    break;
                }
            }
        }

        refreshValuesSource(sourceData){
            let meterValues= $('#at_dmg_meter_values').find('tbody');
            meterValues.empty();

            let sortedDamage = [];
            for(let source in sourceData) {
                sortedDamage.push([source, sourceData[source]]);
            }

            sortedDamage.sort(function(a, b) {
                return b[1] - a[1];
            });

            for(let i = 0; i < sortedDamage.length; i++) {
                let entry = sortedDamage[i];
                let damageValue = sourceData[entry[0]];
                let dps = damageValue / this.combatStats.combatTime;
                let templateValues = {
                    id: entry[0].replace(" ", ""),
                    name: entry[0],
                    damage: Math.floor(damageValue),
                    dps: dps.toFixed(2)
                };

                let entrySelf = $(AE.utils.processTemplate(DamageMeterEntry, templateValues));
                meterValues.append(entrySelf);
            }
        }

        syncCombatants(target, source) {
            for(let i = 0; i < source.length; i++) {
                let name = source[i];
                if(target[name] === undefined){
                    target[name] = 0
                }
            }
        }

        parseCombatants() {
            let combatRoot = $('div.combat');
            if(combatRoot.length === 0) {
                return;
            }

            let groups = combatRoot.find('div.npc-group');
            if(groups.length !== 2) {
                return;
            }

            //friends are first group
            let npcNames = [];
            $(groups[0]).find('span.name-span').each(function() {
                let name = $(this).children()[0].innerText.trim();
                if(name === ""){
                    return;
                }

                npcNames.push(name);
            });

            this.syncCombatants(this.combatStats.friend, npcNames);

            npcNames = [];
            $(groups[1]).find('span.name-span').each(function() {
                let name = $(this).children()[0].innerText.trim();
                if(name === "") {
                    return;
                }

                npcNames.push(name);
            });

            this.syncCombatants(this.combatStats.foe, npcNames);
        }

        parseCombatLog() {
            let log = $('div.raid-bottom').find('div.outlog');
            if(log.length === 0) {
                return;
            }

            let combatLogUpToDate = false;
            let newCombatLogLines = [];
            log.find('div.log-item').each(function() {
                if(combatLogUpToDate === true) {
                    return;
                }

                if($(this).find('span.log-title').length > 0){
                    return;
                }

                let line = $(this).find('span.log-text').text();
                if(AE.damageMeter.lastCombatLogLine !== undefined && line === AE.damageMeter.lastCombatLogLine) {
                    // Consider this the end of the current log section
                    combatLogUpToDate = true;
                    return;
                }

                newCombatLogLines.push(line);
            });

            if(newCombatLogLines.length === 0) {
                return;
            }

            for(let i = 0; i < newCombatLogLines.length; i++){
                this.parseCombatLogLine(newCombatLogLines[i]);
            }

            AE.damageMeter.lastCombatLogLine = newCombatLogLines[0];
        }

        toggleMode(){
            switch (this.mode) {
                case DamageMeterMode.Default:
                {
                    $('#at_dmg_meter_header_title').text("Damage by Spell");
                    this.mode = DamageMeterMode.DamageDoneBySource;
                    break;
                }

                case DamageMeterMode.DamageDoneBySource:
                {
                    $('#at_dmg_meter_header_title').text("Received by Source");
                    this.mode = DamageMeterMode.DamageTakenBySource;
                    break;
                }

                case DamageMeterMode.DamageTakenBySource:
                {
                    $('#at_dmg_meter_header_title').text("Other (You)");
                    this.mode = DamageMeterMode.OtherFriend;
                    break;
                }

                case DamageMeterMode.OtherFriend:
                {
                    $('#at_dmg_meter_header_title').text("Other (Enemy)");
                    this.mode = DamageMeterMode.OtherFoe;
                    break;
                }

                case DamageMeterMode.OtherFoe:
                {
                    $('#at_dmg_meter_header_title').text("Damage");
                    this.mode = DamageMeterMode.Default;
                    break;
                }
            }

            this.update(0);
        }

        resetCombatStats() {
            this.combatStats = {
                damage: {
                    dealt: 0,
                    received: 0
                },
                combatTime: 0,
                friend: {},
                foe: {},
                damageDoneBySource: {},
                damageTakenBySource: {},
                otherFriend: {},
                otherFoe: {},
                unhandledLines: []
            };

            this.update(0);
        }

        combatRegisterDamageTaken(id, value) {
            if(this.combatStats.damageTakenBySource[id] === undefined) {
                this.combatStats.damageTakenBySource[id] = 0;
            }

            this.combatStats.damageTakenBySource[id] += value;
        }

        combatRegisterDamageDone(id, value) {
            if(this.combatStats.damageDoneBySource[id] === undefined) {
                this.combatStats.damageDoneBySource[id] = 0;
            }

            this.combatStats.damageDoneBySource[id] += value;
        }

        combatRegisterOtherFriendly(id, value = 1) {
            if(this.combatStats.otherFriend[id] === undefined) {
                this.combatStats.otherFriend[id] = 0;
            }

            this.combatStats.otherFriend[id] += value;
        }

        combatRegisterOtherFoe(id, value = 1) {
            if(this.combatStats.otherFoe[id] === undefined) {
                this.combatStats.otherFoe[id] = 0;
            }

            this.combatStats.otherFoe[id] += value;
        }

        parseCombatLogLine(line) {
            if(line === "") {
                return;
            }

            let lineStats = {
                ln: line,
                f: Object.keys(this.combatStats.foe)
            };

            let hitResult = CombatHitRegex.exec(line);
            if(hitResult !== null) {
                lineStats.hit = true;

                let source = hitResult[1].trim();
                let strongHit = hitResult[2] !== undefined;
                let target = hitResult[3].trim();
                let dmg = parseFloat(hitResult[4]);

                let absorb = undefined;
                if(hitResult[6] !== undefined) {
                    absorb = parseFloat(hitResult[6]);
                }

                let handled = false;
                for(let name in this.combatStats.friend) {
                    if (name === target) {
                        this.combatStats.damage.received += dmg;

                        this.combatRegisterDamageTaken(source, dmg);
                        if(strongHit === true) {
                            this.combatRegisterOtherFoe("crits");
                        }

                        if(absorb !== undefined){
                            this.combatRegisterOtherFriendly("absorb", absorb);
                        }

                        handled = true;
                    }
                }

                for(let name in this.combatStats.foe) {
                    if(name === target) {
                        this.combatStats.damage.dealt += dmg;

                        this.combatRegisterDamageDone(source, dmg);
                        if(strongHit === true) {
                            this.combatRegisterOtherFriendly("crits");
                        }

                        if(absorb !== undefined){
                            this.combatRegisterOtherFoe("absorb", absorb);
                        }

                        handled = true;
                    }
                }

                if(handled === true) {
                    return;
                }
            }

            let parryResult = CombatParryRegex.exec(line);
            if(parryResult !== null) {
                lineStats.parry = true;

                let source = parryResult[1].trim();
                let what = parryResult[2].trim();
                let target = parryResult[3].trim();
                let handled = false;
                for(let name in this.combatStats.friend) {
                    if (name === source) {
                        this.combatRegisterOtherFriendly(what);
                        handled = true;
                    }
                }

                for(let name in this.combatStats.foe) {
                    if(name === source) {
                        this.combatRegisterOtherFoe(what);
                        handled = true;
                    }
                }

                if(handled === true) {
                    return;
                }
            }

            let lifeStealResult = CombatLifeStealRegex.exec(line);
            if(lifeStealResult !== null) {
                lineStats.leech = true;

                let source = lifeStealResult[1].trim();
                let amount = parseFloat(lifeStealResult[2].trim());

                let handled = false;
                for(let name in this.combatStats.friend) {
                    if (name === source) {
                        this.combatStats.damage.dealt += amount;
                        this.combatRegisterDamageDone("lifesteal", amount);
                        handled = true;
                    }
                }

                for(let name in this.combatStats.foe) {
                    if(name === source) {
                        this.combatStats.damage.received += amount;
                        this.combatRegisterDamageTaken("lifesteel", amount);
                        handled = true;
                    }
                }

                if(handled === true) {
                    return;
                }
            }

            if(AE.config.enableDebugMode === true) {
                this.combatStats.unhandledLines.push(lineStats);
            }
        }
    }

    AE.damageMeter = new AEDamageMeter();

})(window.jQuery); 
 
// Quickslots
(function($) {
    'use strict';

    class AEQuickSlots {
        constructor() {
            this.suspendAutomation = false;
            this.target = [];
            this.cooldown = [];
        }

        load() {
            let slotId = 0;

            this.resetCooldown();

            $(".quickslot").each(function() {
                let inputRoot = $('<div id="at_qs_div_' + slotId +'" style="position:absolute; bottom:0px; left:0px; width:100%; opacity:0.75;height:20px;">');

                let input = $('<input id="at_qs_' + slotId +'" type="text" class="timeset" style="position: absolute; bottom: 0px; left: 0px; width:100%; font-weight:bold; opacity:0.75; text-align:center;">');
                inputRoot.append(input);

                input.change({id: slotId}, function(data) {
                    let newValue = parseFloat($(this).val());
                    if(isNaN(newValue) || newValue === undefined || newValue === null) {
                        newValue = undefined;
                    } else {
                        newValue = newValue * 1000;
                    }

                    AE.log("Setting QS " + data.data.id + " Time to " + newValue + " ms");

                    AE.settings.data.quickSlotTimes[data.data.id] = newValue;
                    AE.settings.save();
                });

                AE.quickSlots.target[slotId] = $(this);

                let enableCheck = $('<input id="at_qs_e_' + slotId +'" type="checkbox" style="position: absolute; bottom: 0px; right: -5px; width:20px; opacity:0.75;">');
                enableCheck.change({id: slotId}, function(data) {
                    AE.settings.data.quickSlotEnabled[data.data.id] = !AE.settings.data.quickSlotEnabled[data.data.id];
                    AE.settings.save();
                });

                inputRoot.append(enableCheck);

                $(this).append(inputRoot);

                slotId++;
            });

            let parent = $('div.quickbar');
            let buttonArea = $('<div id"at_qs_btn_area" style="margin-left: auto; display: flex; flex-direction: row;">');

            for(let i = 0; i < AE.config.quickSlotPresetCount; i++) {
                let presetArea = $('<div id="at_qs_preset' + i + '" style="display: flex; flex-direction: column; margin-right: 15px;">');
                buttonArea.append(presetArea);

                let header = $('<input id="at_qs_preset_name_' + i + '" type="text" class="timeset" style="width: 80px; font-weight:bold; text-align:center;"></input>');
                header.change({id: i}, function(data) {
                    if(AE.settings.data.quickSlotPresetNames === undefined) {
                        AE.settings.data.quickSlotPresetNames = {};
                    }

                    AE.settings.data.quickSlotPresetNames[data.data.id] = $(this).val();
                    AE.settings.save();
                });

                presetArea.append(header);

                let saveBtn = $('<button id="at_qs_presetbtn_save"' + i + '>Save</button>');
                saveBtn.click({id: i}, function(data){
                    AE.quickSlots.savePreset(data.data.id);
                });

                presetArea.append(saveBtn);

                let loadBtn = $('<button id="at_qs_presetbtn_load"' + i + '>Load</button>');
                loadBtn.click({id: i}, function(data) {
                    AE.quickSlots.loadPreset(data.data.id);
                });

                presetArea.append(loadBtn);
            }

            let suspendButton = $('<button id="at_qs_suspend" style="margin-left: auto;">Suspend</button>');
            suspendButton.click(function() {
                AE.quickSlots.suspendAutomation = !AE.quickSlots.suspendAutomation;
                AE.log("Quickslot Disabled: " + AE.quickSlots.suspendAutomation);
                $(this).text(AE.quickSlots.suspendAutomation === true ? "Resume" : "Suspend");
                AE.quickSlots.resetCooldown();
            });

            buttonArea.append(suspendButton);
            parent.append(buttonArea);

            this.updateDisplay();
        }

        resetCooldown() {
            for(let i = 0; i < AE.config.quickSlotCount; i++) {
                this.cooldown[i] = 0;
            }
        }

        savePreset(id) {
            if(AE.settings.data.quickSlotPresets === undefined) {
                AE.settings.data.quickSlotPresets = {};
            }

            AE.settings.data.quickSlotPresets[id] = JSON.stringify({
                n: AE.settings.data.quickSlotPresetNames[id],
                t: AE.settings.data.quickSlotTimes,
                e: AE.settings.data.quickSlotEnabled
            });

            AE.log("Saving Preset " + id);

            AE.settings.save();
        }

        loadPreset(id) {
            if(AE.settings.data.quickSlotPresets === undefined) {
                return;
            }

            let data = AE.settings.data.quickSlotPresets[id];
            if(data === undefined) {
                return;
            }

            let preset = JSON.parse(data);
            if(preset === undefined) {
                return;
            }

            AE.log("Loading Preset " + id);
            if(preset.n !== undefined) {
                AE.settings.data.quickSlotPresetNames[id] = preset.n;
            }

            if(preset.t !== undefined && preset.t.length === AE.settings.data.quickSlotTimes.length) {
                for(let i = 0; i < preset.t.length; i++) {
                    if(preset.t[i] === null) {
                        preset.t[i] = undefined;
                    }
                }

                AE.settings.data.quickSlotTimes = preset.t;
            }

            if(preset.e !== undefined && preset.e.length === AE.settings.data.quickSlotEnabled.length) {
                AE.settings.data.quickSlotEnabled = preset.e;
            }

            AE.settings.save();
            this.updateDisplay();
        }

        updateDisplay() {
            for(let i = 0; i < AE.config.quickSlotCount; i++){
                let el = $('#at_qs_' + i);
                let elEnabled = $('#at_qs_e_' + i);
                let time = AE.settings.data.quickSlotTimes[i];
                let enabled = AE.settings.data.quickSlotEnabled[i];
                if(time === undefined){
                    el.val("");
                } else {
                    el.val(time / 1000);
                }

                elEnabled.prop('checked', enabled);
            }

            for(let i = 0; i < AE.config.quickSlotPresetCount; i++) {
                let el = $('#at_qs_preset_name_' + i);
                if(AE.settings.data.quickSlotPresetNames !== undefined && AE.settings.data.quickSlotPresetNames[i] !== undefined){
                    el.val(AE.settings.data.quickSlotPresetNames[i]);
                } else {
                    el.val("Preset " + (i + 1));
                }
            }
        }

        update(delta) {
            if(this.suspendAutomation === true) {
                return;
            }

            for(let i = 0; i < AE.config.quickSlotCount; i++){
                let target = this.target[i];
                let time = AE.settings.data.quickSlotTimes[i];
                let enabled = AE.settings.data.quickSlotEnabled[i];
                if (target === undefined || time === undefined ||enabled === false) {
                    continue;
                }

                let clickTarget = target.find('div');
                this.cooldown[i] -= delta;
                if(this.cooldown[i] < 0){
                    clickTarget[0].click();
                    this.cooldown[i] = time;
                }
            }
        }
    }

    AE.quickSlots = new AEQuickSlots();

})(window.jQuery); 
 
// Imbue Gem Shortcut
(function($) {
    'use strict';

    class AEImbueGemShortcut {
        constructor() {
            this.imbueGemCraftButtonPinned = false;
        }

        update(delta) {
            let taskArea = $('div.main-tasks');
            if(taskArea.length === 0) {
                return;
            }

            let imbueSpan = $('#at_imbue_gems');

            let gemCraftButtons = AE.pageUtils.getUpgradeButtons(AE.data.GemCraftButtonDataKeys);
            if(gemCraftButtons.length === 0) {
                if(imbueSpan.length !== 0) {
                    imbueSpan.remove();
                }

                return false;
            }

            if(imbueSpan.length === 0) {
                this.imbueGemCraftButtonPinned = false;
                imbueSpan = $('<span id="at_imbue_gems" class="task-btn hidable"></span>');
                let imbueSpanBtn = $('<button id="at_imbue_gems_btn" class="wrapped-btn">Imbue All Gems</button>')
                imbueSpanBtn.click(function(event) {
                    if(event !== undefined && event.originalEvent !== undefined && event.originalEvent.ctrlKey === true) {
                        AE.imbueGemShortcut.imbueGemCraftButtonPinned = !AE.imbueGemShortcut.imbueGemCraftButtonPinned;
                        if(AE.imbueGemShortcut.imbueGemCraftButtonPinned === true) {
                            $(this).css('background-color', 'lightblue');
                        } else {
                            $(this).css('background-color', '');
                        }

                        return;
                    }

                    let gemCraftButtons = AE.pageUtils.getUpgradeButtons(AE.data.GemCraftButtonDataKeys);
                    for(let i = 0; i < gemCraftButtons.length; i++){
                        $(gemCraftButtons[i]).click();
                    }
                });

                imbueSpan.append(imbueSpanBtn);
                gemCraftButtons[0].parent().before(imbueSpan);
            } else {
                if(this.imbueGemCraftButtonPinned === true) {
                    $('#at_imbue_gems_btn').click();
                }
            }
        }
    }

    AE.imbueGemShortcut = new AEImbueGemShortcut();

})(window.jQuery); 
 
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
 
// Page Style helpers
(function($) {
    'use strict';

    class AEPageStyle {
        update(delta) {
            this.updateTopBarBuffView();
            this.updateResourceList();
        }

        updateTopBarBuffView() {
            let root = $('div.top-bar');
            if(root.length === 0) {
                return;
            }

            let buffBar = root.find('div.dot-view');
            if(buffBar.length === 0) {
                return;
            }

            buffBar.find('div.dot').each(function() {
                let countdownSpan = $(this).children()[0];
                let titleSpan = $(this).children()[1];
                let timeLeft = parseInt(countdownSpan.innerText);
                if(timeLeft < 10) {
                    $(countdownSpan).css('color', 'red');
                } else {
                    $(countdownSpan).css('color', '');
                }

                $(titleSpan).css('white-space', 'normal');
                $(this).css('width', '60px').css('height', '60px');
            });
        }

        updateResourceList() {
            let list = $('div.res-list');
            list.css('min-width', '18rem');

            // Color resources values, 0 empty, full green
            list.find('div.rsrc').each(function() {
                let el = $(this).find('.num-align');
                let values = AE.pageUtils.getValues(el.text().split('/'));
                if(values.current === values.max) {
                    el.css('color', '#00b800');
                } else if(values.current === 0) {
                    el.css('color', '#FF0000');
                } else if(values.pct >= 0.9) {
                    el.css('color', '#80b800');
                } else if(values.pct <= 0.1) {
                    el.css('color', '#ff8000');
                } else {
                    el.css('color', '#000000');
                }
            });
        }
    }

    AE.pageStyle = new AEPageStyle();

})(window.jQuery); 
 
// Tab Style helpers
(function($) {
    'use strict';

    class AETabStyle {
        constructor() {
        }

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
 
// Debug
(function($) {
    'use strict';

    class AEDebug {
        constructor() {
        }

        load() {
            let parent = $('div.quickbar');
            if(parent.length === 0) {
                return;
            }

            let button = $('<button id="at_Debug_btn" style="margin-left: auto;">Debug</button>');
            button.click(this.printDebugInfo);
            parent.append(button);
        }

        printDebugInfo() {
            console.log(AE.damageMeter.combatStats);
        }
    }

    AE.debug = new AEDebug();

})(window.jQuery); 
 
// Loader
(function($) {
    'use strict';

    class AELoader {
        load() {
            this.checkForOtherScripts();

            AE.settings.load();
            AE.pageUtils.checkData();
            AE.playerState.initialize();

            this.loadHtmlModifications();

            AE.interval.add(this.reloadCheck.bind(this), 2000);
            AE.interval.add(AE.pageStyle.update.bind(AE.pageStyle), AE.config.uiUpdateInterval);
            AE.interval.add(AE.playerState.update.bind(AE.playerState), AE.config.minUpdateInterval);
            AE.interval.add(AE.tabStyle.update.bind(AE.tabStyle), AE.config.uiUpdateInterval);
            AE.interval.add(AE.imbueGemShortcut.update.bind(AE.imbueGemShortcut), AE.config.uiUpdateInterval);

            if(AE.config.arcanumAutomationPresent !== true) {
                AE.interval.add(AE.quickSlots.update.bind(AE.quickSlots), AE.config.minUpdateInterval);
            }

            AE.interval.add(AE.damageMeter.update.bind(AE.damageMeter), 250);
        }

        checkForOtherScripts() {
            let arcanumAutomationConfig = $('#automate_config');
            if(arcanumAutomationConfig.length === 1) {
                AE.log("Arcanum Automation Script Detected, disabling some features!");
                AE.config.arcanumAutomationPresent = true;
            }
        }

        loadHtmlModifications() {
            if(AE.config.arcanumAutomationPresent !== true) {
                AE.quickSlots.load();
            }

            AE.damageMeter.load();
            AE.saveUtils.load();

            if (AE.config.enableDebugMode === true) {
                AE.debug.load();
            }

            let reloadCheckElement = $('<div id="at_reload_check" style="display: none"/>');
            $('div.top-bar').append(reloadCheckElement);
        }

        reloadCheck() {
            let el = $('#at_reload_check');
            if(el.length === 0) {
                AE.log("Reload Required, page state changed");
                AE.playerState.initialize();
                this.loadHtmlModifications();
            }
        }
    }

    AE.loader = new AELoader();

})(window.jQuery); 
 
(function($) {
    'use strict';

    let initializeDelay = 3000;

    let isLoaded = false;
    let lastUpdate = 0;

    // -------------------------------------------------------------------
    // Update
    // -------------------------------------------------------------------
    function update(timestamp) {
        tick(timestamp);
        window.requestAnimationFrame(update);
    }

    function tick(timestamp) {
        let quickBar = $(".quickbar");
        if (quickBar.length === 0) {
            return;
        }

        if(lastUpdate === 0) {
            lastUpdate = timestamp;
        }

        let delta = timestamp - lastUpdate;
        lastUpdate = timestamp;

        if(initializeDelay > 0) {
            initializeDelay -= delta;
            return;
        }

        if(isLoaded === false) {
            AE.log("Loading...");
            AE.loader.load();
            isLoaded = true;
            AE.log(" Done!");
        }

        AE.interval.update(delta);
    }

    update();

})(window.jQuery); 
 
