@echo off

SET ROOTURL=https://mathiashjelm.gitlab.io/arcanum/data/
echo Downloading data from %ROOTURL%

for %%x in (
	modules.json
        tags.json
        resources.json
        upgrades.json
        tasks.json
        homes.json
        furniture.json
        skills.json
        states.json
        player.json
        spells.json
        monsters.json
        dungeons.json
        clashes.json
        events.json
        classes.json
        armors.json
        weapons.json
        materials.json
        enchants.json
        sections.json
        potions.json
        encounters.json
        locales.json
        stressors.json
        rares.json
        reagents.json
        properties.json
        potencies.json
        hall.json
        glossaryentries.json
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
        reedburgh.json
        extramats.json
        extraaction.json
        legacy_halloween.json
        legacy_winter.json
        timerip.json
        shopkeeping.json
        debitomancy.json
        furniture_upgrades.json
        swordplay.json
        martial.json
        companions.json
        contributors.json
        priest.json
       ) do (
       echo Downloading %ROOTURL%modules/%%x
       curl %ROOTURL%modules/%%x > modules/%%x
       )
       
for %%x in (
        winter.json
	  ) do (
	  echo Downloading %ROOTURL%modules/seasonal/%%x
	  curl %ROOTURL%modules/seasonal/%%x > modules/seasonal/%%x
	  )