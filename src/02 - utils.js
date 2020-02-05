// Utils
(function($) {
    'use strict';

    class AEUtils {
        processTemplate(template, parameters){
            for(let key in parameters) {
                template = template.split('{{'+key+'}}').join(parameters[key]);
            }

            return template;
        }
    }

    AE.utils = new AEUtils();

})(window.jQuery);