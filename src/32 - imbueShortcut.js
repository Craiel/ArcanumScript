// Imbue Gem Shortcut
(function($) {
    'use strict';

    class AEImbueGemShortcut {
        constructor() {
            this.imbueGemCraftButtonPinned = false;
        }

        update(delta) {
            let taskArea = $('div.main-tasks');
            if(taskArea.length === 0) {
                return;
            }

            let imbueSpan = $('#at_imbue_gems');

            let gemCraftButtons = AE.pageUtils.getUpgradeButtons(AE.data.GemCraftButtonDataKeys);
            if(gemCraftButtons.length === 0) {
                if(imbueSpan.length !== 0) {
                    imbueSpan.remove();
                }

                return false;
            }

            if(imbueSpan.length === 0) {
                this.imbueGemCraftButtonPinned = false;
                imbueSpan = $('<span id="at_imbue_gems" class="task-btn hidable"></span>');
                let imbueSpanBtn = $('<button id="at_imbue_gems_btn" class="wrapped-btn">Imbue All Gems</button>')
                imbueSpanBtn.click(function(event) {
                    if(event !== undefined && event.originalEvent !== undefined && event.originalEvent.ctrlKey === true) {
                        AE.imbueGemShortcut.imbueGemCraftButtonPinned = !AE.imbueGemShortcut.imbueGemCraftButtonPinned;
                        if(AE.imbueGemShortcut.imbueGemCraftButtonPinned === true) {
                            $(this).css('background-color', 'lightblue');
                        } else {
                            $(this).css('background-color', '');
                        }

                        return;
                    }

                    let gemCraftButtons = AE.pageUtils.getUpgradeButtons(AE.data.GemCraftButtonDataKeys);
                    for(let i = 0; i < gemCraftButtons.length; i++){
                        $(gemCraftButtons[i]).click();
                    }
                });

                imbueSpan.append(imbueSpanBtn);
                gemCraftButtons[0].parent().before(imbueSpan);
            } else {
                if(this.imbueGemCraftButtonPinned === true) {
                    $('#at_imbue_gems_btn').click();
                }
            }
        }
    }

    AE.imbueGemShortcut = new AEImbueGemShortcut();

})(window.jQuery);