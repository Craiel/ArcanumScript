// ==UserScript==
// @name         Arcanum Auto
// @version      1691
// @author       ...
// @description  Automation
// @downloadURL  https://github.com/harrygiel/arcanum-automation/raw/master/automate.user.js
// @match        http://www.lerpinglemur.com/arcanum/*
// @match        https://www.lerpinglemur.com/arcanum/*
// @match        http://game312933.konggames.com/gamez/0031/2933/*
// @match        https://game312933.konggames.com/gamez/0031/2933/*
// @run-at       document-idle
// @require http://code.jquery.com/jquery-3.4.1.min.js
// ==/UserScript==

// Game Addresses:
// https://www.lerpinglemur.com/arcanum/index.html
// https://game312933.konggames.com/gamez/0031/2933/live/index.html

(function($) {
    'use strict';

    const SettingsSaveKey = "at_settings";
    const SettingsVersion = 1;

    const QuickSlotCount = 10;
    const MinUpdateInterval = 50;

    const ItemCountRegex = /(.*?)\s?\(([0-9]+)\)/;
    const ItemLevelRegex = /\[[0-9]+\](.*)/;

    let isLoaded = false;
    let lastUpdate = 0;

    let quickSlotTarget = [QuickSlotCount];
    let quickSlotCooldown = [QuickSlotCount];

    let playerState = {
        activeTab: undefined,
        resources: {},
        vitals: {}
    };

    let invalidItemNames = {};

    let settings = {
        version: SettingsVersion,
        quickSlotTimes: [QuickSlotCount]
    };

    let intervalFunctions = [];
    let intervalFunctionTimers = {};
    let intervalFunctionRemaining = {};

    let settingsPanelAdjusted = false;

    // -------------------------------------------------------------------
    // Data
    // -------------------------------------------------------------------
    const PlayerVitals = {
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

    const PlayerResources = {
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

    const GameTabs = {
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

    const Potions = {
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
        Serenity: "serenity"
    };

    const ItemType = {
        Unknown: 'unknown',
        Armor: 'armor',
        Weapon: 'weapon',
        Accessory: 'accessory',
        Consumable: 'consumable'
    };

    const ConsumableSubType = {
        Unknown: 'unknown',
        Potion: 'potion'
    };

    const WeaponSubType = {
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

    const ArmorSubType = {
        Unknown: 'unknown',
        Head: 'head',
        Hands: 'hands',
        Back: 'back',
        Waist: 'waist',
        Chest: 'chest',
        Shins: 'shins',
        Feet: 'feet'
    };

    const AccessorySubType = {
        Unknown: 'unknown',
        Ring: 'ring',
        Neck: 'neck'
    };

    const Armor = {
        Gloves: {name: 'gloves', lvl: 1, subType: ArmorSubType.Hands},

        Boots: {name: 'boots', lvl: 1, subType: ArmorSubType.Feet},

        Greaves: {name: 'greaves', lvl: 1, subType: ArmorSubType.Shins},

        Hat: {name: 'hat', lvl: 0, subType: ArmorSubType.Head},
        Cap: {name: 'cap', lvl: 1, subType: ArmorSubType.Head},
        Helm: {name: 'helm', lvl: 3, subType: ArmorSubType.Head},
        ConicalHelm: {name: 'conical helm', lvl: 0, subType: ArmorSubType.Head},

        Jerkin: {name: 'jerkin', lvl: 2, subType: ArmorSubType.Chest},
        PaddedArmor: {name: 'padded armor', lvl: 4, subType: ArmorSubType.Chest},
        ChainMail: {name: 'chainmail', lvl: 5, subType: ArmorSubType.Chest},
        PlateMail: {name: 'plate mail', lvl: 9, subType: ArmorSubType.Chest},

        Belt: {name: 'belt', lvl: 1, subType: ArmorSubType.Waist},
        Girdle: {name: 'girdle', lvl: 1, subType: ArmorSubType.Waist},
        Cincture: {name: 'cincture', lvl: 1, subType: ArmorSubType.Waist},
        Sash: {name: 'sash', lvl: 1, subType: ArmorSubType.Waist},

        Cape: {name: 'cape', lvl: 1, subType: ArmorSubType.Back},
        Robe: {name: 'robe', lvl: 1, subType: ArmorSubType.Back},
        Cloak: {name: 'cloak', lvl: 1, subType: ArmorSubType.Back},
        Wings: {name: 'wings', lvl: 20, subType: ArmorSubType.Back}
    };

    const Accessories = {
        Ring: {name: 'ring', lvl: 5, subType: AccessorySubType.Ring},
        Band: {name: 'band', lvl: 3, subType: AccessorySubType.Ring},
        Loop: {name: 'loop', lvl: 1, subType: AccessorySubType.Ring},

        Pendant: {name: 'pendant', lvl: 1, subType: AccessorySubType.Neck},
        Collar: {name: 'collar', lvl: 1, subType: AccessorySubType.Neck},
        Amulet: {name: 'amulet', lvl: 1, subType: AccessorySubType.Neck},
        Necklace: {name: 'necklace', lvl: 1, subType: AccessorySubType.Neck}
    };

    const Weapons = {
        ShortSword: {name: 'shortsword', lvl: 1, subType: WeaponSubType.Sword1H},
        Club: {name: 'club', lvl: 0, subType: WeaponSubType.Mace1H},
        Cane: {name: 'cane', lvl: 1, subType: WeaponSubType.Mace1H},
        Knife: {name: 'knife', lvl: 0, subType: WeaponSubType.Dagger},
        Staff: {name: 'staff', lvl: 1, subType: WeaponSubType.Staff},
        BroomStick: {name: 'broomstick', lvl: 0, subType: WeaponSubType.Mace1H},
        Dagger: {name: 'dagger', lvl: 1, subType: WeaponSubType.Dagger},
        LongSword: {name: 'longsword', lvl: 3, subType: WeaponSubType.Sword2H},
        Axe: {name: 'axe', lvl: 1, subType: WeaponSubType.Axe1H},
        BattleAxe: {name: 'battleaxe', lvl: 2, subType: WeaponSubType.Axe2H},
        Mace: {name: 'mace', lvl: 3, subType: WeaponSubType.Mace1H},
        WarHammer: {name: 'warhammer', lvl: 3, subType: WeaponSubType.Mace2H},
        Spear: {name: 'spear', lvl: 2, subType: WeaponSubType.Spear},
    };

    const EnchantItemNotations = [
        'of colors',
        'of energy',
        'of air',
        'of spells',
        'of earth',
        'of biting',
        'of sanity',
        'of fire',
        'of water',
        'of luck'
    ];

    const SpecialItems = {
        'orb of winters': {type: ItemType.Weapon, subType: WeaponSubType.Orb}
    };

    const ItemMaterials = {
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

    // -------------------------------------------------------------------
    // Loading
    // -------------------------------------------------------------------
    function loadAutomation() {
        loadQuickSlots();

        checkData();
        initializePlayerState();

        addIntervalFunction(updateTabState, 500);
        addIntervalFunction(refreshActiveTab, 500);
        addIntervalFunction(refreshResourceList, 500);
        addIntervalFunction(refreshSettingsPopup, 1000);
        addIntervalFunction(updatePlayerState, MinUpdateInterval);
        addIntervalFunction(autoUseQuickSlot, MinUpdateInterval);

        loadSettings();
    }

    function initializePlayerState(){
        for(let vital in PlayerVitals) {
            playerState.vitals[vital] = {current: 0, max: 0};
        }

        for(let resource in PlayerResources){
            playerState.resources[resource] = {current: 0, max: 0};
        }
    }

    function checkData(){
        let unknownResources = [];
        $('div.res-list').find('div.rsrc').not('.locked').each(function() {
            let resourceKey = $(this).data('key');
            let isKnown = false;
            for(let id in PlayerResources) {
                if(resourceKey === PlayerResources[id]){
                    isKnown = true;
                    break;
                }
            }
            if(isKnown === false) {
                unknownResources.push(resourceKey);
            }
        });

        if(unknownResources.length > 0){
            log("Unknown Resources: " + unknownResources);
        }

        let unknownVitals = [];
        $('table.bars').find('tr').each(function() {
            let vitalKey = $(this).data('key');
            let isKnown = false;
            for(let id in PlayerVitals) {
                if(vitalKey === PlayerVitals[id]){
                    isKnown = true;
                    break;
                }
            }
            if(isKnown === false) {
                unknownVitals.push(vitalKey);
            }
        });

        if(unknownVitals.length > 0){
            log("Unknown Vitals: " + unknownVitals);
        }
    }

    function loadQuickSlots() {
        let slotId = 0;

        for(var i = 0; i < QuickSlotCount; i++) {
            quickSlotTarget[i] = undefined;
            quickSlotCooldown[i] = 0;
            settings.quickSlotTimes[i] = undefined;
        }

        $(".quickslot").each(function() {
            let input = $('<input id="at_qs_' + slotId +'" type="text" class="timeset" style="position:absolute; bottom:0px; left:0px; width:100%; font-weight:bold; opacity:0.75; text-align:center;">');
            input.change({id: slotId}, function(data) {
                let newValue = parseFloat($(this).val());
                if(isNaN(newValue) || newValue === undefined || newValue === null) {
                    newValue = undefined;
                } else {
                    newValue = newValue * 1000;
                }

                log("Setting QS " + data.data.id + " Time to " + newValue + " ms");

                settings.quickSlotTimes[data.data.id] = newValue;
                saveSettings();
            });

            quickSlotTarget[slotId] = $(this);
            $(this).append(input);

            slotId++;
        });

        updateQuickSlotDisplay();
    }

    function updateQuickSlotDisplay() {
        for(var i = 0; i < QuickSlotCount; i++){
            let el = $('#at_qs_' + i);
            let time = settings.quickSlotTimes[i];
            if(time === undefined){
                el.val("");
            } else {
                el.val(time / 1000);
            }
        }
    }

    function saveSettings() {
        localStorage.setItem(SettingsSaveKey, JSON.stringify(settings));
    }

    function loadSettings() {
        let data = localStorage.getItem(SettingsSaveKey);
        if(data === undefined || data === null){
            return;
        }

        let newSettings = JSON.parse(data);
        if(newSettings === undefined || newSettings === null){
            return;
        }

        for(let i = 0; i < QuickSlotCount; i++){
            if(newSettings.quickSlotTimes[i] === null){
                newSettings.quickSlotTimes[i] = undefined;
            }
        }

        console.log(newSettings);
        settings = newSettings;
        updateQuickSlotDisplay();
    }

    // -------------------------------------------------------------------
    // System / Helpers
    // -------------------------------------------------------------------
    function addIntervalFunction(target, interval, startAfterDelay) {
        let id = intervalFunctions.length;

        if(startAfterDelay === true) {
            intervalFunctionRemaining[id] = interval;
        } else {
            intervalFunctionRemaining[id] = 0;
        }

        intervalFunctionTimers[id] = interval;

        intervalFunctions.push(target);
    }

    function removeIntervalFunction(target) {
        let id = intervalFunctions.indexOf(target);
        if(id === -1) {
            return;
        }

        delete intervalFunctionTimers[id];
        delete intervalFunctionRemaining[id];
        intervalFunctions.splice(id, 1);
    }

    function updateIntervalFunctions(delta) {
        for(let id = 0; id < intervalFunctions.length; id++) {
            let func = intervalFunctions[id];
            let updateInterval = intervalFunctionTimers[id];

            intervalFunctionRemaining[id] -= delta;
            if(intervalFunctionRemaining[id] <= 0) {
                func(updateInterval);
                intervalFunctionRemaining[id] = updateInterval;
            }
        }
    }

    function log(msg){
        console.log("ATM: " + msg);
    }

    function getVitalValues(id) {
        let rawValues = $('.bars').find('tr[data-key="' + id + '"').find('.bar-text').text().split('/');
        return getValues(rawValues);
    }

    function getResourceValues(id) {
        let rawValues = $('.rsrc[data-key="' + id + '"]').not('.locked').find('.num-align').text().split('/');
        return getValues(rawValues);
    }

    function getValues(rawValues){
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

    // -------------------------------------------------------------------
    // Tab Extensions
    // -------------------------------------------------------------------
    function refreshResourceList() {
        let list = $('div.res-list');
        list.css('min-width', '18rem');

        // Color resources values, 0 empty, full green
        list.find('div.rsrc').not('.locked').each(function() {
            let el = $(this).find('.num-align');
            let values = getValues(el.text().split('/'));
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

    function refreshSettingsPopup() {
        let popup = $('div.settings');
        if(popup.length === 0){
            settingsPanelAdjusted = false;
            return;
        }

        let closeButton = popup.find('button.close');
        if(closeButton.length === 0) {
            settingsPanelAdjusted = false;
            return;
        }

        if(settingsPanelAdjusted === true) {
            return;
        }

        closeButton.before($('<hr>'));
        // <div data-v-2acc7e09=""><label data-v-2acc7e09="" for="compact-mode918">compact mode</label> <input data-v-2acc7e09="" type="checkbox" id="compact-mode918"></div>
    }

    function refreshActiveTab() {
        switch (playerState.activeTab) {
            case GameTabs.Skills: {
                refreshSkillsTab();
                break;
            }

            case GameTabs.Adventure: {
                refreshAdventureTab();
                break;
            }

            case GameTabs.Equip: {
                refreshEquipTab();
                break;
            }

            case GameTabs.Bestiary: {
                refreshBestiaryTab();
                break;
            }

            case GameTabs.Enchanting: {
                refreshEnchantingTab();
                break;
            }

            case GameTabs.Potions: {
                refreshPotionsTab();
                break;
            }
        }
    }

    function refreshAdventureTab() {
        let root = $('div.adventure');
        if(root.length === 0){
            return;
        }

        let explore = root.find('div.explore');

        let raid = root.find('div.raid-bottom');
        if(raid.length === 0){
            return;
        }

        refreshInventorySubContent({removeEquip: true});
    }

    function refreshSkillsTab() {
        let skillRoot = $('div.skills').find('div.subs');
        skillRoot.css("grid-template-columns", "repeat( auto-fit, minmax( 16rem, 1fr) )");
    }

    function refreshBestiaryTab() {
        let bestiaryTable = $('table.bestiary');

        bestiaryTable.find('tr').each(function(){
            $(this).find('th.sm-name').css("text-decoration", "none").css("cursor", "default");
        })
    }

    function refreshEquipTab() {
        refreshInventorySubContent();

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
            processItemEntry($(this), name, nameSpan);
        });
    }

    function refreshEnchantingTab() {
        refreshInventorySubContent({hideConsumables: true});
    }

    function refreshInventorySubContent(conf){
        let itemTable = $('div.inventory').find('div.item-table');
        if(itemTable.length === 0){
            return;
        }

        fixTableLayout(itemTable);

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
            processItemEntry($(this), itemName, nameEl, conf);
        });
    }

    function processItemEntry(sourceEl, name, targetEl, conf){
        if(invalidItemNames[name] === true){
            return;
        }

        let properties = determineItemProperties(name);
        if (properties.type === ItemType.Unknown){
            console.warn("Unknown Item:");
            console.warn(properties);
            invalidItemNames[name] = true;
            return;
        }

        if(conf.hideConsumables === true && properties.type === ItemType.Consumable) {
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

    function refreshPotionsTab(){
        let potionColumn = $('div.potions').find('div.potion-col');
        if(potionColumn.length === 0){
            return;
        }

        fixTableLayout(potionColumn);

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

    function determineItemProperties(name) {
        let prop = {
            fullName: name.trim(),
            name: name.trim(),
            count: 1,
            type: ItemType.Unknown,
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
        for(let key in Potions) {
            if (prop.name === Potions[key]) {
                prop.type = ItemType.Consumable;
                prop.subType = ConsumableSubType.Potion;
                prop.isKnown = true;
                break;
            }
        }

        // Check enchantment state and normalize item name
        if (prop.name.startsWith('Enchanted') || prop.name.startsWith('enchanted')) {
            prop.name = prop.name.replace("Enchanted ", "").replace("enchanted", "");
            prop.fullName = prop.fullName.replace("Enchanted ", "");
            prop.isEnchanted = true;
        }

        for(let i = 0; i < EnchantItemNotations.length; i++){
            let notation = EnchantItemNotations[i];
            if(prop.name.includes(notation)){
                prop.name = prop.name.replace(notation, "").trim();
                prop.isEnchanted = true;
            }
        }

        // Check for special items
        if (prop.isKnown === false) {
            for(let key in SpecialItems) {
                if(prop.name === key) {
                    prop.type = SpecialItems[key].type;
                    prop.subType = SpecialItems[key].subType;
                    prop.isSpecialItem = true;
                    prop.isKnown = true;
                    break
                }
            }
        }

        // Check the material
        if (prop.isKnown === false) {
            for(let key in ItemMaterials) {
                let materialString = ItemMaterials[key].name+" ";
                if(prop.name.startsWith(materialString)) {
                    prop.name = prop.name.replace(materialString, "").trim();
                    prop.material = key;
                    prop.level = ItemMaterials[key].lvl;
                    break;
                }
            }
        }

        // Check if its an accessory
        if(prop.isKnown === false) {
            for(let key in Accessories) {
                if(prop.name === Accessories[key].name) {
                    prop.type = ItemType.Accessory;
                    prop.subType = Accessories[key].subType;
                    if(prop.level === undefined) {
                        prop.level = 0;
                    }
                    prop.level += Accessories[key].lvl;
                    prop.isKnown = true;
                    break;
                }
            }
        }

        // Check if its an Armor
        if(prop.isKnown === false) {
            for(let key in Armor) {
                if(prop.name === Armor[key].name) {
                    prop.type = ItemType.Armor;
                    prop.subType = Armor[key].subType;
                    if(prop.level === undefined) {
                        prop.level = 0;
                    }
                    prop.level += Armor[key].lvl;
                    prop.isKnown = true;
                    break;
                }
            }
        }

        // Check if its a Weapon
        if(prop.isKnown === false) {
            for(let key in Weapons) {
                if(prop.name === Weapons[key].name) {
                    prop.type = ItemType.Weapon;
                    prop.subType = Weapons[key].subType;
                    if(prop.level === undefined) {
                        prop.level = 0;
                    }
                    prop.level += Weapons[key].lvl;
                    prop.isKnown = true;
                    break;
                }
            }
        }

        return prop;
    }

    function fixTableLayout(target)
    {
        target.css("grid-template-columns", "repeat( auto-fit, minmax(18rem, 0.5fr))");

        target.find('.separate').each(function() {
            $(this).find('button').each(function() {
                // Equal sized buttons
                $(this).css("width", "60px").css("flex-shrink", "0");
            })
        });
    }

    // -------------------------------------------------------------------
    // Main Automation
    // -------------------------------------------------------------------
    function updatePlayerState(delta) {
        for(let vital in PlayerVitals) {
            playerState.vitals[vital] = getVitalValues(PlayerVitals[vital]);
        }

        for(let resource in PlayerResources) {
            playerState.resources[resource] = getResourceValues(PlayerResources[resource]);
        }
    }

    function updateTabState(delta) {
        $('div.menu').find('div.menu-items').find('div.menu-item').each(function() {
            let span = $(this.children[0]);
            if(span.children().length === 0){
                let tabId = span.text().trim();
                let tabKey = undefined;
                for(let key in GameTabs) {
                    if(GameTabs[key] === tabId) {
                        tabKey = key;
                        break
                    }
                }

                if(tabKey === undefined){
                    console.error("Unknown Tab: " + tabId);
                    return;
                }

                if(playerState.activeTab !== tabId){
                    playerState.activeTab = tabId;
                }

                return;
            }
        });
    }

    function autoUseQuickSlot(delta) {
        for(let i = 0; i < QuickSlotCount; i++){
            let target = quickSlotTarget[i];
            let time = settings.quickSlotTimes[i];

            if (target === undefined || time === undefined) {
                continue;
            }

            let clickTarget = target.find('div');
            quickSlotCooldown[i] -= delta;
            if(quickSlotCooldown[i] < 0){
                clickTarget[0].click();
                quickSlotCooldown[i] = time;
            }
        }
    }

    // -------------------------------------------------------------------
    // Update
    // -------------------------------------------------------------------
    function update(timestamp) {
        let quickBar = $(".quickbar");
        if (quickBar.length === 0) {
            window.requestAnimationFrame(update);
            return;
        }

        if(isLoaded === false) {
            log("Loading...");
            loadAutomation();
            isLoaded = true;
            log(" Done!");
        }

        if(lastUpdate === 0) {
            lastUpdate = timestamp;
        }

        let delta = timestamp - lastUpdate;
        lastUpdate = timestamp;

        updateIntervalFunctions(delta);
        window.requestAnimationFrame(update);
    }

    update();

})(window.jQuery);