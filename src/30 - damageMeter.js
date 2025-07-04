// Damage Meter
(function($) {
    'use strict';

    const DamageMeterHTML = `
    <div id="at_dmg_meter" style="height: 200px;">
        <div id="at_dmg_meter_header" style="background-color: lightgrey; display: flex;">
            <span id="at_dmg_meter_header_title" style="margin-top: 6px">Damage</span>
            <div style="margin-left: auto;">
                <button id="at_dmg_meter_change_mode">M</button>
                <button id="at_dmg_meter_reset">R</button>
            </div>            
        </div>
        <table id="at_dmg_meter_values" style="width: 100%">
            <thead>
                <tr style="display: block">
                    <th style="width: 80px">Name</th>
                    <th style="width: 70px">Value</th>
                    <th>/s</th>
                </tr>            
            </thead>
            <tbody style="display:block;overflow:auto;height:130px;width:100%;">
                            
            </tbody>
        </table>
    </div>
    `;

    const DamageMeterEntry = `
    <tr id="at_dmg_meter_entry_{{id}}">
        <td >{{name}}</td>
        <td style="width: 50px">{{damage}}</td>
        <td style="width: 50px">{{dps}}</td>
    </tr>
    `;

    const DamageMeterMode = {
        Default: 0,
        DamageDoneBySource: 1,
        DamageTakenBySource: 2,
        OtherFriend: 3,
        OtherFoe: 4
    };

    const CombatHitRegex = /(.*)\shits\s(strongly )*(.*?):\s*([0-9\.]+)\s*(\(absorb: ([0-9\.]+)%\))*/i;
    const CombatHitRegex2 = /(.+?)\s+hits\s+(.+?)\s+for\s+(\d+\.?\d*)\s+damage/i;
    const CombatParryRegex = /(.*)\s(parries|dodges)\s(.*)/i;
    const CombatLifeStealRegex = /(.*)\ssteals\s([0-9\.]+)\slife/i;

    class AEDamageMeter {
        constructor() {
            this.combatStats = {};
            this.mode = DamageMeterMode.Default;
            this.lastCombatLogLine = undefined;
            this.hasChanged = true;
        }

        load() {
            this.resetCombatStats();

            let parent = $('div.log-view');

            let panel = $(DamageMeterHTML);
            parent.append(panel);

            $('#at_dmg_meter_change_mode').click(this.toggleMode.bind(this));
            $('#at_dmg_meter_reset').click(this.resetCombatStats.bind(this));
        }

        hide(){
            let meter = $('#at_dmg_meter');
            if(meter.length === 0){
                return;
            }

            meter.hide();
        }

        updateUI(delta) {
            // Only show in adventure tab
            let root = $('div.adventure');
            if(root.length === 0){
                this.hide();
                return;
            }

            if(this.hasChanged === false) {
                return;
            }

            let meter = $('#at_dmg_meter');
            if(meter.length === 0){
                return;
            }

            this.hasChanged = false;
            meter.show();

            switch (this.mode) {
                case DamageMeterMode.Default:
                {
                    this.refreshValuesSource(this.combatStats.damage);
                    break;
                }

                case DamageMeterMode.DamageDoneBySource: {
                    this.refreshValuesSource(this.combatStats.damageDoneBySource);
                    break;
                }

                case DamageMeterMode.DamageTakenBySource: {
                    this.refreshValuesSource(this.combatStats.damageTakenBySource);
                    break;
                }

                case DamageMeterMode.OtherFriend: {
                    this.refreshValuesSource(this.combatStats.otherFriend);
                    break;
                }

                case DamageMeterMode.OtherFoe: {
                    this.refreshValuesSource(this.combatStats.otherFoe);
                    break;
                }
            }
        }

        update(delta) {
            let meter = $('#at_dmg_meter');
            if(meter.length === 0){
                return;
            }

            this.parseCombatants();
            this.parseCombatLog();

            this.combatStats.combatTime += delta / 1000;
        }

        refreshValuesSource(sourceData){
            let meterValues= $('#at_dmg_meter_values').find('tbody');
            meterValues.empty();

            let sortedDamage = [];
            for(let source in sourceData) {
                sortedDamage.push([source, sourceData[source]]);
            }

            sortedDamage.sort(function(a, b) {
                return b[1] - a[1];
            });

            for(let i = 0; i < sortedDamage.length; i++) {
                let entry = sortedDamage[i];
                let damageValue = sourceData[entry[0]];
                let dps = damageValue / this.combatStats.combatTime;
                let templateValues = {
                    id: entry[0].replace(" ", ""),
                    name: entry[0],
                    damage: Math.floor(damageValue),
                    dps: dps.toFixed(2)
                };

                let entrySelf = $(AE.utils.processTemplate(DamageMeterEntry, templateValues));
                meterValues.append(entrySelf);
            }
        }

        syncCombatants(target, source) {
            let result = false;
            for(let i = 0; i < source.length; i++) {
                let name = source[i];
                if(target[name] === undefined){
                    target[name] = 0;
                    result = true;
                }
            }

            return result;
        }

        parseCombatants() {
            let combatRoot = $('div.combat');
            if(combatRoot.length === 0) {
                return;
            }

            let groups = combatRoot.find('div.npc-group');
            if(groups.length !== 2) {
                return;
            }

            // friends are first group
            let npcNames = [];
            $(groups[0]).find('span.name-span').each(function() {
                let name = $(this).children()[0].innerText.trim();
                if(name === ""){
                    return;
                }

                npcNames.push(name);
            });

            if(this.syncCombatants(this.combatStats.friend, npcNames) === true) {
                this.hasChanged = true;
            }

            npcNames = [];
            $(groups[1]).find('span.name-span').each(function() {
                let name = $(this).children()[0].innerText.trim();
                if(name === "") {
                    return;
                }

                npcNames.push(name);
            });

            if(this.syncCombatants(this.combatStats.foe, npcNames) === true) {
                this.hasChanged = true;
            }
        }

        parseCombatLog() {
            let log = $('div.raid-bottom').find('div.outlog');
            if(log.length === 0) {
                return;
            }

            let combatLogUpToDate = false;
            let newCombatLogLines = [];
            log.find('div.log-item').each(function() {
                if(combatLogUpToDate === true) {
                    return;
                }

                if($(this).find('span.log-title').length > 0){
                    return;
                }

                let line = $(this).find('span.log-text').text();
                if(AE.damageMeter.lastCombatLogLine !== undefined && line === AE.damageMeter.lastCombatLogLine) {
                    // Consider this the end of the current log section
                    combatLogUpToDate = true;
                    return;
                }

                newCombatLogLines.push(line);
            });

            if(newCombatLogLines.length === 0) {
                return;
            }

            for(let i = 0; i < newCombatLogLines.length; i++){
                if(this.parseCombatLogLine(newCombatLogLines[i]) === true) {
                    this.hasChanged = true;
                }
            }

            AE.damageMeter.lastCombatLogLine = newCombatLogLines[0];
        }

        toggleMode(){
            switch (this.mode) {
                case DamageMeterMode.Default:
                {
                    $('#at_dmg_meter_header_title').text("Damage by Spell");
                    this.mode = DamageMeterMode.DamageDoneBySource;
                    break;
                }

                case DamageMeterMode.DamageDoneBySource:
                {
                    $('#at_dmg_meter_header_title').text("Received by Source");
                    this.mode = DamageMeterMode.DamageTakenBySource;
                    break;
                }

                case DamageMeterMode.DamageTakenBySource:
                {
                    $('#at_dmg_meter_header_title').text("Other (You)");
                    this.mode = DamageMeterMode.OtherFriend;
                    break;
                }

                case DamageMeterMode.OtherFriend:
                {
                    $('#at_dmg_meter_header_title').text("Other (Enemy)");
                    this.mode = DamageMeterMode.OtherFoe;
                    break;
                }

                case DamageMeterMode.OtherFoe:
                {
                    $('#at_dmg_meter_header_title').text("Damage");
                    this.mode = DamageMeterMode.Default;
                    break;
                }
            }

            this.update(0);
        }

        resetCombatStats() {
            this.combatStats = {
                damage: {
                    dealt: 0,
                    received: 0
                },
                combatTime: 0,
                friend: {},
                foe: {},
                damageDoneBySource: {},
                damageTakenBySource: {},
                otherFriend: {},
                otherFoe: {},
                unhandledLines: []
            };

            this.update(0);
        }

        combatRegisterDamageTaken(id, value) {
            if(this.combatStats.damageTakenBySource[id] === undefined) {
                this.combatStats.damageTakenBySource[id] = 0;
            }

            this.combatStats.damageTakenBySource[id] += value;
        }

        combatRegisterDamageDone(id, value) {
            if(this.combatStats.damageDoneBySource[id] === undefined) {
                this.combatStats.damageDoneBySource[id] = 0;
            }

            this.combatStats.damageDoneBySource[id] += value;
        }

        combatRegisterOtherFriendly(id, value = 1) {
            if(this.combatStats.otherFriend[id] === undefined) {
                this.combatStats.otherFriend[id] = 0;
            }

            this.combatStats.otherFriend[id] += value;
        }

        combatRegisterOtherFoe(id, value = 1) {
            if(this.combatStats.otherFoe[id] === undefined) {
                this.combatStats.otherFoe[id] = 0;
            }

            this.combatStats.otherFoe[id] += value;
        }

        parseCombatLogLineHit(line){
            let hitResult = CombatHitRegex.exec(line);
            if(hitResult !== null) {
                let result = {};
                result.source = hitResult[1].trim();
                result.strongHit = hitResult[2] !== undefined;
                result.target = hitResult[3].trim();
                result.dmg = parseFloat(hitResult[4]);

                if(hitResult[6] !== undefined) {
                    result.absorb = parseFloat(hitResult[6]);
                } else {
                    result.absorb = undefined;
                }

                return result;
            }

            hitResult = CombatHitRegex2.exec(line);
            if(hitResult !== null) {
                let result = {};
                result.source = hitResult[1].trim();
                result.strongHit = false;
                result.target = hitResult[2].trim();
                result.dmg = parseFloat(hitResult[3]);

                result.absorb = undefined;

                return result;
            }

            return null;
        }

        parseCombatLogLine(line) {
            if(line === "") {
                return false;
            }

            let lineStats = {
                ln: line,
                f: Object.keys(this.combatStats.foe)
            };

            let hitResult = this.parseCombatLogLineHit(line);
            if(hitResult !== null) {
                lineStats.hit = true;

                let handled = false;
                for(let name in this.combatStats.friend) {
                    if (name === hitResult.target) {
                        this.combatStats.damage.received += hitResult.dmg;

                        this.combatRegisterDamageTaken(hitResult.source, hitResult.dmg);
                        if(hitResult.strongHit === true) {
                            this.combatRegisterOtherFoe("crits");
                        }

                        if(hitResult.absorb !== undefined){
                            this.combatRegisterOtherFriendly("absorb", hitResult.absorb);
                        }

                        handled = true;
                    }
                }

                for(let name in this.combatStats.foe) {
                    if(name === hitResult.target) {
                        this.combatStats.damage.dealt += hitResult.dmg;

                        this.combatRegisterDamageDone(hitResult.source, hitResult.dmg);
                        if(hitResult.strongHit === true) {
                            this.combatRegisterOtherFriendly("crits");
                        }

                        if(hitResult.absorb !== undefined){
                            this.combatRegisterOtherFoe("absorb", hitResult.absorb);
                        }

                        handled = true;
                    }
                }

                if(handled === true) {
                    return true;
                }
            }

            let parryResult = CombatParryRegex.exec(line);
            if(parryResult !== null) {
                lineStats.parry = true;

                let source = parryResult[1].trim();
                let what = parryResult[2].trim();
                let target = parryResult[3].trim();
                let handled = false;
                for(let name in this.combatStats.friend) {
                    if (name === source) {
                        this.combatRegisterOtherFriendly(what);
                        handled = true;
                    }
                }

                for(let name in this.combatStats.foe) {
                    if(name === source) {
                        this.combatRegisterOtherFoe(what);
                        handled = true;
                    }
                }

                if(handled === true) {
                    return true;
                }
            }

            let lifeStealResult = CombatLifeStealRegex.exec(line);
            if(lifeStealResult !== null) {
                lineStats.leech = true;

                let source = lifeStealResult[1].trim();
                let amount = parseFloat(lifeStealResult[2].trim());

                let handled = false;
                for(let name in this.combatStats.friend) {
                    if (name === source) {
                        this.combatStats.damage.dealt += amount;
                        this.combatRegisterDamageDone("lifesteal", amount);
                        handled = true;
                    }
                }

                for(let name in this.combatStats.foe) {
                    if(name === source) {
                        this.combatStats.damage.received += amount;
                        this.combatRegisterDamageTaken("lifesteel", amount);
                        handled = true;
                    }
                }

                if(handled === true) {
                    return true;
                }
            }

            if(AE.config.enableDebugMode === true) {
                this.combatStats.unhandledLines.push(lineStats);
            }

            return false;
        }
    }

    AE.damageMeter = new AEDamageMeter();

})(window.jQuery);