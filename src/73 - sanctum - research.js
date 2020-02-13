// Sanctum Research
(function($) {
    'use strict';

    const ResearchHTML = `
<div>
</div>`;

    class AESanctumResearch {
        constructor() {
            this.isActive = false;
            this.activeRoot = undefined;
        }

        update(delta) {

        }

        updateUI(delta) {
            if(this.isActive !== true){
                return;
            }

            // Refresh the ui
        }

        activate(root) {
            if(root === undefined || root.length === 0) {
                return;
            }

            root.empty();

            this.activePage = $(ResearchHTML);
            root.append(this.activePage);

            this.isActive = true;
        }

        deactivate() {
            this.activePage = undefined;
            this.isActive = false;
        }
    }

    AE.sanctumResearch = new AESanctumResearch();

})(window.jQuery);