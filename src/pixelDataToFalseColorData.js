(function(cornerstone) {

    "use strict";

    function pixelDataToFalseColorData(image, lut) {
        if (image.color) {
            throw "Color transforms are not implemented yet";
        }

        image.color = true;
        var minPixelValue = image.minPixelValue;
        var canvasImageDataIndex = 0;
        var storedPixelDataIndex = 0;
        var numPixels = image.width * image.height;
        var origPixelData = image.getPixelData();
        var storedColorPixelData = new Uint8Array(numPixels * 4);
        var localLut = lut;
        var sp, mapped;

        
        if (lut instanceof cornerstone.colors.LookupTable) {
            lut.build();
            
            while (storedPixelDataIndex < numPixels) {
                sp = origPixelData[storedPixelDataIndex++];
                mapped = lut.mapValue(sp);
                storedColorPixelData[canvasImageDataIndex++] = mapped[0];
                storedColorPixelData[canvasImageDataIndex++] = mapped[1];
                storedColorPixelData[canvasImageDataIndex++] = mapped[2];
                storedColorPixelData[canvasImageDataIndex++] = mapped[3];
            }
        } else {
            if (minPixelValue < 0) {
                while (storedPixelDataIndex < numPixels) {
                    sp = origPixelData[storedPixelDataIndex++];
                    storedColorPixelData[canvasImageDataIndex++] = localLut[sp + (-minPixelValue)][0]; // red
                    storedColorPixelData[canvasImageDataIndex++] = localLut[sp + (-minPixelValue)][1]; // green
                    storedColorPixelData[canvasImageDataIndex++] = localLut[sp + (-minPixelValue)][2]; // blue
                    storedColorPixelData[canvasImageDataIndex++] = localLut[sp + (-minPixelValue)][3]; // alpha
                }
            } else {
                while (storedPixelDataIndex < numPixels) {
                    sp = origPixelData[storedPixelDataIndex++];
                    try {
                        storedColorPixelData[canvasImageDataIndex++] = localLut[sp][0]; // red
                        storedColorPixelData[canvasImageDataIndex++] = localLut[sp][1]; // green
                        storedColorPixelData[canvasImageDataIndex++] = localLut[sp][2]; // blue
                        storedColorPixelData[canvasImageDataIndex++] = localLut[sp][3]; // alpha
                    } catch(error) {
                        console.log(sp);
                        console.log(error);
                    }
                }
            }

        }

        image.rgba = true;
        image.minPixelValue = 0;
        image.maxPixelValue = 255;
        image.windowWidth = 255;
        image.windowCenter = 128;
        image.getPixelData = function() {
            return storedColorPixelData;
        };
    }

    cornerstone.pixelDataToFalseColorData = pixelDataToFalseColorData;

}(cornerstone));