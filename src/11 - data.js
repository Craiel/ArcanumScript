// Data
(function($) {
    'use strict';

    class AEData {
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
        Schematic: 'schematic',

        Machine: 'machinae',
        Puppet: 'puppets',

        // Seasonal
        EmblemOfIce: 'emblemofice',
        WinterEssence: 'winteressence',
        Frost: 'frost',
        LivingSnow: 'livingsnow',
        SnowMan: 'snowman',
        SnowDrop: 'snowdrop'
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
            'purse'],
        'Research': ['buyscroll', 'scribescroll', 'sublimate', 'bindcodex', 'compiletome', 'pace', 'act_element', 'mapstars',
            'grind', 'study', 'spellbook', 'act_garden', 'act_scry', 'act_concoct', 'bestiary', 'sylvansyllabary', 'dwarfbook',
            'lemurlexicon', 'demondict', 'malleus', 'fazbitfixate', 'coporisfabrica', 'unendingtome', 'almagest'],
        'Bones, Bodies and Evil things': ['bloodsiphon', 'graverob', 'murder', 'vileexperiment', 'dissect', 'dissect cadaver', 'grindbones', 'trapsoul'],
        'Gems': ['buygem', 'gembox', 'craftgem', 'gemcraft', 'terraform', 'artificialmountain', 'advgems'].concat(AE.data.GemImbueTaskIds),
        'Skills': ['focus', 'tendanimals', 'mythicanvil', 'geas', 'sabbat', 'a_travel', 'sombercandle', 'phylactory', 'animalfriend',
            'summonfamiliar'],
        'Dreams': ['dreamweaver', 'starwish'],
        'Puppeteer': ['assemblemachina', 'assembleautomata', 'assemblepuppet', 'futurecouncil', 'machinalabor', 'puppetshow'],
        'Home': ['fireplane', 'airplane', 'waterplane'],
        'Runes': ['up_runecrafter', 'craftrune', 'craftfirerune', 'craftearthrune', 'craftairrune', 'craftwaterrune', 'craftspiritrune'],
        'Misc': ['gatherherbs', 'wizardhall', 'hattrick', 'craftschematic', 'indulge', 'timesiphon'],
        'Mount': ['flyingcarpet', 'mule', 'oldnag', 'gelding', 'bayhorse', 'firecharger', 'fly', 'gryffonmount'],
        'Combat and Spells': ['codexannih', 'markhulcodex', 'maketitanhammer', 'up_lich'],
        'Class': AE.data.ClassUpgradeTasks,

        '❄ Winter': ['meltsnowman', 'makesnowman', 'restincottage', 'winteraward', 'winterchill', 'warmpotion', 'hearthexpansion', 'icystudy']
    };

    AE.data.UpgradeTasks = ['pouch', 'purse', 'gembox', 'gemcraft', 'artificialmountain', 'mythicanvil', 'up_runecrafter',
        'wizardhall', 'winteraward', 'fireplane', 'airplane', 'waterplane', 'warmpotion', 'winterchill', 'advgems', 'sombercandle',
        'hearthexpansion', 'flyingcarpet', 'mule', 'oldnag', 'gelding', 'bayhorse', 'firecharger', 'fly', 'gryffonmount', 'spellbook',
        'bestiary', 'codexannih', 'markhulcodex', 'sylvansyllabary', 'dwarfbook', 'lemurlexicon', 'demondict', 'malleus', 'maketitanhammer',
        'fazbitfixate', 'coporisfabrica', 'unendingtome', 'almagest', 'phylactory', 'up_lich', 'animalfriend', 'summonfamiliar', 'icystudy'];



})(window.jQuery);