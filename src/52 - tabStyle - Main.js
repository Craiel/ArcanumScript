// Player State
(function($) {
    'use strict';

    const GroupHTML = `
<div id="{{id}}">
    <span style="margin-left: 5px; margin-top: 2px;">{{title}}</span>
    <div id="{{id}}_content" style="margin: 0;padding:var(--md-gap);display:grid;grid-template-columns: repeat( auto-fit, var(--task-button-width) );"/>
</div>`;

    class AETabStyleMain {
        constructor() {
            this.taskButtons = {};
            this.taskButtonOriginalParents = {};
            this.pinnedButtons = {};
            this.activeButtonRoot = undefined;
            this.imbueGemCraftButtonPinned = false;

            this.defaultGroup = 'Unsorted';
            this.upgradeActiveColor = '#ff5757AA';
            this.upgradeInactiveColor = '#feb3b3AA';
            this.classUpgradeInactiveColor = '#8fff57AA';
            this.classUpgradeActiveColor = '#c4ffa6AA';
            this.pinnedColor = '#5698ffAA';
        }

        clearState(){
            this.taskButtons = {};
            this.taskButtonOriginalParents = {};
            this.pinnedButtons = {};
            this.activeButtonRoot = undefined;
            this.imbueGemCraftButtonPinned = false;
        }

        updateUI(delta) {
            if (AE.playerState.activeTab !== AE.data.GameTabs.Main) {
                this.clearState();
                return;
            }

            let topRoot = $('div.main-tasks');
            if(topRoot.length === 0) {
                return;
            }

            this.updateMainTabAlternativeTaskDisplay();
            this.updateMainTabCustomBar();

            this.updateTaskButtonDisplay();
        }

        updateAutomation(delta) {
            let topRoot = $('div.main-tasks');
            if(topRoot.length === 0) {
                return;
            }

            this.updateImbueAllButton();
            this.updatePinnedButtons();
        }

        updateImbueAllButton() {
            let imbueButton = $('#at_imbue_gems_btn');
            if(imbueButton.length === 0) {
                return;
            }

            if(this.imbueGemCraftButtonPinned === true) {
                imbueButton.css('background-color', this.pinnedColor);
                imbueButton.click();
            } else {
                imbueButton.css('background-color', '');
            }
        }

        updatePinnedButtons() {
            for(let key in this.pinnedButtons) {
                if(this.pinnedButtons[key] !== true) {
                    continue;
                }

                let target = this.taskButtons[key];
                if(target === undefined){
                    continue;
                }

                $(target.btn).css('background-color', this.pinnedColor);

                this.clickTaskButton(key);
            }
        }

        updateTaskButtonDisplay() {
            for(let key in this.taskButtons) {
                let button = this.taskButtons[key];
                let buttonEl = $(button.btn);

                // Update the disabled state
                button.isDisabled = buttonEl.prop('disabled');

                if(button.isUpgrade === true) {
                    if(button.isDisabled === false) {
                        buttonEl.css('background-color', this.upgradeInactiveColor);
                    } else {
                        buttonEl.css('background-color', this.upgradeActiveColor);
                    }
                } else if(button.isClassUpgrade === true) {
                    if(button.isDisabled === false) {
                        buttonEl.css('background-color', this.classUpgradeInactiveColor);
                    } else {
                        buttonEl.css('background-color', this.classUpgradeActiveColor);
                    }
                }
            }
        }

        createOptionsToggle(id, title, callback){
            let toggle = $('<span class="opt"></span>');
            let toggleInput = $('<input id="' + id + '" type="checkbox"><label for="' + id + '">' + title + '</label></input>');
            if(AE.settings.data.mainScreenAlternateDisplay === true) {
                toggleInput.prop('checked', true);
            }

            toggle.append(toggleInput);
            toggleInput[0].addEventListener("change", event => {
                callback(event.target.checked);
            }, false);

            return toggleInput;
        }

        onToggleMainBarTaskDisplay(checked) {
            if(AE.settings.data.mainScreenAlternateDisplay !== checked) {
                // Update the settings
                AE.settings.data.mainScreenAlternateDisplay = checked;
                AE.settings.save();
            }

            this.rebuildTaskButtonDisplay();
        }

        rebuildTaskButtonDisplay(){
            let vanillaRoot = $('#vanilla_task_display');
            let alternateDisplayRoot = $('#at_main_alternative_task_display');

            this.refreshTaskButtonState();

            if(AE.settings.data.mainScreenAlternateDisplay === true)
            {
                vanillaRoot.hide();
                alternateDisplayRoot.show();

                this.moveTaskButtonsToGroupedDisplay(alternateDisplayRoot);

                this.activeButtonRoot = alternateDisplayRoot;
                this.createImbueAllButton();

            } else {

                vanillaRoot.show();
                alternateDisplayRoot.hide();

                this.moveTaskButtonsToOriginalParents();

                this.activeButtonRoot = vanillaRoot;
                this.createImbueAllButton();
            }
        }

        createImbueAllButton() {
            let existing = $('#at_imbue_gems');
            if(existing.length !== 0) {
                existing.remove();
            }

            let activeImbueKeys = [];
            for(let key in this.taskButtons) {
                let button = this.taskButtons[key];
                if (button.isLocked === true || button.isRunnable === true){
                    continue;
                }

                if(AE.data.GemImbueTaskIds.includes(key)) {
                    activeImbueKeys.push(key);
                }
            }

            if (activeImbueKeys.length === 0) {
                return false;
            }

            this.imbueGemCraftButtonPinned = false;
            let imbueSpan = $('<span id="at_imbue_gems" class="task-btn hidable"></span>');
            let imbueSpanBtn = $('<button id="at_imbue_gems_btn" class="wrapped-btn">Imbue All Gems</button>')
            imbueSpanBtn.click({keys: activeImbueKeys}, function(event) {
                if(event !== undefined && event.originalEvent !== undefined && event.originalEvent.ctrlKey === true) {
                    AE.tabStyleMain.imbueGemCraftButtonPinned = !AE.tabStyleMain.imbueGemCraftButtonPinned;
                    return;
                }

                for(let i = 0; i < event.data.keys.length; i++){
                    AE.tabStyleMain.clickTaskButton(event.data.keys[i]);
                }
            });

            imbueSpan.append(imbueSpanBtn);

            let button = this.taskButtons[activeImbueKeys[0]].btn;
            $(button).parent().before(imbueSpan);
        }

        clickTaskButton(key) {
            let data = this.taskButtons[key];
            if(data === undefined) {
                return;
            }

            $(data.btn).click();
        }

        moveTaskButtonsToOriginalParents(){
            for(let key in this.taskButtons) {
                let el = $(this.taskButtons[key].btn).parent();
                let parent = this.taskButtonOriginalParents[key];

                // Relocate the button
                el.detach();
                parent.append(el);
            }
        }

        createTaskGroup(id, title) {
            let html = AE.utils.processTemplate(GroupHTML, {
                id: id,
                title: title
            });

            let group = $(html);
            group.hide();

            return group;
        }

        moveTaskButtonsToGroupedDisplay(target) {
            target.empty();

            let groups = {};

            for(let key in this.taskButtons) {
                let data = this.taskButtons[key];
                let el = $(data.btn).parent();
                el.detach();

                let groupName = AE.data.getTaskGroup(key);
                if(groupName === undefined) {
                    console.warn("No Group for " + key);
                    groupName = this.defaultGroup;
                }

                let groupId = 'at_main_alternative_display_group_' + groupName.replace(/[\s\,\.]/g, '').toLowerCase();
                if(groups[groupId] === undefined){
                    groups[groupId] = this.createTaskGroup(groupId, groupName);
                }

                let groupContent = groups[groupId].find('#' + groupId + '_content');
                groupContent.append(el);

                if(data.isLocked !== true) {
                    groups[groupId].show();
                }
            }

            let sortedGroupKeys = Object.keys(groups);
            sortedGroupKeys.sort();

            for(let i = 0; i < sortedGroupKeys.length; i++){
                target.append(groups[sortedGroupKeys[i]]);
            }
        }

        updateMainTabCustomBar() {
            let existing = $('#at_main_top_bar');
            if(existing.length !== 0) {
                return;
            }

            let root = $('div.main-tasks');
            if(root.length === 0) {
                return;
            }

            let bar = $('<div id="at_main_top_bar" class="top separate"></div>');
            let options = $('<span></span>');
            let optionToggleView = this.createOptionsToggle("at_main_task_toggle_view", "Alternative Display", this.onToggleMainBarTaskDisplay.bind(this));
            options.append(optionToggleView);
            bar.append(options);
            let buttons = $('<div></div>');
            let clearPinButton = $('<button>Reset Pinned Buttons</button>');
            clearPinButton[0].addEventListener("click", event => {
                AE.tabStyleMain.resetPinnedButtons();
            }, false);

            buttons.append(clearPinButton);
            bar.append(buttons);
            $(root[0]).prepend(bar);
        }

        resetPinnedButtons() {
            for(let key in this.pinnedButtons) {
                if(this.pinnedButtons[key] !== true) {
                    continue;
                }

                this.pinnedButtons[key] = false;
                $(this.taskButtons[key].btn).css('background-color', '');
            }
        }

        refreshTaskButtonState(){
            AE.tabStyleMain.taskButtons = {};

            if(this.activeButtonRoot === undefined){
                return;
            }

            this.activeButtonRoot.find('span.task-btn').each(function() {
                let el = $(this);
                let dataKey = el.data("key");
                if(dataKey === undefined){
                    return;
                }

                let buttonData = {
                    btn: el.children()[0],
                    isLocked: el.hasClass('locked'),
                    isRunnable: el.hasClass('runnable'),
                    isUpgrade: AE.data.UpgradeTasks.includes(dataKey),
                    isClassUpgrade: AE.data.ClassUpgradeTasks.includes(dataKey)
                };

                AE.tabStyleMain.taskButtons[dataKey] = buttonData;
                if(AE.tabStyleMain.taskButtonOriginalParents[dataKey] === undefined) {
                    AE.tabStyleMain.taskButtonOriginalParents[dataKey] = el.parent();
                }

                if(buttonData.isLocked === false
                    && buttonData.isUpgrade === false
                    && buttonData.isRunnable === false) {
                    // Can pin only single-action buttons for now
                    if (AE.tabStyleMain.pinnedButtons[dataKey] === undefined) {
                        AE.tabStyleMain.pinnedButtons[dataKey] = false;
                        $(buttonData.btn).click({key: dataKey}, AE.tabStyleMain.pinTaskButtonCallback.bind(AE.tabStyleMain));
                    }
                }
            });
        }

        pinTaskButtonCallback(event) {
            if (event !== undefined && event.originalEvent !== undefined && event.originalEvent.ctrlKey === true) {
                let dataKey = event.data.key;
                if(AE.tabStyleMain.pinnedButtons[dataKey] === true) {
                    AE.tabStyleMain.pinnedButtons[dataKey] = false;
                    $(event.currentTarget).css('background-color', '');
                } else {
                    AE.tabStyleMain.pinnedButtons[dataKey] = true;
                }
            }
        }

        updateMainTabAlternativeTaskDisplay() {
            let existing = $('#at_main_alternative_task_display');
            if(existing.length !== 0) {
                return;
            }

            let root = $('div.main-tasks');
            if(root.length !== 1) {
                return;
            }

            let current = $('<div id="vanilla_task_display" class="main-tasks"></div>');
            root.children().each(function() {
                $(this).detach();
                current.append($(this));
            });

            root.append(current);

            let alternative = $('<div id="at_main_alternative_task_display" class="main-tasks"></div>');
            root.append(alternative);

            this.activeButtonRoot = current;
            this.onToggleMainBarTaskDisplay(AE.settings.data.mainScreenAlternateDisplay);
        }
    }

    AE.tabStyleMain = new AETabStyleMain();

})(window.jQuery);