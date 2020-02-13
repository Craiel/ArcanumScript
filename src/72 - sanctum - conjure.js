// Sanctum Conjure
(function($) {
    'use strict';

    const ConjureHTML = `
<div>
    <div id="at_s_conjure_resources" style="width:350px;">
        <table>
            <tbody>        
            </tbody>
        </table>
    </div>
    <div id="at_s_conjure_producers">
    
    </div>
</div>`;

    class AESanctumConjure {
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

            this.activePage = $(ConjureHTML);
            root.append(this.activePage);

            console.log("ACT: conjure");
            this.isActive = true;
        }

        deactivate() {
            console.log("DEACT: conjure");
            this.activePage = undefined;
            this.isActive = false;
        }
    }

    AE.sanctumConjure = new AESanctumConjure();

})(window.jQuery);