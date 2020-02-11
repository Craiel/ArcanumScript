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

        arrayEquals(a, b) {
            if (a === b) return true;
            if (a == null || b == null) return false;
            if (a.length != b.length) return false;

            // If you don't care about the order of the elements inside
            // the array, you should sort both arrays here.
            // Please note that calling sort on an array will modify that array.
            // you might want to clone your array first.

            for (let i = 0; i < a.length; ++i) {
                if (a[i] !== b[i]) return false;
            }

            return true;
        }

        createOptionsToggle(id, title, callback, defaultValue){
            let toggle = $('<span class="opt"></span>');
            let toggleInput = $('<input id="' + id + '" type="checkbox"><label for="' + id + '">' + title + '</label></input>');
            if(defaultValue === true) {
                toggleInput.prop('checked', true);
            }

            toggle.append(toggleInput);
            toggleInput[0].addEventListener("change", event => {
                callback(event.target.checked);
            }, false);

            return toggleInput;
        }
    }

    AE.utils = new AEUtils();

})(window.jQuery);