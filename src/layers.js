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

    function getLayers(element, layerId) {
        var enabledElement = cornerstone.getEnabledElement(element);
        
        // If a layer ID is provided, return the details of that layer
        if (layerId) {
            var index = indexOfInObjectArray(enabledElement.layers, 'layerId', layerId);
            if (index !== -1) {
                return enabledElement.layers[index];
            }
        }

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

        cornerstone.updateImage(element);
        triggerEvent('CornerstoneActiveLayerChanged', enabledElement, layerId);
    }

    function getActiveLayer(element, layerId) {
        var enabledElement = cornerstone.getEnabledElement(element);
        var index = indexOfInObjectArray(enabledElement.layers, 'layerId', enabledElement.activeLayerId);

        if(index !== -1) {
            return enabledElement.layers[index];
        }
    }

    // module/private exports
    cornerstone.addLayer = addLayer;
    cornerstone.removeLayer = removeLayer;
    cornerstone.getLayers = getLayers;
    cornerstone.setActiveLayer = setActiveLayer;
    cornerstone.getActiveLayer = getActiveLayer;

}(cornerstone));
