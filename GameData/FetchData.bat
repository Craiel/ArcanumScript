@echo off

SET ROOTURL=https://mathiashjelm.gitlab.io/arcanum/data/
echo Downloading data from %ROOTURL%

for %%x in (
        armors.json
        classes.json
        dungeons.json
        enchants.json
        encounters.json
        equip.json
        events.json
        furniture.json
        hall.json
        homes.json
        locales.json
        materials.json
        modules.json
        monsters.json
        places.json
        player.json
        potions.json
        professions.json
        properties.json
        rares.json
        reagents.json
        resources.json
        sections.json
        skills.json
        spells.json
        states.json
        stressors.json
        tasks.json
        upgrades.json
        weapons.json
       ) do (
       echo Downloading %ROOTURL%%%x
       curl %ROOTURL%%%x > %%x
       )

for %%x in (
        patrons.json
        puppeteer.json
        combattutorial.json
        shian.json
        sackmakers.json
        ritualist.json
        extramats.json
        extraaction.json
       ) do (
       echo Downloading %ROOTURL%modules/%%x
       curl %ROOTURL%%%x > modules/%%x
       )