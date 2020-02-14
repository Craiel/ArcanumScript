// ==UserScript==
// @name         Arcanum Enhancements
// @version      1737.1
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

        arrayEquals(a, b) {
            if (a === b) return true;
            if (a == null || b == null) return false;
            if (a.length != b.length) return false;

            // If you don't care about the order of the elements inside
            // the array, you should sort both arrays here.
            // Please note that calling sort on an array will modify that array.
            // you might want to clone your array first.

            for (let i = 0; i < a.length; ++i) {
                if (a[i] !== b[i]) return false;
            }

            return true;
        }

        createOptionsToggle(id, title, callback, defaultValue){
            let toggle = $('<span class="opt"></span>');
            let toggleInput = $('<input id="' + id + '" type="checkbox"><label for="' + id + '">' + title + '</label></input>');
            if(defaultValue === true) {
                toggleInput.prop('checked', true);
            }

            toggle.append(toggleInput);
            toggleInput[0].addEventListener("change", event => {
                callback(event.target.checked);
            }, false);

            return toggleInput;
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
        uiUpdateInterval: 250
    }

})(window.jQuery); 
 
// Data
(function($) {
    'use strict';

    class AEData {
        constructor() {
            this.gameVersionKongregate = 1731;
            this.gameVersionLerpingLemur = 1358;
            this.gameVersionOutdatedThreshold = 1400;
        }

        getTaskGroup(dataId) {
            for(let key in this.TaskGroups) {
                let values = this.TaskGroups[key];
                if(values.includes(dataId)) {
                    return key;
                }
            }

            return undefined;
        }
    }

    AE.data = new AEData();

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

    AE.data.ItemSlot = {
        WeaponLeft: 'left',
        WeaponRight: 'right',
        Head: 'head',
        Hands: 'hands',
        Back: 'back',
        Waist: 'waist',
        Neck: 'neck',
        Finger: 'finger',
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

    AE.data.SpecialItems = {
        'orb of winters': {type: AE.data.ItemType.Weapon, subType: AE.data.WeaponSubType.Orb},
        "titan's hammer": {type: AE.data.ItemType.Weapon, subType: AE.data.WeaponSubType.Mace2H}
    };

    AE.data.GemImbueTaskIds = ['imbuelifegem', 'imbuemanagem', 'imbuebloodgem', 'imbuefiregem',
        'imbueairgem', 'imbueearthgem', 'imbuewatergem', 'imbuelightgem', 'imbueshadowgem', 'imbuespiritgem'];

    AE.data.ClassUpgradeTasks = ['apprentice', 'falconer', 'herbalist', 'scribe', 'neophyte', 'adept', 'blueadept', 'savant',
        'magician', 'darkmagician', 'reanimator', 'witch', 'trickster', 'madcap', 'bonemonger', 'thanophage', 'battlemage',
        'bladeweaver', 'arcanedervish', 'eldritchknight', 'spellblade', 'dreadlord', 'warlock', 'bloodmage', 'summoner', 'warden',
        'alchemist', 'enchanter', 'geomancer', 'earthshaker', 'titan', 'pyromancer', 'hydromancer', 'windmage', 'stormcaller',
        'elementalist', 'sorcerer', 'druid', 'highelemental', 'oracle', 'seer', 'mage', 'highmage', 'doomsayer', 'fey',
        'thaumaturge', 'necromancer', 'wizard', 'wizard2', 'kell', 'greynecromancer', 'archlock', 'heresiarch', 'highkell',
        'necro3', 'deathlock', 'wizard3', 'astralseer', 'c_avatar'];

    AE.data.TaskGroups = {
        'Rest': ['rest', 'slumber', 'naturecamp', 'chant', 'eatchildren'],
        'Gold': ['cleanstables', 'sellscroll', 'sellherbs', 'sellgem', 'pouch', 'thievery', 'readpalms', 'service', 'spingold',
            'embalm', 'paidseance', 'heist', 'magicadvice', 'chores', 'treatailments', 'errands', 'prestidigitation', 'act_mine',
            'purse', 'restless'],
        'Research': ['buyscroll', 'scribescroll', 'sublimate', 'bindcodex', 'compiletome', 'pace', 'act_element', 'mapstars',
            'grind', 'study', 'spellbook', 'act_garden', 'act_scry', 'act_concoct', 'bestiary', 'sylvansyllabary', 'dwarfbook',
            'lemurlexicon', 'demondict', 'malleus', 'fazbitfixate', 'coporisfabrica', 'unendingtome', 'almagest'],
        'Bones, Bodies and Evil things': ['bloodsiphon', 'graverob', 'murder', 'vileexperiment', 'dissect', 'dissect cadaver', 'grindbones', 'trapsoul'],
        'Gems': ['buygem', 'gembox', 'craftgem', 'gemcraft', 'terraform', 'artificialmountain', 'advgems'].concat(AE.data.GemImbueTaskIds),
        'Skills': ['focus', 'tendanimals', 'mythicanvil', 'geas', 'sabbat', 'a_travel', 'sombercandle', 'phylactory', 'animalfriend',
            'summonfamiliar', 'voidtouch', 'a_oppress', 'alkahest', 'dreamcatcher'],
        'Dreams': ['dreamweaver', 'starwish'],
        'Puppeteer': ['assemblemachina', 'assembleautomata', 'assemblepuppet', 'futurecouncil', 'machinalabor', 'puppetshow'],
        'Home': ['fireplane', 'airplane', 'waterplane', 'earthplane'],
        'Runes': ['up_runecrafter', 'craftrune', 'craftfirerune', 'craftearthrune', 'craftairrune', 'craftwaterrune', 'craftspiritrune'],
        'Misc': ['gatherherbs', 'wizardhall', 'hattrick', 'craftschematic', 'indulge', 'timesiphon'],
        'Mount': ['flyingcarpet', 'mule', 'oldnag', 'gelding', 'bayhorse', 'firecharger', 'fly', 'gryffonmount', 'firechariot', 'magicbroomstick',
            'ebonwoodbroomstick', 'pegasusmount'],
        'Combat and Spells': ['codexannih', 'markhulcodex', 'maketitanhammer', 'up_lich'],
        'Class': AE.data.ClassUpgradeTasks,

        '❄ Winter': ['meltsnowman', 'makesnowman', 'restincottage', 'winteraward', 'winterchill', 'warmpotion', 'hearthexpansion', 'icystudy',
            'w_fazbit1', 'w_fazbit2', 'w_fazbit3', 'winterhowl', 'preparetree', 'good_sacrifice', 'w_scholar', 'w_fame', 'w_multitask', 'w_fazbit4']
    };

    AE.data.UpgradeTasks = ['pouch', 'purse', 'gembox', 'gemcraft', 'artificialmountain', 'mythicanvil', 'up_runecrafter',
        'wizardhall', 'winteraward', 'fireplane', 'airplane', 'waterplane', 'warmpotion', 'winterchill', 'advgems', 'sombercandle',
        'hearthexpansion', 'flyingcarpet', 'mule', 'oldnag', 'gelding', 'bayhorse', 'firecharger', 'fly', 'gryffonmount', 'spellbook',
        'bestiary', 'codexannih', 'markhulcodex', 'sylvansyllabary', 'dwarfbook', 'lemurlexicon', 'demondict', 'malleus', 'maketitanhammer',
        'fazbitfixate', 'coporisfabrica', 'unendingtome', 'almagest', 'phylactory', 'up_lich', 'animalfriend', 'summonfamiliar', 'icystudy',
        'firechariot', 'earthplane', 'voidtouch', 'w_fazbit1', 'w_fazbit2', 'w_fazbit3', 'magicbroomstick', 'ebonwoodbroomstick', 'pegasusmount',
        'winterhowl', 'preparetree', 'good_sacrifice', 'w_scholar', 'w_fame', 'w_multitask', 'w_fazbit4', 'alkahest', 'restless', 'dreamcatcher'];



})(window.jQuery); 
 
// Generated Data
(function($) {
    'use strict';
    
    AE.data.ResourceData = {"gold":{"max":5},"research":{"max":10},"arcana":{"max":0},"bones":{"max":10},"skulls":{"max":5},"bonedust":{"max":10,"name":"bone dust"},"scrolls":{"max":10},"starcharts":{"max":10},"runestones":{"max":10,"name":"rune stones"},"firerune":{"max":10,"name":"flame runes"},"waterrune":{"max":10,"name":"water runes"},"spiritrune":{"max":10,"name":"spirit runes"},"airrune":{"max":10,"name":"air runes"},"earthrune":{"max":10,"name":"earth runes"},"timerune":{"max":3,"name":"time runes"},"bodies":{"max":1},"souls":{"max":1},"schematic":{"max":3,"name":"schematics"},"codices":{"max":10,"name":"Codices"},"tomes":{"max":5,"name":"Tomes"},"gems":{"max":5},"managem":{"max":2,"name":"arcane gem"},"firegem":{"max":2,"name":"fire gem"},"watergem":{"max":2,"name":"water gem"},"naturegem":{"max":2,"name":"nature gem"},"earthgem":{"max":2,"name":"earth gem"},"airgem":{"max":2,"name":"air gem"},"shadowgem":{"max":2,"name":"shadow gem"},"lightgem":{"max":2,"name":"light gem"},"spiritgem":{"max":2,"name":"spirit gem"},"bloodgem":{"max":2,"name":"blood gem"},"timegem":{"max":3},"voidgem":{"max":3},"ichor":{"max":5},"sindel":{"max":3,"name":"star shard"},"dreams":{"max":3},"herbs":{"max":10},"sulphur":{"max":10},"mercury":{"max":10},"space":{"max":0,"name":"floor space"},"mana":{"max":5,"name":"mana"},"fire":{"max":0},"air":{"max":0},"earth":{"max":0},"water":{"max":0},"nature":{"max":0},"shadow":{"max":0,"name":"shadow"},"light":{"max":0},"spirit":{"max":0},"tempus":{"max":0},"chaos":{"max":0},"void":{"max":0},"w_fazbitknowledge":{"max":100000,"name":"fazbit's knowledge"},"snowman":{"max":5,"name":"snomunculus"},"livingsnow":{"max":20},"frost":{"max":80},"winteressence":{"max":10000,"name":"essence of winter"},"emblemofice":{"max":1,"name":"emblem of ice"},"ice":{"max":0},"snowdrop":{"max":5,"name":"snowdrop"},"puppets":{"max":20},"machinae":{"max":20,"name":"machinae"},"automatas":{"max":20,"name":"automata"}};
    
    AE.data.PotionData = {"pot_poisonward":{"name":"poison ward"},"pot_mana1":{"name":"draught of mana"},"pot_heal1":{"name":"minor healing"},"pot_stam1":{"name":"draught of stamina"},"pot_stam2":{"name":"potion of stamina"},"pot_ironskin":{"name":"ironskin salve"},"pot_adamant":{"name":"adamant salve"},"hestiabrew":{"name":"hestia's homebrew"},"pot_waterward":{"name":"water ward"},"pot_fireward":{"name":"fire ward"},"pot_heal3":{"name":"healing potion"},"pot_truestrike":{"name":"true striking"},"pot_serenity":{"name":"serenity"},"pot_godspeed":{"name":"godspeed"},"pot_godsblood":{"name":"god's blood"}};
    
    AE.data.EnchantItemNotations = ["of luck","of mana","of energy","of life","of regeneration","of biting","of fire","of water","of earth","of air","of speed","of clarity","of spells","of sanity","of refreshing","of spells","of deception","of colors"];
    AE.data.EnchantNameLookup = {"sturdy armor":"en_armor1","luck":"en_luck1","mana":"en_mana1","energy":"en_energy1","life pool":"en_hp1","regeneration":"en_regen1","biting edge":"en_dmg1","quick boots":"en_speed1","fire ring":"en_fire1","water ring":"en_water1","earth ring":"en_earth1","air ring":"en_air1","quick boots ii":"en_speed2","quick boots iii":"en_speed3","quick boots iv":"en_speed4","clarity":"en_clarity","spellcraft":"en_scraft","courage":"en_courage","sanity":"en_sanity","refreshment":"en_stam1","keen weapon":"en_tohit1","spellcraft ii":"en_scraft2","deception":"en_decep","prismatic ring":"en_prisma"};
    AE.data.EnchantData = {"en_armor1":{"level":1,"name":"sturdy armor","target":["armor"],"mods":{"armor":1}},"en_luck1":{"level":1,"name":"luck","target":["ring"],"mods":{"luck":1}},"en_mana1":{"level":1,"name":"mana","target":["ring"],"mods":{"mana":{"max":1}}},"en_energy1":{"level":1,"name":"energy","target":["ring"],"mods":{"mana":{"rate":0.01}}},"en_hp1":{"level":1,"name":"life pool","target":["neck"],"mods":{"hp":{"max":4}}},"en_regen1":{"level":2,"name":"regeneration","target":["neck"],"mods":{"hp":{"rate":0.2}}},"en_dmg1":{"level":1,"name":"biting edge","target":["weapon"],"mods":{"attack":{"bonus":1}}},"en_speed1":{"level":1,"name":"quick boots","target":["feet"],"mods":{"speed":0.5}},"en_fire1":{"level":1,"name":"fire ring","target":["ring"],"mods":{"firelore":{"max":1},"fire":{"rate":0.2}}},"en_water1":{"level":1,"name":"water ring","target":["ring"],"mods":{"waterlore":{"max":1},"water":{"rate":0.2}}},"en_earth1":{"level":1,"name":"earth ring","target":["ring"],"mods":{"earthlore":{"max":1},"earth":{"rate":0.2}}},"en_air1":{"level":1,"name":"air ring","target":["ring"],"mods":{"airlore":{"max":1},"air":{"rate":0.2}}},"en_speed2":{"level":3,"name":"quick boots II","target":["feet"],"mods":{"speed":2}},"en_speed3":{"level":5,"name":"quick boots III","target":["feet"],"mods":{"speed":5}},"en_speed4":{"level":7,"name":"quick boots IV","target":["feet"],"mods":{"speed":8}},"en_clarity":{"level":3,"name":"clarity","target":["head"],"mods":{"bf":{"rate":-0.5}}},"en_scraft":{"level":3,"name":"spellcraft","target":["armor","weapon"],"mods":{"scraft":1}},"en_courage":{"level":5,"name":"courage","target":["waist"],"mods":{"unease":{"rate":-0.5}}},"en_sanity":{"level":6,"name":"sanity","target":["head"],"mods":{"madness":{"rate":-1}}},"en_stam1":{"level":7,"name":"refreshment","target":["ring"],"mods":{"stamina":{"rate":0.3}}},"en_tohit1":{"level":1,"name":"keen weapon","target":["weapon"],"mods":{"attack":{"tohit":2}}},"en_scraft2":{"level":6,"name":"spellcraft II","target":["armor","weapon"],"mods":{"scraft":2}},"en_decep":{"level":9,"name":"deception","target":["back"],"mods":{"trickery":2}},"en_prisma":{"level":8,"name":"prismatic ring","target":["ring"],"mods":{"prismatic":{"rate":0.5}}}};
    
    AE.data.MaterialData = {"silk":{"level":2},"cotton":{"level":0},"stone":{"level":0},"leather":{"level":0},"wood":{"level":0},"bone":{"level":2},"bronze":{"level":2},"iron":{"level":3},"steel":{"level":4},"quicksteel":{"level":5},"mithril":{"level":7},"ebonwood":{"level":8},"idrasil":{"level":8},"ethereal":{"level":8},"adamant":{"level":9},"crimsonice":{"level":5},"coldsteel":{"level":5},"permafrost":{"level":7}};
    
    AE.data.HomeData = {"alcove":{"name":"alcove","size":5},"earthspire":{"name":"earthen spire","size":300},"atticbedroom":{"name":"Attic Bedroom","size":10},"innroom":{"name":"Lodge at Inn","size":12},"hut":{"name":"hut","size":15},"camp":{"name":"camp","size":14},"wagon":{"name":"tinker's wagon","size":12},"cottage":{"name":"cottage","size":20},"house":{"name":"house","size":30},"shop":{"name":"shop","size":25},"inn":{"name":"inn","size":50},"lodge":{"name":"lodge","size":30},"gabledhouse":{"name":"gabled mansion","size":65},"halftimber":{"name":"half-timber house","size":75},"cave":{"name":"cave","size":25},"pavilion":{"name":"pavilion","size":50},"hauntedmanse":{"name":"haunted manse","size":75},"ancientruins":{"name":"ancient ruins","size":110},"tower":{"name":"tower","size":55},"lighthouse":{"name":"lighthouse","size":80},"cataract":{"name":"cataract","size":70},"citadel":{"name":"citadel","size":200},"academy":{"name":"academy","size":300},"temple":{"name":"temple","size":200},"magetower":{"name":"mage tower","size":420},"sm_idrasil":{"name":"idrasil seedling","size":300},"palace":{"name":"palace","size":400},"castle":{"name":"castle","size":400},"cove":{"name":"cove","size":350},"volcano":{"name":"volcanic lair","size":200},"cavern":{"name":"cavern","size":200},"grove":{"name":"Enchanted Grove","size":420},"island":{"name":"Shrouded Isle","size":420},"wildcamp":{"name":"wild's encampment","size":40},"clockworkhome":{"name":"clockwork home","size":50}};
    AE.data.HomeNameLookup = {"alcove":"alcove","earthen spire":"earthspire","attic bedroom":"atticbedroom","lodge at inn":"innroom","hut":"hut","camp":"camp","tinker's wagon":"wagon","cottage":"cottage","house":"house","shop":"shop","inn":"inn","lodge":"lodge","gabled mansion":"gabledhouse","half-timber house":"halftimber","cave":"cave","pavilion":"pavilion","haunted manse":"hauntedmanse","ancient ruins":"ancientruins","tower":"tower","lighthouse":"lighthouse","cataract":"cataract","citadel":"citadel","academy":"academy","temple":"temple","mage tower":"magetower","idrasil seedling":"sm_idrasil","palace":"palace","castle":"castle","cove":"cove","volcanic lair":"volcano","cavern":"cavern","enchanted grove":"grove","shrouded isle":"island","wild's encampment":"wildcamp","clockwork home":"clockworkhome"};
    
    AE.data.MountData = {"magicbroomstick":{"name":"magic broomstick","distance":115},"ebonwoodbroomstick":{"name":"ebonwood broomstick","distance":355},"flyingcarpet":{"name":"flying carpet","distance":300},"mule":{"name":"mule","distance":15},"oldnag":{"name":"old nag","distance":30},"gelding":{"name":"demure gelding","distance":55},"bayhorse":{"name":"fine bay","distance":100},"skelcharger":{"name":"skeletal charger","distance":270},"firecharger":{"name":"fire charger","distance":275},"fly":{"name":"fly","distance":525},"firechariot":{"name":"chariot of fire","distance":550},"pegasusmount":{"name":"pegasus","distance":320},"gryffonmount":{"name":"gryffon","distance":325}};
    AE.data.MountNameLookup = {"magic broomstick":"magicbroomstick","ebonwood broomstick":"ebonwoodbroomstick","flying carpet":"flyingcarpet","mule":"mule","old nag":"oldnag","demure gelding":"gelding","fine bay":"bayhorse","skeletal charger":"skelcharger","fire charger":"firecharger","fly":"fly","chariot of fire":"firechariot","pegasus":"pegasusmount","gryffon":"gryffonmount"};
    
})(window.jQuery);
     
 
// Generated Data
(function($) {
    'use strict';

    AE.data.ResourceData.stamina = {};
    AE.data.ResourceData.hp = {};

})(window.jQuery);
 
 
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
                    if(prop.name.includes(key)) {
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
 
// Page utils
(function($) {
    'use strict';

    const ItemPopupCompareDiv = `
<div id="at_item_popup_compare_div">
    <div class="note-text"><hr>equipped</div>    
</div>
`;

    const ItemPopupCompareDivContent = `<span id="at_item_popup_compare_text" class="separate"></span>`;

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
 
// Player State
(function($) {
    'use strict';

    class AEPlayerState {
        constructor() {
            this.activeTab = undefined;
            this.resources = {};
            this.resourceState = {};
            this.equippedItems = {};
            this.timeSinceResourceCompute = 0;
        }

        initialize(){
            for(let key in AE.data.ResourceData){
                this.resources[key] = {current: 0, max: 0};
                this.resourceState[key] = {
                    initialized: false,
                    diff: 0,
                    perSecond: 0,
                    lastUpdateState: {current: 0, max: 0}
                };
            }
        }

        update(delta) {
            this.updateResources();

            this.timeSinceResourceCompute += delta;
            if(this.timeSinceResourceCompute >= 1000) {
                this.timeSinceResourceCompute = 0;
                this.updateResourceState();
            }

            this.updateActiveTab();
        }

        getResourcePerSecond(key) {
            if(this.resourceState[key] === undefined) {
                return 0;
            }

            return this.resourceState[key].perSecond;
        }

        updateResourceState() {
            for(let key in AE.data.ResourceData) {
                let state = this.resourceState[key];
                let currentValue = this.resources[key];

                if(state.initialized === true) {
                    this.resourceState[key].perSecond = currentValue.current - state.lastUpdateState.current;
                }

                this.resourceState[key].lastUpdateState = currentValue;
                state.initialized = true;
            }
        }

        updateResources(){
            for(let key in AE.data.ResourceData) {
                let vitalValue = AE.pageUtils.getVitalValues(key);
                if(vitalValue !== undefined) {
                    this.resources[key] = vitalValue;
                } else {
                    this.resources[key] = AE.pageUtils.getResourceValues(key);
                }
            }
        }

        clearEquippedItems() {
            this.equippedItems = {};
        }

        registerEquippedItem(slot, itemProperties) {
            if(this.equippedItems[slot] === undefined) {
                this.equippedItems[slot] = [];
            }

            this.equippedItems[slot].push(itemProperties);
        }

        getEquippedItems(slots) {
            let results = [];
            for(let i = 0; i < slots.length; i++) {
                let items = this.equippedItems[slots[i]];
                if(items === undefined){
                    continue;
                }

                for(let k = 0; k < items.length; k++) {
                    results.push(items[k]);
                }
            }

            return results;
        }

        getEquippedItemToCompareFor(otherItem) {
            if(otherItem.itemSlot === undefined){
                return undefined;
            }

            let equippedItems = this.getEquippedItems(otherItem.itemSlot);
            if(equippedItems === undefined || equippedItems.length === 0) {
                return undefined;
            }

            // TODO: for now we compare against the first, this will not be good for dual wielding
            return equippedItems;
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
    const SettingsVersion = 3;

    class AESettings {

        constructor() {
            this.data = {
                version: SettingsVersion,
                quickSlotTimes: [],
                quickSlotEnabled: [],
                quickSlotPresets: {},
                quickSlotPresetNames: {},
                mainScreenAlternateDisplay: false,
                enchantScreenGroupedDisplay: false,
                gameVersion: undefined,
                sanctum: {}
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

            if(target.mainScreenAlternateDisplay === undefined) {
                target.mainScreenAlternateDisplay = false;
            }

            if(target.sanctum === undefined) {
                target.sanctum = {};
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
 
// Player State
(function($) {
    'use strict';

    const GroupHTML = `
<div id="{{id}}">
    <span style="margin-left: 5px; margin-top: 2px;">{{title}}</span>
    <div id="{{id}}_content" style="margin: 0;padding:var(--md-gap);display:grid;grid-template-columns: repeat( auto-fit, var(--task-button-width) );"/>
</div>`;

    class AETabStyleMain {
        constructor() {
            this.taskButtons = {};
            this.taskButtonOriginalParents = {};
            this.pinnedButtons = {};
            this.activeButtonRoot = undefined;
            this.imbueGemCraftButtonPinned = false;

            this.defaultGroup = 'Unsorted';
            this.upgradeActiveColor = '#ff5757AA';
            this.upgradeInactiveColor = '#feb3b3AA';
            this.classUpgradeInactiveColor = '#8fff57AA';
            this.classUpgradeActiveColor = '#c4ffa6AA';
            this.pinnedColor = '#5698ffAA';
        }

        clearState(){
            this.taskButtons = {};
            this.taskButtonOriginalParents = {};
            this.pinnedButtons = {};
            this.activeButtonRoot = undefined;
            this.imbueGemCraftButtonPinned = false;
        }

        updateUI(delta) {
            if (AE.playerState.activeTab !== AE.data.GameTabs.Main) {
                this.clearState();
                return;
            }

            let topRoot = $('div.main-tasks');
            if(topRoot.length === 0) {
                return;
            }

            this.updateMainTabAlternativeTaskDisplay();
            this.updateMainTabCustomBar();

            this.updateTaskButtonDisplay();
        }

        updateAutomation(delta) {
            let topRoot = $('div.main-tasks');
            if(topRoot.length === 0) {
                return;
            }

            this.updateImbueAllButton();
            this.updatePinnedButtons();
        }

        updateImbueAllButton() {
            let imbueButton = $('#at_imbue_gems_btn');
            if(imbueButton.length === 0) {
                return;
            }

            if(this.imbueGemCraftButtonPinned === true) {
                imbueButton.css('background-color', this.pinnedColor);
                imbueButton.click();
            } else {
                imbueButton.css('background-color', '');
            }
        }

        updatePinnedButtons() {
            for(let key in this.pinnedButtons) {
                if(this.pinnedButtons[key] !== true) {
                    continue;
                }

                let target = this.taskButtons[key];
                if(target === undefined){
                    continue;
                }

                $(target.btn).css('background-color', this.pinnedColor);

                this.clickTaskButton(key);
            }
        }

        updateTaskButtonDisplay() {
            for(let key in this.taskButtons) {
                let button = this.taskButtons[key];
                let buttonEl = $(button.btn);

                // Update the disabled state
                button.isDisabled = buttonEl.prop('disabled');

                if(button.isUpgrade === true) {
                    if(button.isDisabled === false) {
                        buttonEl.css('background-color', this.upgradeInactiveColor);
                    } else {
                        buttonEl.css('background-color', this.upgradeActiveColor);
                    }
                } else if(button.isClassUpgrade === true) {
                    if(button.isDisabled === false) {
                        buttonEl.css('background-color', this.classUpgradeInactiveColor);
                    } else {
                        buttonEl.css('background-color', this.classUpgradeActiveColor);
                    }
                }
            }
        }

        onToggleMainBarTaskDisplay(checked) {
            if(AE.settings.data.mainScreenAlternateDisplay !== checked) {
                // Update the settings
                AE.settings.data.mainScreenAlternateDisplay = checked;
                AE.settings.save();
            }

            this.rebuildTaskButtonDisplay();
        }

        rebuildTaskButtonDisplay(){
            let vanillaRoot = $('#vanilla_task_display');
            let alternateDisplayRoot = $('#at_main_alternative_task_display');

            this.refreshTaskButtonState();

            if(AE.settings.data.mainScreenAlternateDisplay === true)
            {
                vanillaRoot.hide();
                alternateDisplayRoot.show();

                this.moveTaskButtonsToGroupedDisplay(alternateDisplayRoot);

                this.activeButtonRoot = alternateDisplayRoot;
                this.createImbueAllButton();

            } else {

                vanillaRoot.show();
                alternateDisplayRoot.hide();

                this.moveTaskButtonsToOriginalParents();

                this.activeButtonRoot = vanillaRoot;
                this.createImbueAllButton();
            }
        }

        createImbueAllButton() {
            let existing = $('#at_imbue_gems');
            if(existing.length !== 0) {
                existing.remove();
            }

            let activeImbueKeys = [];
            for(let key in this.taskButtons) {
                let button = this.taskButtons[key];
                if (button.isLocked === true || button.isRunnable === true){
                    continue;
                }

                if(AE.data.GemImbueTaskIds.includes(key)) {
                    activeImbueKeys.push(key);
                }
            }

            if (activeImbueKeys.length === 0) {
                return false;
            }

            this.imbueGemCraftButtonPinned = false;
            let imbueSpan = $('<span id="at_imbue_gems" class="task-btn hidable"></span>');
            let imbueSpanBtn = $('<button id="at_imbue_gems_btn" class="wrapped-btn">Imbue All Gems</button>')
            imbueSpanBtn.click({keys: activeImbueKeys}, function(event) {
                if(event !== undefined && event.originalEvent !== undefined && event.originalEvent.ctrlKey === true) {
                    AE.tabStyleMain.imbueGemCraftButtonPinned = !AE.tabStyleMain.imbueGemCraftButtonPinned;
                    return;
                }

                for(let i = 0; i < event.data.keys.length; i++){
                    AE.tabStyleMain.clickTaskButton(event.data.keys[i]);
                }
            });

            imbueSpan.append(imbueSpanBtn);

            let button = this.taskButtons[activeImbueKeys[0]].btn;
            $(button).parent().before(imbueSpan);
        }

        clickTaskButton(key) {
            let data = this.taskButtons[key];
            if(data === undefined) {
                return;
            }

            $(data.btn).click();
        }

        moveTaskButtonsToOriginalParents(){
            for(let key in this.taskButtons) {
                let el = $(this.taskButtons[key].btn).parent();
                let parent = this.taskButtonOriginalParents[key];

                // Relocate the button
                el.detach();
                parent.append(el);
            }
        }

        createTaskGroup(id, title) {
            let html = AE.utils.processTemplate(GroupHTML, {
                id: id,
                title: title
            });

            let group = $(html);
            group.hide();

            return group;
        }

        moveTaskButtonsToGroupedDisplay(target) {
            target.empty();

            let groups = {};

            for(let key in this.taskButtons) {
                let data = this.taskButtons[key];
                let el = $(data.btn).parent();
                el.detach();

                let groupName = AE.data.getTaskGroup(key);
                if(groupName === undefined) {
                    console.warn("No Group for " + key);
                    groupName = this.defaultGroup;
                }

                let groupId = 'at_main_alternative_display_group_' + groupName.replace(/[\s\,\.]/g, '').toLowerCase();
                if(groups[groupId] === undefined){
                    groups[groupId] = this.createTaskGroup(groupId, groupName);
                }

                let groupContent = groups[groupId].find('#' + groupId + '_content');
                groupContent.append(el);

                if(data.isLocked !== true) {
                    groups[groupId].show();
                }
            }

            let sortedGroupKeys = Object.keys(groups);
            sortedGroupKeys.sort();

            for(let i = 0; i < sortedGroupKeys.length; i++){
                target.append(groups[sortedGroupKeys[i]]);
            }
        }

        updateMainTabCustomBar() {
            let existing = $('#at_main_top_bar');
            if(existing.length !== 0) {
                return;
            }

            let root = $('div.main-tasks');
            if(root.length === 0) {
                return;
            }

            let bar = $('<div id="at_main_top_bar" class="top separate"></div>');
            let options = $('<span></span>');
            let optionToggleView = AE.utils.createOptionsToggle("at_main_task_toggle_view", "Alternative Display", this.onToggleMainBarTaskDisplay.bind(this), AE.settings.data.mainScreenAlternateDisplay);
            options.append(optionToggleView);
            bar.append(options);
            let buttons = $('<div></div>');
            let clearPinButton = $('<button>Reset Pinned Buttons</button>');
            clearPinButton[0].addEventListener("click", event => {
                AE.tabStyleMain.resetPinnedButtons();
            }, false);

            buttons.append(clearPinButton);
            bar.append(buttons);
            $(root[0]).prepend(bar);
        }

        resetPinnedButtons() {
            for(let key in this.pinnedButtons) {
                if(this.pinnedButtons[key] !== true) {
                    continue;
                }

                this.pinnedButtons[key] = false;
                $(this.taskButtons[key].btn).css('background-color', '');
            }
        }

        refreshTaskButtonState(){
            AE.tabStyleMain.taskButtons = {};

            if(this.activeButtonRoot === undefined){
                return;
            }

            this.activeButtonRoot.find('span.task-btn').each(function() {
                let el = $(this);
                let dataKey = el.data("key");
                if(dataKey === undefined){
                    return;
                }

                let buttonData = {
                    btn: el.children()[0],
                    isLocked: el.hasClass('locked'),
                    isRunnable: el.hasClass('runnable'),
                    isUpgrade: AE.data.UpgradeTasks.includes(dataKey),
                    isClassUpgrade: AE.data.ClassUpgradeTasks.includes(dataKey)
                };

                AE.tabStyleMain.taskButtons[dataKey] = buttonData;
                if(AE.tabStyleMain.taskButtonOriginalParents[dataKey] === undefined) {
                    AE.tabStyleMain.taskButtonOriginalParents[dataKey] = el.parent();
                }

                if(buttonData.isLocked === false
                    && buttonData.isUpgrade === false
                    && buttonData.isRunnable === false) {
                    // Can pin only single-action buttons for now
                    if (AE.tabStyleMain.pinnedButtons[dataKey] === undefined) {
                        AE.tabStyleMain.pinnedButtons[dataKey] = false;
                        $(buttonData.btn).click({key: dataKey}, AE.tabStyleMain.pinTaskButtonCallback.bind(AE.tabStyleMain));
                    }
                }
            });
        }

        pinTaskButtonCallback(event) {
            if (event !== undefined && event.originalEvent !== undefined && event.originalEvent.ctrlKey === true) {
                let dataKey = event.data.key;
                if(AE.tabStyleMain.pinnedButtons[dataKey] === true) {
                    AE.tabStyleMain.pinnedButtons[dataKey] = false;
                    $(event.currentTarget).css('background-color', '');
                } else {
                    AE.tabStyleMain.pinnedButtons[dataKey] = true;
                }
            }
        }

        updateMainTabAlternativeTaskDisplay() {
            let existing = $('#at_main_alternative_task_display');
            if(existing.length !== 0) {
                return;
            }

            let root = $('div.main-tasks');
            if(root.length !== 1) {
                return;
            }

            let current = $('<div id="vanilla_task_display" class="main-tasks"></div>');
            root.children().each(function() {
                $(this).detach();
                current.append($(this));
            });

            root.append(current);

            let alternative = $('<div id="at_main_alternative_task_display" class="main-tasks"></div>');
            root.append(alternative);

            this.activeButtonRoot = current;
            this.onToggleMainBarTaskDisplay(AE.settings.data.mainScreenAlternateDisplay);
        }
    }

    AE.tabStyleMain = new AETabStyleMain();

})(window.jQuery); 
 
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
 
// TabStyle - Equip
(function($) {
    'use strict';

    class AETabStyleEquip {
        constructor() {
            this.resetState();
        }

        resetState() {
        }

        updateUI() {
            if(AE.playerState.activeTab !== AE.data.GameTabs.Equip) {
                this.resetState();
                return;
            }

            AE.pageUtils.updateInventorySubContent({compareEquip: true});
            AE.pageUtils.updateItemPopup();

            let equipRoot = $('div.equip');
            equipRoot.css("grid-template-columns", "repeat( auto-fill, minmax(18rem,1fr))");

            // Process equipped items
            AE.playerState.clearEquippedItems();

            $('div.equip').find('div.equip-slot').each(function() {
                let slotName = $(this).find('.slot-name').text().replace(':', '').trim().toLowerCase();
                $(this).find('.slot-item').each(function() {
                    let slot = $(this);
                    let nameSpan = slot.find('span.item-name');
                    if(nameSpan.length === 0) {
                        return;
                    }

                    let name = nameSpan.text();
                    let properties = AE.itemUtils.processItemEntry($(this), name, nameSpan);

                    if(properties !== undefined && properties.itemSlot !== undefined) {
                        let itemSlot = properties.itemSlot[0];
                        if(properties.itemSlot.length > 1) {
                            for(let i = 0; i < properties.itemSlot.length; i++){
                                if(properties.itemSlot[i] === slotName) {
                                    itemSlot = properties.itemSlot[i];
                                    break;
                                }
                            }
                        }

                        AE.playerState.registerEquippedItem(itemSlot, properties);
                    }
                });
            });
        }
    }

    AE.tabStyleEquip = new AETabStyleEquip();

})(window.jQuery); 
 
// TabStyle - Adventure
(function($) {
    'use strict';

    class AETabStyleAdventure {
        constructor() {
            this.resetState();
        }

        resetState() {
        }

        updateUI() {
            if(AE.playerState.activeTab !== AE.data.GameTabs.Adventure) {
                this.resetState();
                return;
            }

            let root = $('div.adventure');
            if(root.length === 0){
                return;
            }

            let raid = root.find('div.raid-bottom');
            if(raid.length === 0){
                return;
            }

            AE.pageUtils.updateInventorySubContent({removeEquip: true, compareEquip: true, addSellJunkButton: true});
            AE.pageUtils.updateItemPopup();

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
    }

    AE.tabStyleAdventure = new AETabStyleAdventure();

})(window.jQuery); 
 
// Sanctum
(function($) {
    'use strict';

    const SanctumScreenHTML = `
<div id="at_sanctum_screen" style="position: absolute;width:100%;height:100%;background-color: white;">
    <div id="at_sanctum_top" class="menu-items">
       <div id="at_sanctum_leave_btn" class="menu-item">
            <span><u>Leave Sanctum</u></span>
       </div>
    </div>
    <div id="at_sanctum_content">
        <ul id="at_sanctum_tab_root" style="display: flex; flex-direction: row;">
        </ul>
    </div>  
</div>`;

    const SanctumTabTemplate = `
<li style="border-top-width: thin;border-left-width: thin;border-right-width: thin;border-bottom-width: 0px;border-style: solid;padding: 10px;margin: 2px;min-width:100px;">
    <a href="#at_sanctum_tab_{{id}}" style="text-decoration: none;">{{title}}</a>
</li>`;

    const SanctumTabContentTemplate = `
<div id="at_sanctum_tab_{{id}}">
    <p>This is Tab: {{id}}</p>
</div>`;

    class AESanctum {

        constructor() {
            this.isInitialized = false;
            this.activeContent = undefined;
        }

        update(delta) {
            if(this.isInitialized !== true){
                return;
            }

            AE.sanctumConjure.update(delta);
            AE.sanctumResearch.update(delta);
        }

        updateUI(delta) {
            if(this.isInitialized !== true) {
                this.checkSettings();
                this.updateMenuItem();
                this.updateSanctumScreen();
                this.isInitialized = true;
            }

            if(this.activeContent !== undefined) {
                this.activeContent.updateUI(delta);
            }
        }

        checkSettings(){
            let settings = AE.settings.data.sanctum;
            if(settings === undefined){
                settings = {};
                AE.settings.data.sanctum = settings;
            }

            if(settings.unlocks === undefined) {
                settings.unlocks = {};
            }

            if(settings.conjure === undefined) {
                settings.conjure = {
                    resource: {},
                    producers: {}
                };
            }

            if(settings.research === undefined) {
                settings.research = {
                    complete: {},
                    inProgress: {}
                };
            }

            AE.settings.save();
        }

        addTab(root, id, title) {
            let tabRoot = root.find('#at_sanctum_tab_root');
            let contentRoot = root.find('#at_sanctum_content')
            if(tabRoot.length === 0 || contentRoot.length === 0) {
                return;
            }

            let tab = $(AE.utils.processTemplate(SanctumTabTemplate, {id: id, title: title}));
            tabRoot.append(tab);

            let tabContent = $(AE.utils.processTemplate(SanctumTabContentTemplate, {id: id}));
            contentRoot.append(tabContent);

            return [tab, tabContent];
        }

        activateTab(tab) {
            if(tab === undefined) {
                return;
            }

            if(this.activeContent !== undefined) {
                this.activeContent.deactivate();
                this.activeContent = undefined;
            }

            AE.log("Activating Sanctum Tab: " + tab.title);
            let tabContent = $('#at_sanctum_tab_' + tab.id);
            switch (tab) {
                case AE.sanctumData.Tabs.Conjure: {
                    AE.sanctumConjure.activate(tabContent);
                    this.activeContent = AE.sanctumConjure;
                    break;
                }

                case AE.sanctumData.Tabs.Research: {
                    AE.sanctumResearch.activate(tabContent);
                    this.activeContent = AE.sanctumResearch;
                    break;
                }
            }
        }

        updateSanctumScreen(){
            let existing = $('#at_sanctum_screen');
            if(existing.length !== 0) {
                return;
            }

            let root = $('div.game-mid');
            if(root.length === 0) {
                return;
            }

            // Have to set root to relative explicitly for this window to show correctly
            root.css('position', 'relative');

            let screen = $(SanctumScreenHTML);
            screen.find('#at_sanctum_leave_btn').click(function() {
                AE.sanctum.hideSanctumScreen();
            });

            for(let key in AE.sanctumData.Tabs) {
                let tabData = AE.sanctumData.Tabs[key];
                this.addTab(screen, tabData.id, tabData.title);
            }

            screen.tabs({
                activate: function(event, ui) {
                    let tabId = $(event.currentTarget).attr("href").replace('#at_sanctum_tab_', '');
                    for(let key in AE.sanctumData.Tabs) {
                        if(AE.sanctumData.Tabs[key].id === tabId) {
                            AE.sanctum.activateTab(AE.sanctumData.Tabs[key]);
                            break;
                        }
                    }
                }
            });

            screen.hide();
            root.append(screen);

            this.activateTab(AE.sanctumData.Tabs.Conjure);
        }

        showSanctumScreen() {
            $('#at_sanctum_screen').show();
        }

        hideSanctumScreen() {
            $('#at_sanctum_screen').hide();
        }

        updateMenuItem() {
            let existing = $('#at_sanctum_menu');
            if(existing.length !== 0) {
                return;
            }

            let root = $('div.menu-items');
            if(root.length === 0){
                return;
            }

            let menu = $('<div class="menu-item" id="at_sanctum_menu" data-v-636f3856=""><span><u id="at_sanctum_menu_text">Enter Sanctum</u></span></div>');
            menu.click(function() {
                AE.sanctum.showSanctumScreen();
            });

            root.append(menu);
        }
    }

    AE.sanctum = new AESanctum();

})(window.jQuery); 
 
// Sanctum Data
(function($) {
    'use strict';

    class AESanctumData {
    }

    AE.sanctumData = new AESanctumData();

    AE.sanctumData.Tabs = {
        Conjure: {id: 'conjure', title: 'Conjure'},
        Research: {id: 'research', title: 'Research'}
    };

    AE.sanctumData.resources = {
        essence: {
            id: 'essence',
            symbol: '⚗️',
            producers: {
                click: {

                }
            }
        }
    };

})(window.jQuery); 
 
// Sanctum Conjure
(function($) {
    'use strict';

    const ConjureHTML = `
<div>
    <div id="at_s_conjure_resources" style="width:350px;">
        <table>
            <tbody>        
            </tbody>
        </table>
    </div>
    <div id="at_s_conjure_producers">
    
    </div>
</div>`;

    class AESanctumConjure {
        constructor() {
            this.isActive = false;
            this.activeRoot = undefined;
        }

        update(delta) {
        }

        updateUI(delta) {
            if(this.isActive !== true){
                return;
            }

            // Refresh the ui
        }

        activate(root) {
            if(root === undefined || root.length === 0) {
                return;
            }

            root.empty();

            this.activePage = $(ConjureHTML);
            root.append(this.activePage);

            console.log("ACT: conjure");
            this.isActive = true;
        }

        deactivate() {
            console.log("DEACT: conjure");
            this.activePage = undefined;
            this.isActive = false;
        }
    }

    AE.sanctumConjure = new AESanctumConjure();

})(window.jQuery); 
 
// Sanctum Research
(function($) {
    'use strict';

    const ResearchHTML = `
<div>
</div>`;

    class AESanctumResearch {
        constructor() {
            this.isActive = false;
            this.activeRoot = undefined;
        }

        update(delta) {

        }

        updateUI(delta) {
            if(this.isActive !== true){
                return;
            }

            // Refresh the ui
        }

        activate(root) {
            if(root === undefined || root.length === 0) {
                return;
            }

            root.empty();

            this.activePage = $(ResearchHTML);
            root.append(this.activePage);

            this.isActive = true;
        }

        deactivate() {
            this.activePage = undefined;
            this.isActive = false;
        }
    }

    AE.sanctumResearch = new AESanctumResearch();

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

    const VersionRegex = /.*build#\s*([0-9]+)/i;

    class AELoader {
        load() {
            this.checkForOtherScripts();

            AE.settings.load();
            AE.pageUtils.checkData();
            AE.playerState.initialize();

            this.checkVersion();

            this.loadHtmlModifications();

            AE.interval.add(this.reloadCheck.bind(this), 2000);

            AE.interval.add(AE.pageStyle.update.bind(AE.pageStyle), AE.config.uiUpdateInterval);

            AE.interval.add(AE.playerState.update.bind(AE.playerState), AE.config.minUpdateInterval);

            AE.interval.add(AE.tabStyle.update.bind(AE.tabStyle), AE.config.uiUpdateInterval);

            AE.interval.add(AE.tabStyleMain.updateUI.bind(AE.tabStyleMain), AE.config.uiUpdateInterval);
            AE.interval.add(AE.tabStyleMain.updateAutomation.bind(AE.tabStyleMain), 125);

            AE.interval.add(AE.tabStyleEnchant.updateUI.bind(AE.tabStyleEnchant), AE.config.uiUpdateInterval);

            AE.interval.add(AE.tabStyleEquip.updateUI.bind(AE.tabStyleEquip), AE.config.uiUpdateInterval);
            AE.interval.add(AE.tabStyleAdventure.updateUI.bind(AE.tabStyleAdventure), AE.config.uiUpdateInterval);

            //AE.interval.add(AE.sanctum.update.bind(AE.sanctum), AE.config.minUpdateInterval);
            //AE.interval.add(AE.sanctum.updateUI.bind(AE.sanctum), AE.config.uiUpdateInterval);

            if(AE.config.arcanumAutomationPresent !== true) {
                AE.interval.add(AE.quickSlots.update.bind(AE.quickSlots), AE.config.minUpdateInterval);
            }

            AE.interval.add(AE.damageMeter.update.bind(AE.damageMeter), 250);
        }

        checkVersion() {
            let versionSpan = $('span.vers');
            if(versionSpan.length === 0){
                console.warn("Missing Version Tag");
                return;
            }

            let rawText = versionSpan.text();
            let parse = VersionRegex.exec(rawText);
            if(parse === undefined || parse === null || parse.length !== 2) {
                console.warn("Unknown Version: " + rawText);
                return;
            }

            let version = parseInt(parse[1]);
            if(AE.settings.data.gameVersion === version){
                // Same version
                return;
            }

            if(AE.settings.data.gameVersion !== undefined){
                // Version has changed, check how
                if(AE.settings.data.gameVersion > version){
                    console.error("Game version degraded, was " + AE.settings.data.gameVersion + " now at " + version);
                } else {
                    AE.log("Game Version updated, was " + AE.settings.data.gameVersion + " now at " + version)
                }
            } else {
                // First time start
                AE.log("Game version initialized to " + version);
            }

            AE.settings.data.gameVersion = version;
            AE.settings.save();

            if(version < AE.data.gameVersionOutdatedThreshold) {
                alert("You are running a very old version of the game: " + version + " latest should be " + AE.data.gameVersionKongregate + " or higher\n\n • Recommended version to play is 'Theory of Magic on Kongregate'");
            }
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
            AE.log("Loading Done!");
        }

        AE.interval.update(delta);
    }

    update();

})(window.jQuery); 
 
