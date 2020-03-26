let validateStat = require('./validateStat.js');
let validateLoot = require('./validateLoot.js');
let valData = require('./validateData.js');

const RequireRegex = /g\.[\w]+/gi;

function isModString(settings, value) {
    settings.results.addStat('Val_ModString');
    let modTarget = settings.data.lookups.modStrings[value];
    if(modTarget !== undefined) {
        return true;
    }

    let objectTarget = settings.data.lookups.objects[value];
    if(objectTarget !== undefined){
        // this is an object mod
        return true;
    }

    return false;
}

function validateModificationBlock(settings, object, valueKey) {
    let data = object[valueKey];
    if(data === undefined) {
        return true;
    }

    if(typeof data === 'string') {
        if(isValidObject(settings, data)){
            return true;
        }

        settings.logError(" unknown Object in mod block: " + data);
        return false;
    }

    if(data.length !== undefined){
        for(let i = 0; i < data.length; i++) {
            if(!validateModificationBlock(settings, data, i)){
                return false;
            }
        }

        return true;
    }

    settings.results.addStat('Val_ResBlock');
    for(let key in data) {
        // Special cases
        switch (key) {
            case 'id':
            case 'name':
            case 'type':
            case 'rate':
            case 'max':{
                settings.logError(valueKey + '.' +key + " is not a mod block");
                return false;
            }

            case 'dot': {
                if(!validateAttackBlock(settings, data[key])) {
                    settings.logError(" dot sub-block was invalid");
                }
                continue
            }
        }

        if(isValidObject(settings, key)){
            continue;
        }

        if (isModString(settings, key)){
            continue;
        }

        let keyParts = key.split('.');
        if(keyParts.length > 1) {
            let modContext = keyParts[0];
            keyParts.shift();
            let modSubPart = keyParts.join(".");

            if(isModString(settings, modContext) && isModString(settings, modSubPart)) {
                // This is a context + mod action
                continue;
            }
        }

        //console.log(data);
        settings.logError(valueKey + "." + key + " unknown mod");
        return false;
    }

    return true;
}

function tagExists(settings, tag) {
    settings.results.addStat('Val_Tag');
    let trimmedTag = tag.toLowerCase().trim();
    let tagSource = settings.data.lookups.metaTags[trimmedTag];
    if(tagSource !== undefined){
        return true;
    }

    return false;
}

function validateFormula(settings, value, verbose){
    if(typeof value !== 'string'){
        throw " not a formula value: " + value;
    }

    let result = value.match(RequireRegex);
    if(result === null) {
        if(isValidFormulaValue(settings, value) !== true) {
            if(verbose !== false) {
                settings.logError(" Unknown formula target: " + value);
            }

            return false;
        }
    } else {
        for(let n = 0; n < result.length; n++){
            if(isValidFormulaValue(settings, result[n]) !== true) {
                settings.logError(" Unknown target in formula: " + result[n] + "  >  `" + value + "`");
                return false;
            }
        }
    }

    return true;
}

function isValidFormulaValue(settings, value) {
    settings.results.addStat('Val_Require');
    value = value.replace("g.", "");
    switch (value) {
        case 'player': {
            return true;
        }
    }

    let modTarget = settings.data.lookups.modStrings[value];
    if(modTarget !== undefined) {
        return true;
    }

    if(isValidObject(settings, value)){
        return true;
    }

    return false;
}

function isValidObject(settings, value) {
    settings.results.addStat('Val_Obj');

    let objectTarget = settings.data.lookups.objects[value];
    if(objectTarget !== undefined){
        return true;
    }

    if(isObjectType(settings, value)){
        return true;
    }

    if(tagExists(settings, value)) {
        return true;
    }

    if(isValidFlag(settings, value)){
        return true;
    }

    if(isValidElement(settings, value)) {
        return true;
    }

    if(isValidBiome(settings, value)) {
        return true;
    }

    return false;
}

function validateObjectTarget(settings, values, fieldName) {
    if(values === undefined) {
        return true;
    }

    if(typeof values === 'string') {
        if(isValidObject(settings, values)){
            return true;
        }

        settings.logError(fieldName + " is not a valid object value: " + values);
        return false;
    }

    if(values.length === undefined){
        return false;
    }

    settings.results.addStat('Val_ObjArray');
    for(let i = 0; i < values.length; i++){
        let value = values[i];
        switch (typeof value) {
            case 'string': {
                if(isValidObject(settings, value)){
                    return true;
                }

                if(validateFormula(settings, value, false)){
                    return true;
                }

                break;
            }

            case 'object': {
                if(value.length !== undefined) {
                    let success = true;
                    for(let n = 0; n < value.length; n++) {
                        if(!validateObjectTarget(settings, value[n], fieldName)){
                            success = false;
                            break;
                        }
                    }

                    if(success === true) {
                        return true;
                    }

                    break;
                }
            }
        }

        settings.logError(fieldName + " Unknown Object Target " + value)
    }

    return false;
}

function isObjectType(settings, value) {
    settings.results.addStat('Val_ObjType');
    for(let key in valData.DataType){
        let id = valData.DataType[key].id;
        if(value === id){
            return true;
        }
    }

    return false;
}

function isValidTarget(settings, value) {
    settings.results.addStat('Val_Target');
    for(let i = 0; i < valData.Targets.length; i++){
        let target = valData.Targets[i];
        if(value === target){
            return true;
        }
    }

    return false;
}

function isValidFlag(settings, value) {
    settings.results.addStat('Val_Flag');
    for(let i = 0; i < valData.Flags.length; i++){
        let flag = valData.Flags[i];
        if(value === flag){
            return true;
        }
    }

    return false;
}

function isValidElement(settings, value) {
    settings.results.addStat('Val_Element');
    for(let i = 0; i < valData.Elements.length; i++){
        let element = valData.Elements[i];
        if(value === element){
            return true;
        }
    }

    return false;
}

function isValidBiome(settings, value) {
    settings.results.addStat('Val_Biome');
    for(let i = 0; i < valData.Biomes.length; i++){
        let biome = valData.Biomes[i];
        if(value === biome){
            return true;
        }
    }

    return false;
}

function validateLootBlock(settings, value) {
    settings.results.addStat('Val_LootBlock');
    for(let property in value) {
        let propertyValue = value[property];

        if(isValidObject(settings, property)){
            continue;
        }

        switch (property) {
            case 'material':
            case 'type': {
                if(!isValidObject(settings, propertyValue)){
                    settings.logError(" loot " + property + " is invalid: " + propertyValue);
                    return false;
                }

                break;
            }

            case 'name':
            case 'id': {
                break;
            }

            case '%':
            case 'body':
            case 'maxlevel':
            case 'max': {
                let value = validateStat.validateOne(settings, propertyValue);
                if(value === undefined) {
                    settings.logError(" Loot block has invalid property value for " + property + ": " + propertyValue);
                    return false;
                }

                break;
            }

            case 'attack': {
                if(!validateAttackBlock(settings, propertyValue)){
                    settings.logError(property + " attack block was invalid");
                    return false;
                }

                break;
            }

            default: {
                settings.logError(" Unhandled Loot block property: " + property);
                return false;
            }
        }
    }

    return true;
}

function validateChoiceBlock(settings, value) {
    settings.results.addStat('Val_ChoiceBlock');
    for(let property in value) {
        let propertyValue = value[property];

        switch (property) {
            case 'mod': {
                settings.logWarning(" Ignoring Choice mod section for now");
                break;
            }

            case 'target': {
                if(isValidObject[propertyValue]){
                    settings.logError(" Choice block " + property + " is not known " + propertyValue);
                    return false;
                }

                break;
            }

            default: {
                console.log(value);
                console.log(propertyValue);
                throw " Unhandled Choice block property: " + property;
            }
        }
    }

    return true;
}

function validateAttackBlock(settings, value) {
    if(typeof value !== 'object') {
        if(isValidObject(settings, value)) {
            return;
        }

        settings.logError(" Invalid Attack block data: " + value);
        return false;
    }

    if(value.length !== undefined) {
        for(let i = 0; i < value.length; i++){
            if(!validateAttackBlock(settings, value[i])){
                return false;
            }
        }

        return true;
    }

    settings.results.addStat('Val_AttackBlock');
    for(let property in value) {
        let propertyValue = value[property];

        if(property.startsWith('resist.')){
            let damageParsed = validateStat.validateOne(settings, propertyValue);
            if(damageParsed === undefined) {
                settings.logError(" Attack block has invalid property value for " + property + ": " + propertyValue);
                return false;
            }

            continue;
        }

        switch (property) {
            case 'adj':
            case 'log':
            case 'name': {
                // ignore these
                break;
            }

            case 'stamina':
            case 'mana':
            case 'bonus':
            case 'hp':
            case 'nomiss':
            case 'nodefense':
            case 'tohit':
            case 'leech':
            case '%':
            case 'duration':
            case 'dmg':
            case 'damage': {
                let damageParsed = validateStat.validateOne(settings, propertyValue);
                if(damageParsed === undefined) {
                    settings.logError(" Attack block has invalid property value for " + property + ": " + propertyValue);
                    return false;
                }

                switch (damageParsed[1]) {
                    case valData.StatType.String: {
                        // For now won't try to parse this
                        // settings.logWarning(" Attack block value for " + property + " is formula: " + propertyValue);
                        break;
                    }

                    case valData.StatType.Object: {
                        settings.logWarning(" Attack block value for " + property + " is of object type");
                        break;
                    }
                }

                break;
            }

            case 'harmless': {
                switch(typeof propertyValue) {
                    case 'string': {
                        let temp = propertyValue.toLowerCase().trim();
                        if(temp === "true") {
                            settings.logWarning(property + " is boolean type but serialized as string");
                            return false;
                        }

                        if(temp === "false") {
                            settings.logWarning(property + " is boolean type but serialized as string");
                            return false;
                        }

                        break;
                    }

                    case 'boolean': {
                        return true;
                    }
                }

                settings.logError(property + " value is invalid: " + propertyValue + ' (' + typeof propertyValue + ')');
                return false;
            }

            case 'id':
            case 'type':
            case 'kind': {
                if(isValidObject[propertyValue]){
                    settings.logError(" Attack block " + property + " is not known " + propertyValue);
                    return false;
                }

                break;
            }

            case 'dot': {
                if(!validateAttackBlock(settings, propertyValue)){
                    settings.logError("dot sub-block was invalid");
                    return false;
                }

                break;
            }

            case 'targets': {
                if(!isValidTarget(settings, propertyValue)){
                    settings.logError(" Invalid target value: " + propertyValue);
                }

                break;
            }

            case 'effect':
            case 'result':
            case 'mod': {
                if(!validateModificationBlock(settings, value, property)){
                    settings.logError(" Attack block " + property + " section was invalid");
                    return false;
                }

                break;
            }

            case 'hits': {
                if(!validateAttackBlock(settings, propertyValue)){
                    return false;
                }

                break;
            }

            case 'flags': {
                if(!isValidFlag(settings, propertyValue)){
                    settings.logError(" Invalid Flag value: " + propertyValue);
                }

                break;
            }

            default: {
                console.log(value);
                console.log(propertyValue);
                throw " Unhandled Attack block property: " + property;
            }
        }
    }

    return true;
}

exports.validateSecondPass = function(settings, object, key) {
    switch (key) {
        // resource modifying block data
        case 'cost':
        case 'run':
        case 'buy':
        case 'result':
        case 'once':
        case 'effect':
        case 'resist':
        case 'mod': {
            validateModificationBlock(settings, object, key);
            break;
        }

        case 'tags': {
            let tags = object[key];
            for(let i = 0; i < tags.length; i++){
                if(!tagExists(settings, tags[i])) {
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
                        validateFormula(settings, values[i]);
                        break;
                    }

                    case 'object': {
                        settings.logWarning(" Require data is Object format");

                        for(let key in values[i]) {
                            validateModificationBlock(settings, values[i], key);
                        }

                        break;
                    }
                }

            }

            break;
        }

        case 'lock':
        case 'disable':
        case 'need':
        case 'type':
        case 'material':
        case 'only':
        case 'encs':
        case 'boss':
        case 'biome':
        case 'flags':
        case 'immune':
        case 'spells':
        case 'spawns':
        case 'exclude': {
            validateObjectTarget(settings, object[key], key);
            break;
        }

        case 'use': {
            let value = object[key];
            if(typeof value === 'string' || value.length !== undefined) {
                validateObjectTarget(settings, value, key);
            } else if (typeof value === 'object') {
                validateModificationBlock(settings, object, key);
            } else {
                throw "Unknown use data: " + value;
            }

            break;
        }

        case 'dot':
        case 'attack': {
            if(!validateAttackBlock(settings, object[key])) {
                settings.logError(key + " attack block was invalid");
            }

            break;
        }

        case 'choice': {
            validateChoiceBlock(settings, object[key]);
            break;
        }

        case 'every':
        case 'at': {
            for(let time in object[key]) {
                validateModificationBlock(settings, object[key], time);
            }

            break;
        }

        case 'loot': {
            if(!validateLootBlock(settings, object[key])) {
                return false;
            }

            break;
        }

        case 'show':
        case 'action': {
            settings.logWarning(key + " not currently handled");
            break;
        }

        default: {
            console.log(object[key]);
            throw "Unhandled property in second pass: " + key;
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
                    let statData = validateStat.validateOne(settings, propertyData);
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
        case 'silent':
        case 'secret':
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
        case 'show':
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
        case 'group':
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