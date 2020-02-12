let validateProperty = require('./validateProperty.js');

exports.secondPass = function(settings, object, type) {
    if(object._secondPassTodo === undefined || object._secondPassTodo.length === 0){
        return;
    }

    settings.contextId = object.id;

    for(let i = 0; i < object._secondPassTodo.length; i++){
        let key = object._secondPassTodo[i];
        validateProperty.validateSecondPass(settings, object, key);
    }

    settings.contextId = undefined;
};

exports.firstPass = function(settings, object, type) {

    let objectId = object.id;
    if(objectId === undefined){
        settings.logError("No valid ID");
        return;
    }

    if(settings.data.objects[type.id] === undefined) {
        settings.data.objects[type.id] = {};
    }

    settings.log("Checking " + objectId);
    if(settings.data.objects[type.id][objectId] !== undefined) {
        settings.logError("Duplicate ID: " + objectId);
        return;
    }

    settings.contextId = objectId;

    let objectData = {
        type: type,
        id: objectId
    };

    if(settings.moduleId !== undefined) {
        objectData.sourceModule = settings.moduleId;
    }

    let isValid = true;
    let objectProperties = Object.keys(object);
    for(let i = 0; i < objectProperties.length; i++) {
        if(validateProperty.validateFirstPass(settings, object, objectData, objectProperties[i]) !== true) {
            isValid = false;
            break
        }
    }

    settings.contextId = undefined;

    if(isValid === false) {
        settings.logError(objectId + " failed to validate");
        return;
    }

    settings.data.objects[type.id][objectId] = objectData;

};