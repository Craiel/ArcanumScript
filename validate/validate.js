const fs = require("fs");

let loader = require('./loader.js');
let validateObject = require('./validateObject.js');
let builder = require('./databuilder.js');
let valData = require('./validateData.js');

function getTimeStamp() {
    let date = new Date();
    return '[' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds() + ']';
}

let settings = {
    rawdata: {},
    data: {
        objects: {}
    },
    firstPassState: {},
    secondPassState: {},
    dataPath: undefined,
    results: {
        dump: [],
        dumpUniq: {},
        all: [],
        errors: [],
        warnings: []
    },

    getFormattedLog(msg, subType) {
        if(msg === undefined){
            msg = '';
        }

        let formatted = getTimeStamp();
        if(subType !== undefined) {
            formatted = formatted + ' ' + subType;
        }

        if(this.contextId !== undefined) {
            return formatted + ' ' + this.contextId + '.' + msg;
        }

        return formatted + ' ' + msg;
    },

    log: function(msg, logToConsole = true) {
        let finalMsg = this.getFormattedLog(msg);
        this.results.all.push(finalMsg);

        if(logToConsole === true) {
            console.log(finalMsg);
        }
    },
    logError: function (msg) {
        this.log(msg, false);

        let finalMsg = this.getFormattedLog(msg, 'ERROR');
        this.results.errors.push(finalMsg);
        console.error(finalMsg);
    },
    logWarning: function(msg) {
        this.log(msg, false);

        let finalMsg = this.getFormattedLog(msg, 'WARNING');
        this.results.warnings.push(finalMsg);
        console.warn(finalMsg);
    }
};

function processArguments() {
    let args = process.argv;
    if(args.length <= 2) {
        settings.logError("Missing Arguments")
        return false;
    }

    settings.dataPath = args[2];
    if (!fs.existsSync(settings.dataPath)) {
        settings.logError("Data Path does not exist: " + settings.dataPath);
        return false;
    }

    return true;
}

function validateFirstPassMany(data, key, type) {
    let entries = data[key];
    if(entries=== undefined) {
        return;
    }

    settings.log();
    settings.log(" - " + entries.length + " " + type.id);
    for(let i = 0; i < entries.length; i++) {
        let objectData = entries[i];
        validateObject.firstPass(settings, objectData, type);
    }

    settings.firstPassState[key] = true;
}

function validateModule(data, sourceType) {
    if(data === undefined) {
        return;
    }

    let moduleDef = {
        id: data.module,
        symbol: data.sym
    };

    if(moduleDef.id === undefined) {
        settings.logError("Module has no valid id!");
        return;
    }

    settings.moduleId = moduleDef.id;

    if(moduleDef.symbol === undefined) {
        settings.logWarning("Module has no symbol");
    }

    validateFirstPass(data.data);

    settings.moduleId = undefined;

    settings.firstPassState[sourceType] = true;
}

function validateFirstPass(data) {
    if(data === undefined) {
        return;
    }

    settings.log();
    settings.log(" --------------------- First Pass ---------------------");
    if(settings.moduleId !== undefined) {
        settings.log("   Module: " + settings.moduleId);
    }

    settings.log();

    validateFirstPassMany(data, 'resources', valData.DataType.Resource);
    validateFirstPassMany(data, 'materials', valData.DataType.Material);
    validateFirstPassMany(data, 'weapons', valData.DataType.Weapon);
    validateFirstPassMany(data, 'armors', valData.DataType.Armor);
    validateFirstPassMany(data, 'rares', valData.DataType.Rare);
    validateFirstPassMany(data, 'potions', valData.DataType.Potion);
    validateFirstPassMany(data, 'furniture', valData.DataType.Furniture);
    validateFirstPassMany(data, 'homes', valData.DataType.Home);
    validateFirstPassMany(data, 'tasks', valData.DataType.Task);
    validateFirstPassMany(data, 'upgrades', valData.DataType.Upgrade);
    validateFirstPassMany(data, 'dungeons', valData.DataType.Dungeon);
    validateFirstPassMany(data, 'monsters', valData.DataType.Monster);
    validateFirstPassMany(data, 'spells', valData.DataType.Spell);
    validateFirstPassMany(data, 'enchants', valData.DataType.Enchant);
    validateFirstPassMany(data, 'skills', valData.DataType.Skill);
    validateFirstPassMany(data, 'classes', valData.DataType.Class);
    validateFirstPassMany(data, 'encounters', valData.DataType.Encounter);
    validateFirstPassMany(data, 'events', valData.DataType.Event);
    validateFirstPassMany(data, 'states', valData.DataType.State);
    validateFirstPassMany(data, 'locales', valData.DataType.Location);
    validateFirstPassMany(data, 'stressors', valData.DataType.State);
    validateFirstPassMany(data, 'player', valData.DataType.Stat);
    validateFirstPassMany(data, 'sections', valData.DataType.Section);
}

function validateSecondPass() {
    settings.log();
    settings.log(" --------------------- Second Pass ---------------------");
    settings.log();

    for(let key in valData.DataType) {
        let dataType = valData.DataType[key];
        let data = settings.data.objects[dataType.id];
        settings.log();
        if(data === undefined) {
            settings.log("No data for " + dataType.id);
            continue;
        }

        settings.log(" - " + Object.keys(data).length + " " + dataType.id);
        for(let objectKey in data) {
            validateObject.secondPass(settings, data[objectKey], dataType);
        }

        settings.secondPassState[dataType.id] = true;
    }
}


function appendHardcodedData() {
    for(let i = 0; i < valData.HardCodedStats.length; i++){
        let key = valData.HardCodedStats[i];
        if(settings.data.objects.stat[key] !== undefined) {
            throw "Stat Exists: " + key;
        }

        settings.data.objects.stat[key] = {"id": key};
    }

    // Combo resources
    for(let i = 0; i < valData.MetaResources.length; i++) {
        let key = valData.MetaResources[i];
        if(settings.data.objects.resource[key] !== undefined) {
            throw "Combo Resource exists: " + key;
        }

        settings.data.objects.resource[key] = {"id": key};
    }

    // Tags
    for(let i = 0; i < valData.Tags.length; i++) {
        let key = valData.Tags[i];
        if(settings.data.objects.resource[key] !== undefined) {
            throw "Tag exists: " + key;
        }

        settings.data.objects.resource[key] = {"id": key};
    }
}

function addModStringBase(key, targetType) {
    if(settings.data.lookups.modStrings[key] !== undefined) {
        throw "Duplicate Mod Strings: " + key;
    }

    settings.data.lookups.modStrings[key] = [key, targetType];
    settings.data.lookups.modStrings['effect.' + key] = [key, targetType];
}

function addModStringExtended(key, targetType) {
    if(settings.data.lookups.modStrings['player.' + key] !== undefined) {
        throw "Duplicate Extended Mod Strings: " + key;
    }

    settings.data.lookups.modStrings['player.' + key] = [key, targetType];

    settings.data.lookups.modStrings[key + '.rate'] = [key, targetType];
    settings.data.lookups.modStrings[key + '.max'] = [key, targetType];

    settings.data.lookups.modStrings['mod.' + key] = [key, targetType];
    settings.data.lookups.modStrings['mod.' + key + '.rate'] = [key, targetType];
    settings.data.lookups.modStrings['mod.' + key + '.max'] = [key, targetType];
}

function addCostModString(key, dataType) {
    for(let resourceKey in settings.data.objects.resource) {
        settings.data.lookups.modStrings[key + '.cost.' + resourceKey] = [key, dataType];
    }

    for(let i = 0; i < valData.Elements.length; i++){
        let resist = valData.Elements[i];
        settings.data.lookups.modStrings[key + '.cost.' + resist] = [key, dataType];
    }
}

function addCombatModString(key, dataType) {
    for(let i = 0; i < valData.CombatModStrings.length; i++){
        let str = valData.CombatModStrings[i];
        settings.data.lookups.modStrings[key + '.' + str] = [key, dataType];
    }
}

function addPuppetModString(key, dataType) {
    for(let i = 0; i < valData.PuppetModStrings.length; i++){
        let str = valData.PuppetModStrings[i];
        settings.data.lookups.modStrings[key + '.' + str] = [key, dataType];
    }
}

function buildSecondPassLookups() {
    settings.log();
    settings.log(" --------------------- Building Lookup Data ---------------------");
    settings.log();

    settings.data.lookups = {
        modStrings: {}
    };

    for(let key in settings.data.objects.resource) {
        addModStringBase(key, valData.DataType.Resource);
        addModStringExtended(key, valData.DataType.Resource);
    }

    for(let key in settings.data.objects.skill) {
        addModStringBase(key, valData.DataType.Skill);
        addModStringExtended(key, valData.DataType.Skill);
        addPuppetModString(key, valData.DataType.Skill);
    }

    for(let key in settings.data.objects.state) {
        addModStringBase(key, valData.DataType.State);
        addModStringExtended(key, valData.DataType.State);
    }

    for(let key in settings.data.objects.stat) {
        addModStringBase(key, valData.DataType.Stat);
        addModStringExtended(key, valData.DataType.Stat);
    }

    for(let key in settings.data.objects.upgrade) {
        addModStringBase(key, valData.DataType.Upgrade);
        addModStringExtended(key, valData.DataType.Upgrade);
        addCostModString(key, valData.DataType.Upgrade);
        addCombatModString(key, valData.DataType.Upgrade);
        addPuppetModString(key, valData.DataType.Skill);
    }

    for(let key in settings.data.objects.task) {
        addModStringBase(key, valData.DataType.Task);
        addCostModString(key, valData.DataType.Task);
        addCombatModString(key, valData.DataType.Task);
    }

    for(let key in settings.data.objects.enchant) {
        addModStringBase(key, valData.DataType.Enchant);
        addCostModString(key, valData.DataType.Enchant);
        addCombatModString(key, valData.DataType.Enchant);
    }

    for(let key in settings.data.objects.furniture) {
        addModStringBase(key, valData.DataType.Furniture);
        addCostModString(key, valData.DataType.Furniture);
    }

    for(let key in settings.data.objects.spell) {
        addModStringBase(key, valData.DataType.Spell);
        addCostModString(key, valData.DataType.Spell);
    }

    for(let key in settings.data.objects.home) {
        addModStringBase(key, valData.DataType.Home);
        addCostModString(key, valData.DataType.Home);
    }

    for(let key in settings.data.objects.class) {
        addModStringBase(key, valData.DataType.Class);
    }

    for(let key in settings.data.objects.location) {
        addModStringBase(key, valData.DataType.Location);
    }

    for(let key in settings.data.objects.event) {
        addModStringBase(key, valData.DataType.Event);
    }

    for(let key in settings.data.objects.dungeon) {
        addModStringBase(key, valData.DataType.Dungeon);
    }

    for(let i = 0; i < valData.CombatModStrings.length; i++){
        let str = valData.CombatModStrings[i];
        settings.data.lookups.modStrings[str] = [i, valData.DataType.Internal];
    }

    for(let i = 0; i < valData.PuppetModStrings.length; i++){
        let str = valData.PuppetModStrings[i];
        settings.data.lookups.modStrings[str] = [i, valData.DataType.Internal];
    }

    for(let i = 0; i < valData.SpecialModStrings.length; i++){
        let str = valData.SpecialModStrings[i];
        settings.data.lookups.modStrings[str] = [i, valData.DataType.Internal];
    }

    for(let i = 0; i < valData.Elements.length; i++){
        let resist = valData.Elements[i];
        settings.data.lookups.modStrings["resist." + resist] = [resist, valData.DataType.Internal];
        settings.data.lookups.modStrings["player.resist." + resist] = [resist, valData.DataType.Internal];
        settings.data.lookups.modStrings["player.bonuses." + resist] = [resist, valData.DataType.Internal];
        settings.data.lookups.modStrings["player.hits." + resist] = [resist, valData.DataType.Internal];
    }

    settings.log(" - " + Object.keys(settings.data.lookups.modStrings).length + " possible modifier lookup entries");
}

function doValidate() {
    if(processArguments() === false) {
        return;
    }

    loader.loadData(settings);

    validateFirstPass(settings.rawdata);

    // Process the modules
    validateModule(settings.rawdata.hall, 'hall');
    validateModule(settings.rawdata.mod_patrons, 'mod_patrons');
    validateModule(settings.rawdata.mod_winter, 'mod_winter');
    validateModule(settings.rawdata.mod_puppeteer, 'mod_puppeteer');
    validateModule(settings.rawdata.mod_combattutorial, 'mod_combattutorial');

    for(let key in settings.rawdata) {
        if(settings.firstPassState[key] !== true) {
            settings.logWarning("First Pass did not handle data: " + key);
        }
    }

    // Build before validate to not pollute the data
    builder.build(settings.data.objects);

    appendHardcodedData();
    buildSecondPassLookups();
    validateSecondPass();

    for(let key in settings.data.objects) {
        if(settings.secondPassState[key] !== true) {
            settings.logWarning("Second Pass did not handle data: " + key);
        }
    }

    if(settings.results.dump.length > 0) {
        fs.writeFileSync('dump.txt', settings.results.dump.join('\n'), 'UTF8');
    }

    let uniqDumpEntries = [];
    for(let entry in settings.results.dumpUniq) {
        uniqDumpEntries.push(entry);
    }

    if(uniqDumpEntries.length > 0) {
        uniqDumpEntries.sort();
        fs.writeFileSync('dump_u.txt', uniqDumpEntries.join('","'), 'UTF8');
    }

    fs.writeFileSync('log.txt', settings.results.all.join('\n'), 'UTF8');
    fs.writeFileSync('log-warn.txt', settings.results.warnings.join('\n'), 'UTF8');
    fs.writeFileSync('log-error.txt', settings.results.errors.join('\n'), 'UTF8');
}

doValidate();