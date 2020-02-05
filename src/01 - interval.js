// Interval helper
(function($) {
    'use strict';

    class AEInterval {
        constructor() {
            this.intervalFunctions = [];
            this.intervalFunctionTimers = {};
            this.intervalFunctionRemaining = {};
        }

        add(target, interval, startAfterDelay) {
            let id = this.intervalFunctions.length;

            if(startAfterDelay === true) {
                this.intervalFunctionRemaining[id] = interval;
            } else {
                this.intervalFunctionRemaining[id] = 0;
            }

            this.intervalFunctionTimers[id] = interval;

            this.intervalFunctions.push(target);
        }

        remove(target) {
            let id = this.intervalFunctions.indexOf(target);
            if(id === -1) {
                return;
            }

            delete this.intervalFunctionTimers[id];
            delete this.intervalFunctionRemaining[id];
            this.intervalFunctions.splice(id, 1);
        }

        update(delta) {
            for(let id = 0; id < this.intervalFunctions.length; id++) {
                let func = this.intervalFunctions[id];
                let updateInterval = this.intervalFunctionTimers[id];

                this.intervalFunctionRemaining[id] -= delta;
                if(this.intervalFunctionRemaining[id] <= 0) {
                    func(updateInterval);
                    this.intervalFunctionRemaining[id] = updateInterval;
                }
            }
        }
    }

    AE.interval = new AEInterval();

})(window.jQuery);