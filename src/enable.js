/**
 * This module is responsible for enabling an element to display images with cornerstone
 */
(function (cornerstone) {

    "use strict";

    function enable(element) {
        if(element === undefined) {
            throw "enable: parameter element cannot be undefined";
        }

        var canvas = document.createElement('canvas');
        element.appendChild(canvas);

        var el = {
            element: element,
            canvas: canvas,
            image : undefined, // will be set once image is loaded
            invalid: false, // true if image needs to be drawn, false if not
            needsRedraw: true,
            layers: [],
            data : {}
        };
        cornerstone.addEnabledElement(el);

        cornerstone.resize(element, true);


        function draw() {
            if (el.canvas === undefined){
                return;
            }

            if (el.needsRedraw) {
                cornerstone.renderImage(el, el.invalid);

                el.invalid = false;
                el.needsRedraw = false;
            }

            cornerstone.requestAnimationFrame(draw);
        }

        draw();

        return element;
    }

    // module/private exports
    cornerstone.enable = enable;
}(cornerstone));