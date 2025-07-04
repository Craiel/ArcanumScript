// Data
(function($) {
    'use strict';

    class AEData {
        constructor() {
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
        Furniture: 'furniture',
        Converters: 'converters',
        Adventure: 'adventure',
        Loot: 'loot',
        Player: 'player',
        Spells: 'spells',
        Spellcraft: 'spellcraft',
        Equip: 'equip',
        Bestiary: 'bestiary',
        Enchanting: 'enchanting',
        Potions: 'potions',
        Glossary: 'glossary'
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
        Trinket: 'trinket',
        Chest: 'chest',
        Shins: 'shins',
        Feet: 'feet'
    };

    AE.data.AccessorySubType = {
        Unknown: 'unknown',
        Ring: 'ring',
        Neck: 'neck',
        Trinket: 'trinket'
    };

    AE.data.Armor = {
        Gloves: {name: 'gloves', lvl: 1, subType: AE.data.ArmorSubType.Hands},
        Gauntlets: {name: 'gauntlets', lvl: 5, subType: AE.data.ArmorSubType.Hands},

        Boots: {name: 'boots', lvl: 1, subType: AE.data.ArmorSubType.Feet},

        Greaves: {name: 'greaves', lvl: 1, subType: AE.data.ArmorSubType.Shins},
        Pantaloons: {name: 'pantaloons', lvl: 1, subType: AE.data.ArmorSubType.Shins},

        Hat: {name: 'hat', lvl: 1, subType: AE.data.ArmorSubType.Head},
        Cap: {name: 'cap', lvl: 1, subType: AE.data.ArmorSubType.Head},
        Helm: {name: 'helm', lvl: 3, subType: AE.data.ArmorSubType.Head},
        GoldHelm: {name: 'gold helm', lvl: 6, subType: AE.data.ArmorSubType.Head},
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
        Necklace: {name: 'necklace', lvl: 1, subType: AE.data.AccessorySubType.Neck},

        ApprenticeQuill: {name: 'apprentice scribe\'s quill', lvl: 1, subType: AE.data.AccessorySubType.Trinket},
        BotanicalKit: {name: 'botanical kit', lvl: 1, subType: AE.data.AccessorySubType.Trinket},
    };

    AE.data.Weapons = {
        Sword: {name: 'sword', lvl: 1, subType: AE.data.WeaponSubType.Sword1H},
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
        HomingDart: {name: 'homing dart', lvl: 0, subType: AE.data.WeaponSubType.Dagger },
        TrainingSword: {name: 'training sword', lvl: 1, subType: AE.data.WeaponSubType.Sword1H },
        TrainingHammer: {name: 'training hammer', lvl: 1, subType: AE.data.WeaponSubType.Mace2H },
        TrainingKnife: {name: 'training knife', lvl: 1, subType: AE.data.WeaponSubType.Dagger },
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
        'necro3', 'deathlock', 'wizard3', 'astralseer', 'c_avatar', 'leavemaster', 'slaymaster', 'puppeteer'];

    AE.data.TaskGroups = {
        'Rest': ['rest', 'slumber', 'naturecamp', 'chant', 'eatchildren'],
        'Gold': ['cleanstables', 'sellscroll', 'sellherbs', 'sellgem', 'pouch', 'thievery', 'readpalms', 'service', 'spingold',
            'embalm', 'paidseance', 'heist', 'magicadvice', 'chores', 'treatailments', 'errands', 'prestidigitation', 'act_mine',
            'purse', 'restless'],
        'Research': ['buyscroll', 'scribescroll', 'sublimate', 'bindcodex', 'compiletome', 'pace', 'act_element', 'mapstars',
            'grind', 'study', 'spellbook', 'act_garden', 'act_scry', 'act_concoct', 'bestiary', 'sylvansyllabary', 'dwarfbook',
            'lemurlexicon', 'demondict', 'malleus', 'fazbitfixate', 'coporisfabrica', 'unendingtome', 'almagest', 'prism',
            'breviary'],
        'Bones, Bodies and Evil things': ['bloodsiphon', 'graverob', 'murder', 'vileexperiment', 'dissect', 'dissect cadaver', 'grindbones', 'trapsoul',
            'urn', 'gathersouls'],
        'Gems': ['buygem', 'gembox', 'craftgem', 'gemcraft', 'terraform', 'artificialmountain', 'advgems', 'gembag'].concat(AE.data.GemImbueTaskIds),
        'Skills': ['focus', 'tendanimals', 'mythicanvil', 'geas', 'sabbat', 'a_travel', 'sombercandle', 'phylactory', 'animalfriend',
            'summonfamiliar', 'voidtouch', 'a_oppress', 'alkahest', 'dreamcatcher', 'windchime', 'ball', 'threesidecoin'],
        'Dreams': ['dreamweaver', 'starwish'],
        'Puppeteer': ['assemblemachina', 'assembleautomata', 'assemblepuppet', 'futurecouncil', 'machinalabor', 'puppetshow', 'strongstrings', 'ebonwoodsupply'],
        'Home': ['fireplane', 'airplane', 'waterplane', 'earthplane', 'cellar', 'clockworkexpansion', 'innersanctum'],
        'Runes': ['up_runecrafter', 'craftrune', 'craftfirerune', 'craftearthrune', 'craftairrune', 'craftwaterrune', 'craftspiritrune'],
        'Misc': ['wizardhall', 'hattrick', 'craftschematic', 'indulge', 'timesiphon', 'wishingwells', 'mendicant', 'siegeperilous'],
        'Alchemy and Potions': ['gatherherbs', 'alembic', 'herbbag', 'crucible', 'mortar', 'cauldron'],
        'Mounts and Travel': ['flyingcarpet', 'mule', 'oldnag', 'gelding', 'bayhorse', 'firecharger', 'fly', 'gryffonmount', 'firechariot', 'magicbroomstick',
            'ebonwoodbroomstick', 'pegasusmount', 'up_pack', 'up_ten_map', 'magichorseshoe', 'up_map1', 'tent'],
        'Stats': ['crystalmind', 'arcanebody', 'occultendure', 'carddeck', 'waxcandle', 'pot', 'proxies', 'celerity', 'puppetspies', 'fourleaf', 'ablativebarrier'],
        'Combat and Spells': ['codexannih', 'markhulcodex', 'maketitanhammer', 'up_lich', 'proxies2'],
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
        'winterhowl', 'preparetree', 'good_sacrifice', 'w_scholar', 'w_fame', 'w_multitask', 'w_fazbit4', 'alkahest', 'restless', 'dreamcatcher',
        'herbbag', 'prism', 'gembag', 'up_pack', 'windchime', 'urn', 'ball', 'crystalmind', 'arcanebody', 'occultendure', 'carddeck', 'mortar',
        'waxcandle', 'wishingwells', 'breviary', 'pot', 'strongstrings', 'proxies', 'up_ten_map', 'alembic', 'crucible', 'celerity',
        'mendicant', 'cauldron', 'cellar', 'puppetspies', 'clockworkexpansion', 'magichorseshoe', 'up_map1', 'proxies2', 'ebonwoodsupply',
        'threesidecoin', 'tent', 'siegeperilous', 'innersanctum', 'fourleaf'];



})(window.jQuery);