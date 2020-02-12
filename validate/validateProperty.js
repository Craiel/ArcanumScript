let validateStat = require('./validateStat.js');
let validateLoot = require('./validateLoot.js');
let valData = require('./validateData.js');

const RequireRegex = /g\.[\w]+/gi;

function validateResourceBlock(settings, object, key) {
    let data = object[key];
    if(data === undefined) {
        return true;
    }

    for(let key in data) {
        let modTarget = settings.data.lookups.modStrings[key];
        if(modTarget !== undefined) {
            continue;
        }

        let keyParts = key.split('.');
        if(keyParts.length > 1) {
            let modContextTarget = settings.data.lookups.modStrings[keyParts[0]];
            keyParts.shift();
            let modTarget = settings.data.lookups.modStrings[keyParts.join(".")];
            if(modContextTarget !== undefined && modTarget !== undefined) {
                // This is a context + mod action
                continue;
            }
        }

        settings.logError(key + " unknown mod");
    }
}

function tagExists(tag) {
    for(let i = 0; i < valData.Tags.length; i++){
        if(valData.Tags[i].toLowerCase() === tag.trim().toLowerCase()) {
            return true;
        }
    }

    return false;
}

function isValidRequireValue(settings, value) {
    value = value.replace("g.", "");
    switch (value) {
        case 'player': {
            return true;
        }
    }

    let modTarget = settings.data.lookups.modStrings[value];
    if(modTarget === undefined) {
        return false;
    }

    return true;
}

exports.validateSecondPass = function(settings, object, key) {
    switch (key) {
        // resource modifying block data
        case 'mod': {
            validateResourceBlock(settings, object, key);
            break;
        }

        case 'tags': {
            let tags = object[key];
            for(let i = 0; i < tags.length; i++){
                if(!tagExists(tags[i])) {
                    settings.logError(" Unknown Tag: " + tags[i]);
                }
            }

            break;
        }

        case 'require': {
            let values = object[key];
            for(let i = 0; i < values.length; i++) {
                switch (typeof values[i]) {
                    case 'string': {
                        let result = values[i].match(RequireRegex);
                        if(result === null) {
                            if(isValidRequireValue(settings, values[i]) !== true) {
                                settings.logError(" Unknown Require target: " + values[i]);
                            }
                        } else {
                            for(let n = 0; n < result.length; n++){
                                if(isValidRequireValue(settings, result[n]) !== true) {
                                    settings.logError(" Unknown Require target in formula: " + result[n] + " -- " + values[i]);
                                }
                            }
                        }

                        break;
                    }

                    case 'object': {
                        settings.logWarning(" Suspicious require data: " + values[i])
                        break;
                    }
                }

            }

            break;
        }

        default: {
            //console.log(object[key]);
            //throw "Unhandled property in second pass: " + key;
        }
    }
};

exports.validateFirstPass = function(settings, sourceData, targetData, property) {

    let propertyData = sourceData[property];
    if(propertyData === undefined || propertyData === null || propertyData === ''){
        settings.logWarning(property + " value is empty");
        return true;
    }

    if(targetData._secondPassTodo === undefined) {
        targetData._secondPassTodo = [];
    }

    let propertyName = property.toLowerCase();
    switch (propertyName) {
        case 'evilamt': {
            settings.logWarning("property evilamt should probably be .evil");
            propertyName = 'evil';
            break;
        }

        case 'dmg': {
            propertyName = 'damage';
            break;
        }
    }

    switch (propertyName) {
        case 'id':{
            return true;
        }

        // Number properties, can be simple numbers or string stat numbers
        case 'weight':
        case 'hands':
        case 'pricemod':
        case 'armor':
        case 'damage':
        case 'speed':
        case 'dodge':
        case 'hp':
        case 'defense':
        case 'tohit':
        case 'regen':
        case 'evil':
        case 'dist':
        case 'distance':
        case 'level':
        case 'duration':
        case 'bonus':
        case 'cd':
        case 'max':
        case 'val':
        case 'scale':
        case 'length': {
            switch (typeof propertyData) {
                case 'number': {
                    targetData[property] = parseInt(propertyData);
                    return true;
                }

                case 'string': {
                    let statData = validateStat.validateOne(settings, propertyName, propertyData);
                    if(statData === undefined) {
                        settings.logError(property + " value is not a valid stat for number field " + propertyData);
                        return false;
                    }

                    targetData[propertyData] = statData;
                    return true;
                }

                default: {
                    settings.logError(property + " value is invalid: " + propertyData + " (" + typeof propertyData + ")");
                    return false;
                }
            }
        }

        // Boolean properties
        case 'reflect':
        case 'unique':
        case 'locked':
        case 'recipe':
        case 'save':
        case 'owned':
        case 'perpetual':
        case 'warn':
        case 'noproc':
        case 'unit':
        case 'hide':
        case 'reverse':
        case 'stat':
        case 'unused':
        case 'repeat': {
            switch(typeof propertyData) {
                case 'string': {
                    let temp = propertyData.toLowerCase().trim();
                    if(temp === "true") {
                        settings.logWarning(property + " is boolean type but serialized as string");
                        targetData[propertyData] = true;
                        return true;
                    }

                    if(temp === "false") {
                        settings.logWarning(property + " is boolean type but serialized as string");
                        targetData[propertyData] = false;
                        return true;
                    }

                    break;
                }

                case 'boolean': {
                    targetData[propertyData] = propertyData;
                    return true;
                }
            }

            settings.logError(property + " value is invalid: " + propertyData + ' (' + typeof propertyData + ')');
            return false;
        }

        // Split value and other complex properties
        case 'only':
        case 'immune':
        case 'spells':
        case 'require':
        case 'lock':
        case 'attack':
        case 'encs':
        case "exclude":
        case 'spawns':
        case 'biome':
        case 'boss':
        case 'action':
        case 'dot':
        case 'type':
        case 'material':
        case 'flags':
        case 'resist':
        case 'use':
        case 'disable':
        case 'choice':
        case 'need':
        case 'once':
        case 'tags': {
            if(Array.isArray(propertyData)) {
                targetData[property] = propertyData;
            } else if (typeof propertyData === 'string') {
                targetData[property] = propertyData.split(',');
            } else {
                targetData[property] = propertyData;
            }

            targetData._secondPassTodo.push(property);
            return true;
        }

        // Simple properties, copy only
        case 'adj':
        case 'kind':
        case 'school':
        case 'alias':
        case 'slot':
        case 'log':
        case 'fill':
        case 'desc':
        case 'sym':
        case 'verb':
        case 'flavor':
        case 'color':
        case 'actname':
        case 'buyname':
        case 'actdesc':
        case 'title':
        case 'name': {
            targetData[property] = propertyData;
            return true;
        }

        // Interval stat blocks
        case 'at':
        case 'every': {
            let statBlock = validateStat.validateIntervalStats(settings, propertyData);
            if(statBlock === undefined){
                settings.logError("Interval stat block failed to validate");
                return false;
            }

            targetData[property] = statBlock;
            targetData._secondPassTodo.push(property);
            return true;
        }

        // Stat blocks
        case 'buy':
        case 'effect':
        case 'mod':
        case 'result':
        case 'run':
        case 'cost': {
            let statBlock = validateStat.validateBlock(settings, propertyData);
            if(statBlock === undefined) {
                settings.logError("Stat block failed to validate");
                return false;
            }

            targetData[property] = statBlock;
            targetData._secondPassTodo.push(property);
            return true;
        }

        // Special cases
        case 'loot': {
            targetData[property] = validateLoot.validate(settings, propertyData);
            targetData._secondPassTodo.push(property);
            return true;
        }

        default: {
            settings.logError("Unhandled Property: " + property + " (" + typeof propertyData + ")");
            return false;
        }
    }
};