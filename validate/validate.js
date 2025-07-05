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
        warnings: [],
        stats: {},
        addStat: function(key) {
            if(this.stats[key] === undefined) {
                this.stats[key] = 0;
            }

            this.stats[key]++;
        }
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

    settings.stable = args[3] === 'stable';

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
    validateFirstPassMany(data, 'stats', valData.DataType.Stat);
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
}

function addMetaTagLookup(value, type) {
    if(value === undefined){
        return;
    }

    switch (typeof value) {
        case 'string': {
            let trimmedValue = value.toLowerCase().trim();
            if(settings.data.lookups.metaTags[trimmedValue] === undefined){
                // Ignore duplicates for meta tags
                settings.data.lookups.metaTags[trimmedValue] = [trimmedValue, {}];
                addModStrings(trimmedValue, type);
            }

            if(settings.data.lookups.metaTags[trimmedValue][1][type.id] === undefined) {
                settings.data.lookups.metaTags[trimmedValue][1][type.id] = 1;
            } else {
                settings.data.lookups.metaTags[trimmedValue][1][type.id]++;
            }

            break;
        }

        case 'object': {
            for(let i = 0; i < value.length; i++) {
                addMetaTagLookup(value[i], type);
            }

            break;
        }

        default: {
            console.log(value);
            throw "Unhandled Tag Value: " + typeof value;
        }
    }
}

function addObjectKeyLookup(key, type) {
    if(settings.data.lookups.objects[key] !== undefined) {
        throw "Duplicate Object ID: " + key;
    }

    settings.data.lookups.objects[key] = [key, type];
}

function addModStrings(key, targetType) {
    if(settings.data.lookups.modStrings['player.' + key] !== undefined) {
        return;
    }

    settings.data.lookups.modStrings['player.' + key] = [key, targetType];

    settings.data.lookups.modStrings[key + '.rate'] = [key, targetType];
    settings.data.lookups.modStrings[key + '.max'] = [key, targetType];
    settings.data.lookups.modStrings[key + '.min'] = [key, targetType];

    settings.data.lookups.modStrings['effect.' + key] = [key, targetType];
    settings.data.lookups.modStrings['effect.' + key + '.rate'] = [key, targetType];
    settings.data.lookups.modStrings['effect.' + key + '.max'] = [key, targetType];
    settings.data.lookups.modStrings['effect.' + key + '.min'] = [key, targetType];
    settings.data.lookups.modStrings['effect.' + key + '.exp'] = [key, targetType];

    settings.data.lookups.modStrings['result.' + key] = [key, targetType];
    settings.data.lookups.modStrings['result.' + key + '.rate'] = [key, targetType];
    settings.data.lookups.modStrings['result.' + key + '.max'] = [key, targetType];
    settings.data.lookups.modStrings['result.' + key + '.min'] = [key, targetType];
    settings.data.lookups.modStrings['result.' + key + '.exp'] = [key, targetType];

    settings.data.lookups.modStrings['mod.' + key] = [key, targetType];
    settings.data.lookups.modStrings['mod.' + key + '.rate'] = [key, targetType];
    settings.data.lookups.modStrings['mod.' + key + '.max'] = [key, targetType];
    settings.data.lookups.modStrings['mod.' + key + '.min'] = [key, targetType];
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

function buildSpecialSecondPassLookups(objectKey) {
    let type = valData.getObjectType(objectKey);
    for(let key in settings.data.objects[objectKey]) {
        let object = settings.data.objects[objectKey][key];
        switch (type) {
            case valData.DataType.Stat:
            case valData.DataType.State:
            case valData.DataType.Resource: {
                addModStrings(key, type);
                break;
            }

            case valData.DataType.Upgrade: {
                addModStrings(key, type);
                addCostModString(key, type);
                addCombatModString(key, type);
                addPuppetModString(key, type);
                break;
            }

            case valData.DataType.Skill: {
                addModStrings(key, type);
                addPuppetModString(key, type);
                break;
            }

            case valData.DataType.Spell:
            case valData.DataType.Home:
            case valData.DataType.Furniture:
            case valData.DataType.Enchant:
            case valData.DataType.Task: {
                addCostModString(key, type);
                addCombatModString(key, type);
                break;
            }

            case valData.DataType.Armor: {
                addMetaTagLookup(object.slot, type);
                break;
            }

            case valData.DataType.Monster:
            case valData.DataType.Material: {
                addMetaTagLookup(object.kind, type);
                break;
            }
        }
    }
}

function buildSecondPassLookups() {
    settings.log();
    settings.log(" --------------------- Building Lookup Data ---------------------");
    settings.log();

    settings.data.lookups = {
        metaTags: {},
        objects: {},
        modStrings: {}
    };

    for(let objectKey in settings.data.objects) {
        let objectList = settings.data.objects[objectKey];
        for(let key in objectList) {
            let object = objectList[key];
            addModStrings(key, object.type);
            addObjectKeyLookup(key, object.type);
            addMetaTagLookup(object.tags, object.type);
        }

        buildSpecialSecondPassLookups(objectKey);
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
        settings.data.lookups.modStrings["player.immunities." + resist] = [resist, valData.DataType.Internal];

        settings.data.lookups.modStrings["mod.player.resist." + resist] = [resist, valData.DataType.Internal];
    }

    settings.log(" - " + Object.keys(settings.data.lookups.metaTags).length + " Tags");
    settings.log(" - " + Object.keys(settings.data.lookups.objects).length + " Objects");
    settings.log(" - " + Object.keys(settings.data.lookups.modStrings).length + " possible modifier lookup entries");
}

function writeLogs(){
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

function logStats(){
    settings.log();
    settings.log(" Statistics:");
    settings.log();

    for(let key in settings.results.stats) {
        settings.log("Stat: " + key + " == " + settings.results.stats[key]);
    }
}

function doValidate() {
    if(processArguments() === false) {
        return;
    }

    loader.loadData(settings);

    validateFirstPass(settings.rawdata);

    // Process the modules
    validateModule(settings.rawdata.hall, 'hall');

    for(let i = 0; i < settings.rawdata.modList.length; i++) {
        let modKey = 'mod_' + settings.rawdata.modList[i];
        validateModule(settings.rawdata[modKey], modKey);
    }

    for(let key in settings.rawdata) {
        if(settings.firstPassState[key] !== true) {
            settings.logWarning("First Pass did not handle data: " + key);
        }
    }

    // Build before validate to not pollute the data
    builder.build(settings.data.objects, settings.stable);

    appendHardcodedData();
    buildSecondPassLookups();
    validateSecondPass();

    for(let key in settings.data.objects) {
        if(settings.secondPassState[key] !== true) {
            settings.logWarning("Second Pass did not handle data: " + key);
        }
    }

    logStats();
    writeLogs();
}

doValidate();