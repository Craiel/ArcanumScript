exports.validate = function(settings, loot) {

    let result = {};

    switch (typeof loot) {
        case 'string': {
            result[loot] = 1;
            break;
        }

        case 'object': {
            if(loot.length === undefined) {
                for(let item in loot) {
                    result[item] = loot[item];
                }
            } else {
                for(let i = 0; i < loot.length; i++){
                    result[loot[i]] = 1;
                }
            }

            break;
        }

        default: {
            throw "Invalid loot format: " + loot + " " + typeof loot;
        }
    }

    return result;
};