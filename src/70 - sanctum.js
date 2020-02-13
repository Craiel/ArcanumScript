// Sanctum
(function($) {
    'use strict';

    const SanctumScreenHTML = `
<div id="at_sanctum_screen" style="position: absolute;width:100%;height:100%;background-color: white;">
    <div id="at_sanctum_top" class="menu-items">
       <div id="at_sanctum_leave_btn" class="menu-item">
            <span><u>Leave Sanctum</u></span>
       </div>
    </div>
    <div id="at_sanctum_content">
        <ul id="at_sanctum_tab_root" style="display: flex; flex-direction: row;">
        </ul>
    </div>  
</div>`;

    const SanctumTabTemplate = `
<li style="border-top-width: thin;border-left-width: thin;border-right-width: thin;border-bottom-width: 0px;border-style: solid;padding: 10px;margin: 2px;min-width:100px;">
    <a href="#at_sanctum_tab_{{id}}" style="text-decoration: none;">{{title}}</a>
</li>`;

    const SanctumTabContentTemplate = `
<div id="at_sanctum_tab_{{id}}">
    <p>This is Tab: {{id}}</p>
</div>`;

    class AESanctum {

        constructor() {
            this.isInitialized = false;
            this.activeContent = undefined;
        }

        update(delta) {
            if(this.isInitialized !== true){
                return;
            }

            AE.sanctumConjure.update(delta);
            AE.sanctumResearch.update(delta);
        }

        updateUI(delta) {
            if(this.isInitialized !== true) {
                this.checkSettings();
                this.updateMenuItem();
                this.updateSanctumScreen();
                this.isInitialized = true;
            }

            if(this.activeContent !== undefined) {
                this.activeContent.updateUI(delta);
            }
        }

        checkSettings(){
            let settings = AE.settings.data.sanctum;
            if(settings === undefined){
                settings = {};
                AE.settings.data.sanctum = settings;
            }

            if(settings.unlocks === undefined) {
                settings.unlocks = {};
            }

            if(settings.conjure === undefined) {
                settings.conjure = {
                    resource: {},
                    producers: {}
                };
            }

            if(settings.research === undefined) {
                settings.research = {
                    complete: {},
                    inProgress: {}
                };
            }

            AE.settings.save();
        }

        addTab(root, id, title) {
            let tabRoot = root.find('#at_sanctum_tab_root');
            let contentRoot = root.find('#at_sanctum_content')
            if(tabRoot.length === 0 || contentRoot.length === 0) {
                return;
            }

            let tab = $(AE.utils.processTemplate(SanctumTabTemplate, {id: id, title: title}));
            tabRoot.append(tab);

            let tabContent = $(AE.utils.processTemplate(SanctumTabContentTemplate, {id: id}));
            contentRoot.append(tabContent);

            return [tab, tabContent];
        }

        activateTab(tab) {
            if(tab === undefined) {
                return;
            }

            if(this.activeContent !== undefined) {
                this.activeContent.deactivate();
                this.activeContent = undefined;
            }

            AE.log("Activating Sanctum Tab: " + tab.title);
            let tabContent = $('#at_sanctum_tab_' + tab.id);
            switch (tab) {
                case AE.sanctumData.Tabs.Conjure: {
                    AE.sanctumConjure.activate(tabContent);
                    this.activeContent = AE.sanctumConjure;
                    break;
                }

                case AE.sanctumData.Tabs.Research: {
                    AE.sanctumResearch.activate(tabContent);
                    this.activeContent = AE.sanctumResearch;
                    break;
                }
            }
        }

        updateSanctumScreen(){
            let existing = $('#at_sanctum_screen');
            if(existing.length !== 0) {
                return;
            }

            let root = $('div.game-mid');
            if(root.length === 0) {
                return;
            }

            // Have to set root to relative explicitly for this window to show correctly
            root.css('position', 'relative');

            let screen = $(SanctumScreenHTML);
            screen.find('#at_sanctum_leave_btn').click(function() {
                AE.sanctum.hideSanctumScreen();
            });

            for(let key in AE.sanctumData.Tabs) {
                let tabData = AE.sanctumData.Tabs[key];
                this.addTab(screen, tabData.id, tabData.title);
            }

            screen.tabs({
                activate: function(event, ui) {
                    let tabId = $(event.currentTarget).attr("href").replace('#at_sanctum_tab_', '');
                    for(let key in AE.sanctumData.Tabs) {
                        if(AE.sanctumData.Tabs[key].id === tabId) {
                            AE.sanctum.activateTab(AE.sanctumData.Tabs[key]);
                            break;
                        }
                    }
                }
            });

            screen.hide();
            root.append(screen);

            this.activateTab(AE.sanctumData.Tabs.Conjure);
        }

        showSanctumScreen() {
            $('#at_sanctum_screen').show();
        }

        hideSanctumScreen() {
            $('#at_sanctum_screen').hide();
        }

        updateMenuItem() {
            let existing = $('#at_sanctum_menu');
            if(existing.length !== 0) {
                return;
            }

            let root = $('div.menu-items');
            if(root.length === 0){
                return;
            }

            let menu = $('<div class="menu-item" id="at_sanctum_menu" data-v-636f3856=""><span><u id="at_sanctum_menu_text">Enter Sanctum</u></span></div>');
            menu.click(function() {
                AE.sanctum.showSanctumScreen();
            });

            root.append(menu);
        }
    }

    AE.sanctum = new AESanctum();

})(window.jQuery);