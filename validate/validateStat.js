const StatType = {
    Number: 0,
    Object: 1,
    Boolean: 3,
    Percent: 4,
    Range: 5,
    Exponent: 6,
    String: 7
};

exports.validateOne = function(settings, key, value) {
    switch (typeof value) {
        case 'number':
        {
            return [value, StatType.Number];
        }

        case 'object': {
            return [value, StatType.Object];
        }

        case 'boolean': {
            return [value, StatType.Boolean];
        }

        case 'string': {
            let parsed = value.match(/[0-9]+%/);
            if(parsed !== null) {
                return [parsed[0], StatType.Percent];
            }

            parsed = value.match(/([0-9]+)~([0-9]+)/);
            if(parsed !== null){
                return [[parsed[1], parsed[2]], StatType.Range];
            }

            parsed = value.match(/([0-9]+)\/([0-9]+)/);
            if(parsed !== null){
                return [[parsed[1], parsed[2]], StatType.Exponent];
            }

            return [value, StatType.String];
        }

        default: {
            settings.logError("Unknown stat value type: " + typeof value);
            return undefined;
        }
    }
};

exports.validateBlock = function(settings, statSet) {

    let result = {};

    if(typeof statSet === 'string') {
        this.validateOne(settings, statSet, 1);
    } else {
        for (let key in statSet) {
            let values = this.validateOne(settings, key, statSet[key]);
            if(values === undefined){
                return undefined;
            }

            result[key] = values;
        }
    }

    return result;
};

exports.validateIntervalStats = function(settings, intervalSet) {
    let result = {};

    for(let key in intervalSet) {
        let time = parseInt(key);
        if(time === undefined){
            settings.logError("Interval key is not a valid number");
            continue;
        }

        let value = this.validateBlock(settings, intervalSet[key]);
        if(value === undefined) {
            return undefined;
        }

        result[time] = value;
    }

    return result;
};