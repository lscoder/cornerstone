/**
 * This module is responsible for drawing a grayscale imageß
 */

(function (cornerstone) {

    "use strict";

    // Render a color or grayscale image with support for multi-layered elements.
    function renderImage(enabledElement, invalidated) {
        var image = enabledElement.image;
        var layers = enabledElement.layers || [];

        // We aren't checking if needsRedraw is true because once this
        // method is called the image WILL BE rendered.
        if (!enabledElement.canvas || !(enabledElement.image || layers.length)){
            return;
        }

        var start = new Date();

        if (layers && layers.length) {
            cornerstone.drawCompositeImage(enabledElement, invalidated);
        } else if (image) {
            var render; // = image.render;

            if(!render) {
                render = image.color ? cornerstone.renderColorImage : cornerstone.renderGrayscaleImage;
            }

            render(enabledElement, invalidated);
        }

        var end = new Date();
        var diff = end - start;
        var context = enabledElement.canvas.getContext('2d');

        var eventData = {
            viewport: enabledElement.viewport,
            element: enabledElement.element,
            image: enabledElement.image,
            layers: enabledElement.layers,
            enabledElement: enabledElement,
            canvasContext: context,
            renderTimeInMs: diff
        };

        $(enabledElement.element).trigger("CornerstoneImageRendered", eventData);
    }

    // Module exports
    cornerstone.renderImage = renderImage;

}(cornerstone));
