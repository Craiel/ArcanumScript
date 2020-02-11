let validateStat = require('./validateStat.js');
let validateLoot = require('./validateLoot.js');

const PatternType = {
    Object: 0,
    SubAction: 1,
    Effector: 2,
    Contextual: 3
};

const PatternObjectType = {
    Resource: 0,
    Skill: 1,
    State: 3,
    Stat: 4
};

function validateTargetObject(settings, key) {
    let target = settings.data.objects.resources[key];
    if(target !== undefined) {
        return [PatternType.Object, PatternObjectType.Resource, target];
    }

    target = settings.data.objects.skills[key];
    if(target !== undefined) {
        return [PatternType.Object, PatternObjectType.Skill, target];
    }

    target = settings.data.objects.states[key];
    if(target !== undefined) {
        return [PatternType.Object, PatternObjectType.State, target];
    }

    target = settings.data.objects.stats[key];
    if(target !== undefined) {
        return [PatternType.Object, PatternObjectType.Stat, target];
    }

    return undefined;
}

function validateTargetSubAction(settings, action) {
    switch (action) {
        case 'max':
        case 'rate': {
            return [PatternType.SubAction, action];
        }

        default: {
            return undefined;
        }
    }
}

function validateTargetEffector(settings, effector) {
    switch (effector) {
        case 'inv':
        case 'rest':
        case 'player': {
            return [PatternType.Effector, effector];
        }

        default: {
            return undefined;
        }
    }
}

function validateSpecialKeyword(settings, data) {
    switch (data) {
        case 'void': {
            return [PatternType.Contextual, data];
        }

        default: {
            return undefined;
        }
    }
}

function validateResourceBlock(settings, data) {
    if(data === undefined) {
        return true;
    }

    for(let key in data) {
        let keyParts = key.split('.');
        let partInfo = [];
        for(let i = 0; i < keyParts.length; i++) {
            let target = validateTargetObject(settings, keyParts[i]);
            if(target !== undefined) {
                partInfo.push(target);
                continue;
            }

            target = validateTargetEffector(settings, keyParts[i]);
            if(target !== undefined) {
                partInfo.push(target);
                continue;
            }

            target = validateTargetSubAction(settings, keyParts[i]);
            if(target !== undefined) {
                partInfo.push(target);
                continue;
            }

            throw "Could not idenfiy part " + keyParts[i] + " -- " + key;
        }
    }
}

exports.validateSecondPass = function(settings, key, value) {
    switch (key) {
        // resource modifying block data
        case 'mod': {
            validateResourceBlock(settings, value);
            break;
        }

        default: {
            // settings.logError("Unhandled property in second pass: " + key);
            // console.log(value);
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