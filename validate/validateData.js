exports.DataType = {
    Resource: {id: 'resource'},
    Material: {id: 'material'},
    Weapon: {id: 'weapon'},
    Armor: {id: 'armor'},
    Rare: {id: 'rare'},
    Potion: {id: 'potion'},
    Furniture: {id: 'furniture'},
    Home: {id: 'home'},
    Task: {id: 'task'},
    Upgrade: {id: 'upgrade'},
    Dungeon: {id: 'dungeon'},
    Monster: {id: 'monster'},
    Spell: {id: 'spell'},
    Enchant: {id: 'enchant'},
    Skill: {id:'skill'},
    Class: {id: 'class'},
    Encounter: {id: 'encounter'},
    Event: {id: 'event'},
    State: {id: 'state'},
    Stat: {id: 'stat'},
    Location: {id: 'location'},
    Section: {id: 'section'},
    Internal: {id: 'internal'}
};

exports.Elements = ['void', 'shadow', 'fire', 'water', 'ice', 'air', 'earth', "slash", "pierce", "blunt", 'light', 'poison', 'venom', 'mana', 'nature', 'spirit'];

exports.StatType = {
    Number: 0,
    Object: 1,
    Boolean: 3,
    Percent: 4,
    Range: 5,
    Exponent: 6,
    String: 7
};

exports.HardCodedStats = ["tohit", "defense", "armor", 'notoriety', 'regen', 'skill', 'runner'];
exports.Tags = ["magicgems", "t_runes", "element", 'elemental', 'manas', "prismatic", 'bed', "airsource","armssource","automata","book","candle","earthsource","enchantsource","firesource","gemimbue","herb","lightsource","naturesource","outdoors","patron","plantsource","potsource","prison","reagent","rez","shadowsource","spiritsource","stables","starsource","steed","stress","t_automata","t_hall","t_job","t_machina","t_mine","t_pets","t_puppet","t_rest","t_school","t_tier0","t_tier1","t_tier2","t_tier3","t_tier4","t_tier5","t_tier6","timesource","tricksource","watersource","workspace"];

exports.MetaResources = ["minions", "allies", "spelllist", "enchantslots", 'inv', 'userSpells', 'hallSize', 'pursuits'];

exports.CombatModStrings = ["player.damage",'attack.damage.min','attack.damage.max','attack.dot.effect.dmg.min','attack.dot.effect.dmg.max',
    'attack.bonus', 'attack.tohit', 'attack.dot.duration'];

exports.PuppetModStrings = ['minions.puppet.hp', 'minions.puppet.dmg', 'minions.machina.hp', 'minions.machina.dmg', 'minions.automata.hp', 'minions.automata.dmg',
    'result.automatas', 'minions.machina.speed', 'result.machinae', 'result.puppets'];

exports.SpecialModStrings = ['witchcraft', 'minions.keep', 'focus.effect.runner.exp', 'gemimbue.length', 'gemimbue.perpetual', 'candle.max',
    'assemblemachina.length', 'assembleautomata.length'];