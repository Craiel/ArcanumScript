const fs = require("fs");

let loader = require('./loader.js');
let validateObject = require('./validateObject.js');
let builder = require('./databuilder.js');

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

function validateFirstPassMany(data, type, sourceType) {
    if(data === undefined) {
        return;
    }

    if(sourceType === undefined) {
        sourceType = type;
    }

    settings.log();
    settings.log(" - " + data.length + " " + sourceType);
    for(let i = 0; i < data.length; i++) {
        let objectData = data[i];
        validateObject.firstPass(settings, objectData, type);
    }

    settings.firstPassState[sourceType] = true;
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

    validateFirstPassMany(data.resources, 'resources');
    validateFirstPassMany(data.materials, 'materials');
    validateFirstPassMany(data.weapons, 'weapons');
    validateFirstPassMany(data.armors, 'armor', 'armors');
    validateFirstPassMany(data.rares, 'rares');
    validateFirstPassMany(data.potions, 'potions');
    validateFirstPassMany(data.furniture, 'furniture');
    validateFirstPassMany(data.homes, 'homes');
    validateFirstPassMany(data.tasks, 'tasks');
    validateFirstPassMany(data.upgrades, 'tasks', "upgrades");
    validateFirstPassMany(data.dungeons, 'dungeons');
    validateFirstPassMany(data.monsters, 'monsters');
    validateFirstPassMany(data.spells, 'spells');
    validateFirstPassMany(data.enchants, 'enchants');
    validateFirstPassMany(data.skills, 'skills');
    validateFirstPassMany(data.classes, 'classes');
    validateFirstPassMany(data.encounters, 'encounters');
    validateFirstPassMany(data.events, 'events');
    validateFirstPassMany(data.states, 'states');
    validateFirstPassMany(data.locales, 'locations', 'locales');
    validateFirstPassMany(data.stressors, 'states', 'stressors');
    validateFirstPassMany(data.player, 'stats', "player");
    validateFirstPassMany(data.sections, 'sections');
}

function validateSecondPassMany(data, type) {
    settings.log();
    if(data === undefined) {
        settings.log("No data for " + type);
        return
    }

    settings.log(" - " + Object.keys(data).length + " " + type);
    for(let key in data) {
        validateObject.secondPass(settings, data[key], type);
    }

    settings.secondPassState[type] = true;
}

function validateSecondPass(data) {
    settings.log();
    settings.log(" --------------------- Second Pass ---------------------");
    settings.log();

    validateSecondPassMany(data.resources, "resources");
    validateSecondPassMany(data.materials, 'materials');
    validateSecondPassMany(data.weapons, 'weapons');
    validateSecondPassMany(data.armor, 'armor');
    validateSecondPassMany(data.rares, 'rares');
    validateSecondPassMany(data.potions, 'potions');
    validateSecondPassMany(data.furniture, 'furniture');
    validateSecondPassMany(data.homes, 'homes');
    validateSecondPassMany(data.tasks, "tasks");
    validateSecondPassMany(data.dungeons, "dungeons");
    validateSecondPassMany(data.monsters, "monsters");
    validateSecondPassMany(data.spells, "spells");
    validateSecondPassMany(data.enchants, "enchants");
    validateSecondPassMany(data.skills, 'skills');
    validateSecondPassMany(data.classes, 'classes');
    validateSecondPassMany(data.encounters, 'encounters');
    validateSecondPassMany(data.events, 'events');
    validateSecondPassMany(data.stats, 'stats');
    validateSecondPassMany(data.states, 'states');
    validateSecondPassMany(data.locations, 'locations');
    validateSecondPassMany(data.sections, 'sections');
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

    // validateSecondPass(settings.data.objects);

    for(let key in settings.data.objects) {
        if(settings.secondPassState[key] !== true) {
            settings.logWarning("Second Pass did not handle data: " + key);
        }
    }

    builder.build(settings.data.objects);

    fs.writeFileSync('log.txt', settings.results.all.join('\n'), 'UTF8');
    fs.writeFileSync('log-warn.txt', settings.results.warnings.join('\n'), 'UTF8');
    fs.writeFileSync('log-error.txt', settings.results.errors.join('\n'), 'UTF8');
}

doValidate();