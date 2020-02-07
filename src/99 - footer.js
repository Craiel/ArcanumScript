(function($) {
    'use strict';

    let initializeDelay = 3000;

    let isLoaded = false;
    let lastUpdate = 0;

    // -------------------------------------------------------------------
    // Update
    // -------------------------------------------------------------------
    function update(timestamp) {
        tick(timestamp);
        window.requestAnimationFrame(update);
    }

    function tick(timestamp) {
        let quickBar = $(".quickbar");
        if (quickBar.length === 0) {
            return;
        }

        if(lastUpdate === 0) {
            lastUpdate = timestamp;
        }

        let delta = timestamp - lastUpdate;
        lastUpdate = timestamp;

        if(initializeDelay > 0) {
            initializeDelay -= delta;
            return;
        }

        if(isLoaded === false) {
            AE.log("Loading...");
            AE.loader.load();
            isLoaded = true;
            AE.log("Loading Done!");
        }

        AE.interval.update(delta);
    }

    update();

})(window.jQuery);