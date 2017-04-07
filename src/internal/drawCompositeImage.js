/**
 * This module is responsible for drawing an image to an enabled elements canvas element
 */

(function ($, cornerstone) {

    "use strict";

    function stringToFloatArray(array) {
        return array.split('\\').map(function(value) {
                return parseFloat(value);
            });
    }

    function cloneViewport(viewport) {
        return {
            rotation: viewport.rotation,
            scale: viewport.scale,
            translation: {
                x: viewport.translation.x,
                y: viewport.translation.y
            }
        }
    }

    function getDrawImageOffset(targetImageId, referenceImageId) {
        var offset = {
            x: 0,
            y: 0
        };

        var targetImagePlane = cornerstoneTools.metaData.get('imagePlane', targetImageId);
        if (!targetImagePlane ||
            !targetImagePlane.imagePositionPatient ||
            !targetImagePlane.rowCosines ||
            !targetImagePlane.columnCosines) {
            return offset;
        }

        var referenceImagePlane = cornerstoneTools.metaData.get('imagePlane', referenceImageId);
        if (!referenceImagePlane ||
            !referenceImagePlane.imagePositionPatient ||
            !referenceImagePlane.rowCosines ||
            !referenceImagePlane.columnCosines) {
            return offset;
        }

        // TODO: Add Image Orientation check between layers
        var pos = stringToFloatArray(targetImagePlane.imagePositionPatient);
        var origPos = stringToFloatArray(referenceImagePlane.imagePositionPatient)

        offset.x = pos[0] - origPos[0];
        offset.y = pos[1] - origPos[1];
        return offset;
    }


    // This is used to keep each of the layers' viewports in sync with the active layer
    var syncedViewports = {};
    var lastSyncViewportsStatus;

    /**
     * Internal API function to draw to an enabled element
     * @param enabledElement
     * @param invalidated - true if pixel data has been invalidated and cached rendering should not be used
     */
    function renderCompositeImage(enabledElement, invalidated) {
        var activeLayer = cornerstone.getActiveLayer(enabledElement.element);

        // Make an array of only the visible layers to save time
        var visibleLayers = enabledElement.layers.filter(function(layer) {
            if (layer.options && layer.options.visible !== false && layer.options.opacity !== 0) {
                return true;
            }
        });

        var updateSyncedViewports = !lastSyncViewportsStatus && enabledElement.syncViewports;
        lastSyncViewportsStatus = enabledElement.syncViewports;

        // If we intend to keep the viewport's scale and translation in sync,
        // loop through the layers 
        if (enabledElement.syncViewports === true) {

            if(updateSyncedViewports) {
                syncedViewports[activeLayer.layerId] = cloneViewport(activeLayer.viewport);
            }

            visibleLayers.forEach(function(layer, index) {

                // Don't do anything to the active layer
                if (layer === activeLayer) {
                    return;
                }

                if (updateSyncedViewports) {
                    syncedViewports[layer.layerId] = cloneViewport(layer.viewport);
                }

                var activeLayerSyncedViewport = syncedViewports[activeLayer.layerId];
                var currentLayerSyncedViewport = syncedViewports[layer.layerId];
                var viewportRatio = currentLayerSyncedViewport.scale / activeLayerSyncedViewport.scale;

                // Update the layer's translation and scale to keep them in sync with the first image
                // based on the ratios between the images
                layer.viewport.scale = activeLayer.viewport.scale * viewportRatio;
                layer.viewport.rotation = activeLayer.viewport.rotation;
                layer.viewport.translation = {
                    x: (activeLayer.viewport.translation.x / viewportRatio), // * layer.image.width / activeLayer.image.width,
                    y: (activeLayer.viewport.translation.y / viewportRatio)  // * layer.image.height / activeLayer.image.height
                };
            });    
        }

        // Get the enabled element's canvas so we can draw to it
        var context = enabledElement.canvas.getContext('2d');
        context.setTransform(1, 0, 0, 1, 0, 0);

        // Clear the canvas
        context.fillStyle = 'black';
        context.fillRect(0, 0, enabledElement.canvas.width, enabledElement.canvas.height);

        // Loop through each layer and draw it to the canvas
        visibleLayers.forEach(function(layer, index) {
            context.save();

            // Set the layer's canvas to the pixel coordinate system
            layer.canvas = enabledElement.canvas;
            cornerstone.setToPixelCoordinateSystem(layer, context);

            // Render into the layer's canvas
            if (layer.image.color === true) {
                cornerstone.addColorLayer(layer, invalidated);
            } else {
                cornerstone.addGrayscaleLayer(layer, invalidated);    
            }

            // Apply any global opacity settings that have been defined for this layer
            if (layer.options && layer.options.opacity) {
                context.globalAlpha = layer.options.opacity;
            } else {
                context.globalAlpha = 1;    
            }
            
            // Calculate any offset between the position of the active layer and the current layer
            var offset = getDrawImageOffset(layer.image.imageId, activeLayer.image.imageId);

            // Draw from the current layer's canvas onto the enabled element's canvas
            context.drawImage(layer.canvas, 0, 0, layer.image.width, layer.image.height, offset.x, offset.y, layer.image.width, layer.image.height);

            context.restore();
        });
    }


    /**
     * Internal API function to draw a composite image to a given enabled element
     * @param enabledElement
     * @param invalidated - true if pixel data has been invalidated and cached rendering should not be used
     */
    function drawCompositeImage(enabledElement, invalidated) {
        renderCompositeImage(enabledElement, invalidated);
    }

    // Module exports
    cornerstone.internal.drawCompositeImage = drawCompositeImage;
    cornerstone.internal.renderCompositeImage = renderCompositeImage;
    cornerstone.drawCompositeImage = drawCompositeImage;

}($, cornerstone));