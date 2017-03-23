(function (cornerstone) {

    "use strict";

    function guid() {
      function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
          .toString(16)
          .substring(1);
      }
      return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
    }

    function indexOfInObjectArray(array, property, value) {
        var found = -1;
        array.forEach(function(object, index) {
            if (object[property] === value) {
                found = index;
                return false;
            }
        });

        return found;
    }

    function triggerEvent(eventName, enabledElement, layerId) {
        var element = enabledElement.element;
        var eventData = {
            viewport : enabledElement.viewport,
            element : enabledElement.element,
            image : enabledElement.image,
            enabledElement : enabledElement,
            layerId: layerId
        };

        $(element).trigger(eventName, eventData);
    }

    function addLayer(element, image, options) {
        var layerId = guid();
        var enabledElement = cornerstone.getEnabledElement(element);
        var layers = enabledElement.layers;
        var viewport = cornerstone.internal.getDefaultViewport(enabledElement.canvas, image);

        // Set syncViewports to true by default when a new layer is added
        if (enabledElement.syncViewports === undefined) {
            enabledElement.syncViewports = true;
        }

        var layerEnabledElement = {
            image: image,
            layerId: layerId,
            viewport: viewport,
            options: options || {}
        };

        layers.push(layerEnabledElement);

        if(layers.length === 1) {
            setActiveLayer(element, layers[0].layerId);
        }

        attachEventHandlers(enabledElement);
        triggerEvent('CornerstoneLayerAdded', enabledElement, layerId);

        console.log('Layer added: ' + layerId);
        return layerId;
    }

    function removeLayer(element, layerId) {
        var enabledElement = cornerstone.getEnabledElement(element);
        var layers = enabledElement.layers;
        var index = indexOfInObjectArray(enabledElement.layers, 'layerId', layerId);

        if (index !== -1) {
            layers.splice(index, 1);
            console.log('Layer removed: ' + layerId);

            if((layerId === enabledElement.activeLayerId) && layers.length) {
                setActiveLayer(element, layers[0].layerId);
            }

            triggerEvent('CornerstoneLayerRemoved', enabledElement, layerId);
        }
    }

    function getLayerById(element, layerId) {
        var enabledElement = cornerstone.getEnabledElement(element);
        var index = indexOfInObjectArray(enabledElement.layers, 'layerId', layerId);

        return enabledElement.layers[index];
    }

    function getLayers(element) {
        var enabledElement = cornerstone.getEnabledElement(element);
        return enabledElement.layers;
    }

    function setActiveLayer(element, layerId) {
        var enabledElement = cornerstone.getEnabledElement(element);
        var index = indexOfInObjectArray(enabledElement.layers, 'layerId', layerId);

        if ((index === -1) || (enabledElement.activeLayerId === layerId)) {
            return;
        }

        var layer = enabledElement.layers[index];

        enabledElement.activeLayerId = layerId;
        enabledElement.image = layer.image;
        enabledElement.viewport = layer.viewport;

        cornerstoneTools.clearToolState(element, 'stack');
        if(layer.options.stack) {
            cornerstoneTools.addToolState(element, 'stack', layer.options.stack);
        }

        cornerstone.updateImage(element);
        triggerEvent('CornerstoneActiveLayerChanged', enabledElement, layerId);
    }

    function getActiveLayer(element) {
        var enabledElement = cornerstone.getEnabledElement(element);
        var index = indexOfInObjectArray(enabledElement.layers, 'layerId', enabledElement.activeLayerId);

        if(index !== -1) {
            return enabledElement.layers[index];
        }
    }

    function attachEventHandlers(enabledElement) {
        $(enabledElement.element).off('CornerstoneStackScroll.Layers');

        if(layers.length) {
            $(enabledElement.element).on('CornerstoneStackScroll.Layers', onStackScroll);
        }
    }

    function onStackScroll(event, eventData) {
        var enabledElement = cornerstone.getEnabledElement(eventData.element);
        var activeLayer = getActiveLayer(enabledElement.element);
        var layers = enabledElement.layers;
        var percent = eventData.newImageIdIndex / (eventData.stackLength - 1);

        if(!Number.isFinite(percent)) {
            percent = 0;
        }

        function getLoadImageSuccessHandler(layer) {
            return function(image) {
                layer.image = image;
                cornerstone.updateImage(enabledElement.element);
            };
        }

        for(var i = 0; i < layers.length; i++) {
            var layer = layers[i];
            var layerOptions = layer.options || {};
            var stack = layerOptions.stack;

            if((layers[i] === activeLayer) || !stack) {
                continue;
            }

            var imageIds = stack.imageIds;
            var imageIndex = Math.round((imageIds.length - 1) * percent);
            var imageId = imageIds[imageIndex];
            var successHandler = getLoadImageSuccessHandler(layer);

            cornerstone.loadImage(imageId).then(successHandler);
        }
    }

    // module/private exports
    cornerstone.addLayer = addLayer;
    cornerstone.removeLayer = removeLayer;
    cornerstone.getLayers = getLayers;
    cornerstone.getLayerById = getLayerById;
    cornerstone.setActiveLayer = setActiveLayer;
    cornerstone.getActiveLayer = getActiveLayer;

}(cornerstone));
