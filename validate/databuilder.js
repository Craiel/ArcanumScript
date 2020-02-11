const fs = require("fs");

function formatEnchantMod(data) {
    if(data === undefined) {
        return {};
    }

    let result = {};
    for(let idRaw in data) {
        let id = idRaw.replace('mod.', '').split('.');
        let value = data[idRaw][0];
        switch (id.length) {
            case 1: {
                result[id[0]] = value;
                break;
            }

            case 2: {
                if(result[id[0]] === undefined) {
                    result[id[0]] = {};
                }

                result[id[0]][id[1]] = value;
                break;
            }

            default: {
                throw "Unhandled Enchant mod: " + idRaw;
            }
        }
    }

    return result;
}

function buildResources(source, target){
    if(source === undefined) {
        return;
    }

    for(let key in source) {
        let resourceData = source[key];
        let outData = {
            max: resourceData.max,
            name: resourceData.name
        };

        target.ResourceData[resourceData.id] = outData;
    }
}

function buildPotions(source, target) {
    if(source === undefined) {
        return;
    }

    for(let key in source) {
        let potionData = source[key];
        let outData = {
            name: potionData.name
        };

        target.PotionData[potionData.id] = outData;
    }
}

function buildEnchantData(source, target) {
    if(source === undefined) {
        return;
    }

    for(let key in source) {
        let enchantData = source[key];

        if(enchantData.adj !== undefined) {
            target.EnchantItemNotations.push(enchantData.adj);
        }

        let outData = {
            level: enchantData.level,
            name: enchantData.name,
            target: enchantData.only,
            mods: formatEnchantMod(enchantData.mod)
        };

        target.EnchantData[enchantData.id] = outData;
        target.EnchantNameLookup[enchantData.name.toLowerCase()] = enchantData.id;
    }
}

function buildMaterialData(source, target) {
    if(source === undefined) {
        return;
    }

    for(let key in source) {
        let materialData = source[key];
        let outData = {
            level: materialData.level
        };

        target.MaterialData[materialData.id] = outData;
    }
}

function buildHomeData(source, target){
    if(source === undefined) {
        return;
    }

    for(let key in source) {
        let homeData = source[key];
        let outData = {
            name: homeData.name,
            size: homeData.mod['space.max'][0]
        };

        if(outData.name === undefined) {
            outData.name = homeData.id;
        }

        target.HomeNameLookup[outData.name.toLowerCase()] = homeData.id;
        target.HomeData[homeData.id] = outData;
    }
}

function buildUpgradeData(source, target) {
    if(source === undefined) {
        return
    }

    for(let key in source) {
        let upgradeData = source[key];
        if(upgradeData.slot === "mount") {
            let mountData = {
                name: upgradeData.name,
                distance: upgradeData.mod.dist[0]
            };

            if(mountData.name === undefined) {
                mountData.name = upgradeData.id;
            }

            target.MountNameLookup[mountData.name.toLowerCase()] = upgradeData.id;
            target.MountData[upgradeData.id] = mountData;
        }
    }
}

exports.build = function(data) {
    let result = {
        ResourceData: {},
        PotionData: {},
        EnchantItemNotations: [],
        EnchantNameLookup: {},
        EnchantData: {},
        MaterialData: {},
        HomeData: {},
        HomeNameLookup: {},
        MountData: {},
        MountNameLookup: {}
    };

    buildResources(data.resources, result);
    buildPotions(data.potions, result);
    buildEnchantData(data.enchants, result);
    buildMaterialData(data.materials, result);
    buildHomeData(data.homes, result);
    buildUpgradeData(data.tasks, result);

    let fileData = `// Generated Data
(function($) {
    'use strict';
    
    AE.data.ResourceData = ` + JSON.stringify(result.ResourceData) + `;
    
    AE.data.PotionData = ` + JSON.stringify(result.PotionData) + `;
    
    AE.data.EnchantItemNotations = ` + JSON.stringify(result.EnchantItemNotations) + `;
    AE.data.EnchantNameLookup = ` + JSON.stringify(result.EnchantNameLookup) + `;
    AE.data.EnchantData = ` + JSON.stringify(result.EnchantData) + `;
    
    AE.data.MaterialData = ` + JSON.stringify(result.MaterialData) + `;
    
    AE.data.HomeData = ` + JSON.stringify(result.HomeData) + `;
    AE.data.HomeNameLookup = ` + JSON.stringify(result.HomeNameLookup) + `;
    
    AE.data.MountData = ` + JSON.stringify(result.MountData) + `;
    AE.data.MountNameLookup = ` + JSON.stringify(result.MountNameLookup) + `;
    
})(window.jQuery);
    `;

    // JSON.stringify(data, null, 1)
    fs.writeFileSync('..\\src\\11 - data.generated.js', fileData, 'UTF8');
};