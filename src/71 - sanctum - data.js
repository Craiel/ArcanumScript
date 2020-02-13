// Sanctum Data
(function($) {
    'use strict';

    class AESanctumData {
    }

    AE.sanctumData = new AESanctumData();

    AE.sanctumData.Tabs = {
        Conjure: {id: 'conjure', title: 'Conjure'},
        Research: {id: 'research', title: 'Research'}
    };

    AE.sanctumData.resources = {
        essence: {
            id: 'essence',
            symbol: '⚗️',
            producers: {
                click: {

                }
            }
        }
    };

})(window.jQuery);