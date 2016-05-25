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

    function addLayer(element, image, options) {
        var enabledElement = cornerstone.getEnabledElement(element);
        
        var layerId = guid();

        // Set syncViewports to true by default when a new layer is added
        if (enabledElement.syncViewports === undefined) {
            enabledElement.syncViewports = true;
        }

        enabledElement.layers = enabledElement.layers || [];

        var layerEnabledElement = {
            image: image,
            layerId: layerId,
            options: options || {}
        };

        enabledElement.layers.push(layerEnabledElement);

        console.log('Layer added: ' + layerId);
        return layerId;
    }

    function removeLayer(element, layerId) {
        var enabledElement = cornerstone.getEnabledElement(element);
        var index = indexOfInObjectArray(enabledElement.layers, 'layerId', layerId);
        if (index !== -1) {
            enabledElement.layers.splice(index, 1);
            console.log('Layer removed: ' + layerId);
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

    // module/private exports
    cornerstone.addLayer = addLayer;
    cornerstone.removeLayer = removeLayer;
    cornerstone.getLayers = getLayers;

}(cornerstone));
