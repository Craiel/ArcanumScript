// Quickslots
(function($) {
    'use strict';

    class AEQuickSlots {
        constructor() {
            this.suspendAutomation = false;
            this.target = [];
            this.cooldown = [];
        }

        load() {
            let slotId = 0;

            this.resetCooldown();

            $(".quickslot").each(function() {
                let inputRoot = $('<div id="at_qs_div_' + slotId +'" style="position:absolute; bottom:0px; left:0px; width:100%; opacity:0.75;height:20px;">');

                let input = $('<input id="at_qs_' + slotId +'" type="text" class="timeset" style="position: absolute; bottom: 0px; left: 0px; width:100%; font-weight:bold; opacity:0.75; text-align:center;">');
                inputRoot.append(input);

                input.change({id: slotId}, function(data) {
                    let newValue = parseFloat($(this).val());
                    if(isNaN(newValue) || newValue === undefined || newValue === null) {
                        newValue = undefined;
                    } else {
                        newValue = newValue * 1000;
                    }

                    AE.log("Setting QS " + data.data.id + " Time to " + newValue + " ms");

                    AE.settings.data.quickSlotTimes[data.data.id] = newValue;
                    AE.settings.save();
                });

                AE.quickSlots.target[slotId] = $(this);

                let enableCheck = $('<input id="at_qs_e_' + slotId +'" type="checkbox" style="position: absolute; bottom: 0px; right: -5px; width:20px; opacity:0.75;">');
                enableCheck.change({id: slotId}, function(data) {
                    AE.settings.data.quickSlotEnabled[data.data.id] = !AE.settings.data.quickSlotEnabled[data.data.id];
                    AE.settings.save();
                });

                inputRoot.append(enableCheck);

                $(this).append(inputRoot);

                slotId++;
            });

            let parent = $('div.quickbar');
            let buttonArea = $('<div id"at_qs_btn_area" style="margin-left: auto; display: flex; flex-direction: row;">');

            for(let i = 0; i < AE.config.quickSlotPresetCount; i++) {
                let presetArea = $('<div id="at_qs_preset' + i + '" style="display: flex; flex-direction: column; margin-right: 15px;">');
                buttonArea.append(presetArea);

                let header = $('<input id="at_qs_preset_name_' + i + '" type="text" class="timeset" style="width: 80px; font-weight:bold; text-align:center;"></input>');
                header.change({id: i}, function(data) {
                    if(AE.settings.data.quickSlotPresetNames === undefined) {
                        AE.settings.data.quickSlotPresetNames = {};
                    }

                    AE.settings.data.quickSlotPresetNames[data.data.id] = $(this).val();
                    AE.settings.save();
                });

                presetArea.append(header);

                let saveBtn = $('<button id="at_qs_presetbtn_save"' + i + '>Save</button>');
                saveBtn.click({id: i}, function(data){
                    AE.quickSlots.savePreset(data.data.id);
                });

                presetArea.append(saveBtn);

                let loadBtn = $('<button id="at_qs_presetbtn_load"' + i + '>Load</button>');
                loadBtn.click({id: i}, function(data) {
                    AE.quickSlots.loadPreset(data.data.id);
                });

                presetArea.append(loadBtn);
            }

            let suspendButton = $('<button id="at_qs_suspend" style="margin-left: auto;">Suspend</button>');
            suspendButton.click(function() {
                AE.quickSlots.suspendAutomation = !AE.quickSlots.suspendAutomation;
                AE.log("Quickslot Disabled: " + AE.quickSlots.suspendAutomation);
                $(this).text(AE.quickSlots.suspendAutomation === true ? "Resume" : "Suspend");
                AE.quickSlots.resetCooldown();
            });

            buttonArea.append(suspendButton);
            parent.append(buttonArea);

            this.updateDisplay();
        }

        resetCooldown() {
            for(let i = 0; i < AE.config.quickSlotCount; i++) {
                this.cooldown[i] = 0;
            }
        }

        savePreset(id) {
            if(AE.settings.data.quickSlotPresets === undefined) {
                AE.settings.data.quickSlotPresets = {};
            }

            AE.settings.data.quickSlotPresets[id] = JSON.stringify({
                n: AE.settings.data.quickSlotPresetNames[id],
                t: AE.settings.data.quickSlotTimes,
                e: AE.settings.data.quickSlotEnabled
            });

            AE.log("Saving Preset " + id);

            AE.settings.save();
        }

        loadPreset(id) {
            if(AE.settings.data.quickSlotPresets === undefined) {
                return;
            }

            let data = AE.settings.data.quickSlotPresets[id];
            if(data === undefined) {
                return;
            }

            let preset = JSON.parse(data);
            if(preset === undefined) {
                return;
            }

            AE.log("Loading Preset " + id);
            if(preset.n !== undefined) {
                AE.settings.data.quickSlotPresetNames[id] = preset.n;
            }

            if(preset.t !== undefined && preset.t.length === AE.settings.data.quickSlotTimes.length) {
                for(let i = 0; i < preset.t.length; i++) {
                    if(preset.t[i] === null) {
                        preset.t[i] = undefined;
                    }
                }

                AE.settings.data.quickSlotTimes = preset.t;
            }

            if(preset.e !== undefined && preset.e.length === AE.settings.data.quickSlotEnabled.length) {
                AE.settings.data.quickSlotEnabled = preset.e;
            }

            AE.settings.save();
            this.updateDisplay();
        }

        updateDisplay() {
            for(let i = 0; i < AE.config.quickSlotCount; i++){
                let el = $('#at_qs_' + i);
                let elEnabled = $('#at_qs_e_' + i);
                let time = AE.settings.data.quickSlotTimes[i];
                let enabled = AE.settings.data.quickSlotEnabled[i];
                if(time === undefined){
                    el.val("");
                } else {
                    el.val(time / 1000);
                }

                elEnabled.prop('checked', enabled);
            }

            for(let i = 0; i < AE.config.quickSlotPresetCount; i++) {
                let el = $('#at_qs_preset_name_' + i);
                if(AE.settings.data.quickSlotPresetNames !== undefined && AE.settings.data.quickSlotPresetNames[i] !== undefined){
                    el.val(AE.settings.data.quickSlotPresetNames[i]);
                } else {
                    el.val("Preset " + (i + 1));
                }
            }
        }

        update(delta) {
            if(this.suspendAutomation === true) {
                return;
            }

            for(let i = 0; i < AE.config.quickSlotCount; i++){
                let target = this.target[i];
                let time = AE.settings.data.quickSlotTimes[i];
                let enabled = AE.settings.data.quickSlotEnabled[i];
                if (target === undefined || time === undefined ||enabled === false) {
                    continue;
                }

                let clickTarget = target.find('div');
                this.cooldown[i] -= delta;
                if(this.cooldown[i] < 0){
                    clickTarget[0].click();
                    this.cooldown[i] = time;
                }
            }
        }
    }

    AE.quickSlots = new AEQuickSlots();

})(window.jQuery);