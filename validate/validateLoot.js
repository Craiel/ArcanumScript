exports.validate = function(settings, loot) {

    let result = {};

    for(let item in loot) {
        result[item] = loot[item];
    }

    return result;
};