/**
 * This module is responsible for drawing a grayscale imageß
 */

(function (cornerstone) {

    "use strict";

    function renderImage(enabledElement) {
        var image = enabledElement.image;
        var invalid = enabledElement.invalid;

        if(!image) {
            return;
        }

        if(image.color) {
            cornerstone.renderColorImage(enabledElement, invalid);
        } else {
            cornerstone.renderGrayscaleImage(enabledElement, invalid);
        }
    }

    // Module exports
    cornerstone.renderImage = renderImage;

}(cornerstone));
