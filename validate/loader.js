const fs = require("fs");

function loadJsonFile(settings, file) {
    try {
        let fullFilePath = settings.dataPath + "\\" + file + ".json";
        settings.log(" - " + fullFilePath);
        let raw = fs.readFileSync(fullFilePath, 'utf8');
        return JSON.parse(raw);
    } catch(e) {
        settings.logError(e);
        return undefined;
    }
}


exports.loadData = function(settings) {
    settings.log();
    settings.log("Loading Data");

    let moduleData = loadJsonFile(settings, "modules");
    if(moduleData === undefined) {
        console.error("Missing or invalid Module Data!");
        return false;
    }

    settings.rawdata.hall = loadJsonFile(settings, "hall");
    if(settings.rawdata.hall === undefined) {
        console.error("Missing hall data!");
        return false;
    }

    if(moduleData.core === undefined || moduleData.core.length === 0) {
        console.error("Modules have no core data");
        return false;
    }

    for(let i = 0 ; i < moduleData.core.length; i++) {
        let coreFile = moduleData.core[i];
        settings.rawdata[coreFile] = loadJsonFile(settings, coreFile);
    }

    if(moduleData.modules !== undefined) {
        for(let i = 0; i < moduleData.modules.length; i++) {
            let moduleFile = moduleData.modules[i];
            settings.rawdata['mod_' + moduleFile] = loadJsonFile(settings, "modules\\" + moduleFile);
        }
    }

    return true;
};