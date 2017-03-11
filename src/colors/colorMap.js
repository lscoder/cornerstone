(function(cornerstone) {

  var COLOR_BLACK = [0, 0, 0, 255];

  var colorMaps = {
    spectrum: {
      name: 'Spectrum Color Palette',
      colors: [
        [  0,   0,   0, 255],
        [228,  26,  28, 255],
        [ 55, 126, 184, 255],
        [ 77, 175,  74, 255],
        [152,  78, 163, 255],
        [255, 127,   0, 255],
        [166,  86,  40, 255]
     ]
    },
    warm: {
      name: 'Warn Color Palette',
      colors: [
        [121,  23,  23, 255],
        [181,   1,   1, 255],
        [239,  71,  25, 255],
        [249, 131,  36, 255],
        [255, 180,   0, 255],
        [255, 229,   6, 255]
      ]
    },
    cool: {
      name: 'Cool Color Palette',
      colors: [
        [117, 177,   1, 255],
        [ 88, 128,  41, 255],
        [ 80, 215, 191, 255],
        [ 28, 149, 205, 255],
        [ 59, 104, 171, 255],
        [154, 104, 255, 255],
        [ 95,  51, 128, 255]
      ]
    },
    blues: {
      name: 'Blues Color Palette',
      colors: [
        [ 59, 104, 171, 255],
        [ 28, 149, 205, 255],
        [ 78, 217, 234, 255],
        [115, 154, 213, 255],
        [ 66,  61, 169, 255],
        [ 80,  84, 135, 255],
        [ 16,  42,  82, 255]
     ]
    },
    wildFlower: {
      name: 'Wild Flower Color Palette',
      colors: [
        [ 28, 149, 205, 255],
        [ 59, 104, 171, 255],
        [102,  62, 183, 255],
        [162,  84, 207, 255],
        [222,  97, 206, 255],
        [220,  97, 149, 255],
        [ 61,  16,  82, 255]
     ]
    },
    citrus: {
      name: 'Citrus Color Palette',
      colors: [
        [101, 124,  55, 255],
        [117, 177,   1, 255],
        [178, 186,  48, 255],
        [255, 229,   6, 255],
        [255, 180,   0, 255],
        [249, 131,  36, 255]
     ]
    }

  }

  function getColorMap(id) {
    var colorMap = colorMaps[id];

    if(!colorMap) {
      colorMap = colorMaps[id] = {
        name: '',
        colors: []
      }
    }

    return {
      getColorSchemeName: function(index) {
        return colorMap.name;
      },

      setColorSchemeName: function(name) {
        colorMap.name = name;
      },

      getNumberOfColors: function() {
        return colorMap.colors.length;
      },

      setNumberOfColors: function(numColors) {
        while(colorMap.colors.length < numColors) {
          colorMap.colors.push(COLOR_BLACK);
        }

        colorMap.colors.length = numColors;
      },

      getColor: function(index) {
        if(this.isValidIndex(index)) {
          return colorMap.colors[index];
        }

        return COLOR_BLACK;
      },

      getColorRepeating: function(index) {
        var numColors = colorMap.colors.length;
        index = numColors ? index % numColors : 0;

        return this.getColor(index);
      },

      setColor: function(index, rgba) {
        if(this.isValidIndex(index)) {
          colorMap.colors[index] = rgba;
        }
      },

      addColor: function(rgba) {
        colorMap.colors.push(rgba);
      },

      insertColor: function(index, rgba) {
        if(this.isValidIndex(index)) {
          colorMap.colors.splice(index, 0, rgba);
        }
      },

      removeColor: function(index) {
        if(this.isValidIndex(index)) {
          colorMap.colors.splice(index, 1);
        }
      },

      clearColors: function() {
        colorMap.colors = [];
      },

      buildLookupTable: function(lut) {
        if(!lut) {
          return;
        }

        var i;
        var numColors = colorMap.colors.length;

        lut.setNumberOfTableValues(numColors);

        for(i = 0; i < numColors; i++) {
          lut.setTableValue(i, colorMap.colors[i]);
        }
      },

      createLookupTable: function() {
        var lut = new cornerstone.colors.LookupTable();
        this.buildLookupTable(lut);

        return lut;
      },

      isValidIndex: function(index) {
        return (index >= 0) && (index < colorMap.colors.length);
      }
    }
  }

  cornerstone.colors.getColorMap = getColorMap;
  
}(cornerstone));