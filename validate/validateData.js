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

exports.getObjectType = function(id) {
    for(let key in this.DataType) {
        if(this.DataType[key].id === id) {
            return this.DataType[key];
        }
    }

    return undefined;
};

exports.Elements = ['void', 'shadow', 'fire', 'water', 'ice', 'air', 'earth', "slash", "pierce", "blunt", 'physical', 'light', 'poison', 'venom', 'mana', 'nature', 'spirit', 'undead'];

exports.Targets = ['all', 'enemies', 'ally', 'allies', 'self'];

exports.Flags = ['noattack', 'nodefend', 'noact', 'nocast'];

exports.Biomes = ['swamp', 'plains', 'woods', 'town', 'sea', 'mountains'];

exports.StatType = {
    Number: 'number',
    Object: 'object',
    Boolean: 'bool',
    Percent: 'percent',
    Range: 'range',
    Exponent: 'exponent',
    String: 'string'
};

exports.HardCodedStats = ["tohit", "defense", "armor", 'notoriety', 'regen', 'skill', 'runner', 'title', 'space'];

exports.MetaResources = ["minions", "allies", "spelllist", "enchantslots", 'inv', 'userSpells', 'pursuits'];

exports.CombatModStrings = ["player.damage",'attack.damage.min','attack.damage.max','attack.dot.effect.dmg.min','attack.dot.effect.dmg.max',
    'attack.bonus', 'attack.tohit', 'attack.dot.duration', 'attack.hits.tohit', 'attack.hits.damage.max', 'attack.hits.damage.min',
    'attack.dot.dmg.min', 'attack.dot.dmg.max', 'attack.dot.damage.max', 'attack.dot.damage.min'];

exports.PuppetModStrings = ['minions.puppet.hp', 'minions.puppet.dmg', 'minions.machina.hp', 'minions.machina.dmg', 'minions.automata.hp', 'minions.automata.dmg',
    'result.automatas', 'minions.machina.speed', 'result.machinae', 'result.puppets'];

exports.SpecialModStrings = ['witchcraft', 'minions.keep', 'focus.effect.runner.exp', 'gemimbue.length', 'gemimbue.perpetual', 'candle.max',
    'assemblemachina.length', 'assembleautomata.length', 'bed.mod.runner.max', 'dot.duration'];