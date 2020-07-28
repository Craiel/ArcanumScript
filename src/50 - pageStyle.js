// Page Style helpers
(function($) {
    'use strict';

    class AEPageStyle {
        update(delta) {
            this.updateDarkModeState();

            this.updateTopBarBuffView();
            this.updateResourceList();
        }

        updateDarkModeState() {
            AE.pageStyle.darkModeActive = $('body').hasClass('darkmode');
        }

        updateTopBarBuffView() {
            let root = $('div.top-bar');
            if(root.length === 0) {
                return;
            }

            let buffBar = root.find('div.dot-view');
            if(buffBar.length === 0) {
                return;
            }

            buffBar.find('div.dot').each(function() {
                let countdownSpan = $(this).children()[0];
                let titleSpan = $(this).children()[1];
                let timeLeft = parseInt(countdownSpan.innerText);
                if(timeLeft < 10) {
                    $(countdownSpan).css('color', 'red');
                } else {
                    $(countdownSpan).css('color', '');
                }

                $(titleSpan).css('white-space', 'normal');
                $(this).css('width', '60px').css('height', '60px');
            });
        }

        updateResourceList() {
            let list = $('div.res-list');
            list.css('min-width', '18rem');

            // Color resources values, 0 empty, full green
            list.find('div.rsrc').each(function() {
                let el = $(this).find('.num-align');
                let values = AE.pageUtils.getValues(el.text().split('/'));
                if(values.current === values.max) {
                    el.css('color', '#00b800');
                } else if(values.current === 0) {
                    el.css('color', '#FF0000');
                } else if(values.pct >= 0.9) {
                    el.css('color', '#80b800');
                } else if(values.pct <= 0.1) {
                    el.css('color', '#ff8000');
                } else {
                    el.css('color', '#999');
                }
            });
        }
    }

    AE.pageStyle = new AEPageStyle();

})(window.jQuery);