(function(cornerstone) {

  var COLOR_BLACK = [0, 0, 0, 255];

  // Colormaps
  // 
  // All Linear Segmented Colormaps were copied from matplotlib
  // https://github.com/stefanv/matplotlib/blob/master/lib/matplotlib/_cm.py

  var colormapsData = {
    gray: {
      name: 'Gray',
      numColors: 256,
      gamma: 1,
      segmentedData: {
        'red':   [[0, 0, 0], [1, 1, 1]],
        'green': [[0, 0, 0], [1, 1, 1]],
        'blue':  [[0, 0, 0], [1, 1, 1]]
      }
    },
    jet: {
      name: 'Jet',
      numColors: 256,
      gamma: 1,
      segmentedData: {
        'red': [[0, 0, 0], [0.35 , 0, 0], [0.66 , 1, 1], [0.89, 1, 1], [1, 0.5, 0.5]],
        'green': [[0, 0, 0], [0.125, 0, 0], [0.375, 1, 1], [0.64, 1, 1], [0.91, 0, 0], [1, 0, 0]],
        'blue': [[0, 0.5, 0.5], [0.11 , 1, 1], [0.34 , 1, 1], [0.65, 0, 0], [1, 0, 0]]
      }
    },
    hsv: {
      name: 'HSV',
      numColors: 256,
      gamma: 1,
      segmentedData: {
        'red': [[0, 1, 1], [0.158730, 1, 1], [0.174603, 0.968750, 0.968750],
                [0.333333, 0.031250, 0.031250], [0.349206, 0, 0], [0.666667, 0, 0],
                [0.682540, 0.031250, 0.031250],[0.841270, 0.968750, 0.968750],
                [0.857143, 1, 1], [1, 1, 1]],
        'green': [[0, 0, 0],[0.158730, 0.937500, 0.937500], [0.174603, 1, 1],
                  [0.507937, 1, 1], [0.666667, 0.062500, 0.062500],
                  [0.682540, 0, 0], [1, 0, 0]],
        'blue':  [[0, 0, 0], [0.333333, 0, 0], [0.349206, 0.062500, 0.062500],
                  [0.507937, 1, 1], [0.841270, 1, 1], [0.857143, 0.937500, 0.937500],
                  [1, 0.09375, 0.09375]]
      }
    },
    hot: {
      name: 'Hot',
      numColors: 256,
      gamma: 1,
      segmentedData: {
        'red':   [[0, 0.0416, 0.0416], [0.365079, 1, 1], [1, 1, 1]],
        'green': [[0, 0, 0], [0.365079, 0, 0], [0.746032, 1, 1], [1, 1, 1]],
        'blue':  [[0, 0, 0], [0.746032, 0, 0], [1, 1, 1]] 
      }
    },
    cool: {
      name: 'Cool',
      numColors: 256,
      gamma: 1,
      segmentedData: {
        'red': [[0, 0, 0], [1, 1, 1]],
        'green': [[0, 1, 1], [1, 0, 0]],
        'blue': [[0, 1, 1], [1, 1, 1]]
      }
    },
    spring: {
      name: 'Spring',
      numColors: 256,
      gamma: 1,
      segmentedData: {
        'red':   [[0, 1, 1],[1, 1, 1]],
        'green': [[0, 0, 0],[1, 1, 1]],
        'blue':  [[0, 1, 1],[1, 0, 0]]
      }
    },
    summer: {
      name: 'Summer',
      numColors: 256,
      gamma: 1,
      segmentedData: {
        'red':   [[0, 0, 0],[1, 1, 1]],
        'green': [[0, 0.5, 0.5],[1, 1, 1]],
        'blue':  [[0, 0.4, 0.4],[1, 0.4, 0.4]]
      }
    },
    autumn: {
      name: 'Autumn',
      numColors: 256,
      gamma: 1,
      segmentedData: {
        'red': [[0, 1, 1], [1, 1, 1]],
        'green': [[0, 0, 0], [1, 1, 1]],
        'blue': [[0, 0, 0], [1, 0, 0]]
      }
    },
    winter: {
      name: 'Winter',
      numColors: 256,
      gamma: 1,
      segmentedData: {
        'red':   [[0, 0, 0],[1, 0, 0]],
        'green': [[0, 0, 0],[1, 1, 1]],
        'blue':  [[0, 1, 1],[1, 0.5, 0.5]]
      }
    },
    bone: {
      name: 'Bone',
      numColors: 256,
      gamma: 1,
      segmentedData: {
        'red': [[0, 0, 0], [0.746032, 0.652778, 0.652778], [1, 1, 1]],
        'green': [[0, 0, 0], [0.365079, 0.319444, 0.319444], [0.746032, 0.777778, 0.777778], [1, 1, 1]],
        'blue': [[0, 0, 0], [0.365079, 0.444444, 0.444444], [1, 1, 1]]
      }
    },
    copper: {
      name: 'Copper',
      numColors: 256,
      gamma: 1,
      segmentedData: {
        'red': [[0, 0, 0], [0.809524, 1, 1], [1, 1, 1]],
        'green': [[0, 0, 0], [1, 0.7812, 0.7812]],
        'blue':  [[0, 0, 0], [1, 0.4975, 0.4975]]
      }
    },
    spectral: {
      name: 'Spectral',
      numColors: 256,
      gamma: 1,
      segmentedData: {
        'red': [[0, 0, 0], [0.05, 0.4667, 0.4667], [0.10, 0.5333, 0.5333], [0.15, 0, 0],
                [0.20, 0, 0], [0.25, 0, 0], [0.30, 0, 0], [0.35, 0, 0],
                [0.40, 0, 0], [0.45, 0, 0], [0.50, 0, 0], [0.55, 0, 0],
                [0.60, 0, 0], [0.65, 0.7333, 0.7333], [0.70, 0.9333, 0.9333], [0.75, 1, 1],
                [0.80, 1, 1], [0.85, 1, 1], [0.90, 0.8667, 0.8667], [0.95, 0.80, 0.80],
                [1, 0.80, 0.80]],
        'green': [[0, 0, 0], [0.05, 0, 0], [0.10, 0, 0], [0.15, 0, 0],
                  [0.20, 0, 0], [0.25, 0.4667, 0.4667], [0.30, 0.6000, 0.6000],
                  [0.35, 0.6667, 0.6667], [0.40, 0.6667, 0.6667], [0.45, 0.6000, 0.6000],
                  [0.50, 0.7333, 0.7333], [0.55, 0.8667, 0.8667], [0.60, 1, 1], [0.65, 1, 1],
                  [0.70, 0.9333, 0.9333], [0.75, 0.8000, 0.8000],
                  [0.80, 0.6000, 0.6000], [0.85, 0, 0],
                  [0.90, 0, 0], [0.95, 0, 0], [1, 0.80, 0.80]],
        'blue': [[0, 0, 0], [0.05, 0.5333, 0.5333], [0.10, 0.6000, 0.6000], [0.15, 0.6667, 0.6667],
                 [0.20, 0.8667, 0.8667], [0.25, 0.8667, 0.8667], [0.30, 0.8667, 0.8667],
                 [0.35, 0.6667, 0.6667], [0.40, 0.5333, 0.5333], [0.45, 0, 0],
                 [0.5, 0, 0], [0.55, 0, 0], [0.60, 0, 0], [0.65, 0, 0], [0.70, 0, 0], [0.75, 0, 0],
                 [0.80, 0, 0], [0.85, 0, 0], [0.90, 0, 0], [0.95, 0, 0], [1, 0.80, 0.80]]
      }
    },
    coolwarm: {
      name: 'CoolWarm',
      numColors: 256,
      gamma: 1,
      segmentedData: {
        'red': [[0, 0.2298057, 0.2298057], [0.03125, 0.26623388, 0.26623388],
                [0.0625, 0.30386891, 0.30386891], [0.09375, 0.342804478, 0.342804478],
                [0.125, 0.38301334, 0.38301334], [0.15625, 0.424369608, 0.424369608],
                [0.1875, 0.46666708, 0.46666708], [0.21875, 0.509635204, 0.509635204],
                [0.25, 0.552953156, 0.552953156], [0.28125, 0.596262162, 0.596262162],
                [0.3125, 0.639176211, 0.639176211], [0.34375, 0.681291281, 0.681291281],
                [0.375, 0.722193294, 0.722193294], [0.40625, 0.761464949, 0.761464949],
                [0.4375, 0.798691636, 0.798691636], [0.46875, 0.833466556, 0.833466556],
                [0.5, 0.865395197, 0.865395197], [0.53125, 0.897787179, 0.897787179],
                [0.5625, 0.924127593, 0.924127593], [0.59375, 0.944468518, 0.944468518],
                [0.625, 0.958852946, 0.958852946], [0.65625, 0.96732803, 0.96732803],
                [0.6875, 0.969954137, 0.969954137], [0.71875, 0.966811177, 0.966811177],
                [0.75, 0.958003065, 0.958003065], [0.78125, 0.943660866, 0.943660866],
                [0.8125, 0.923944917, 0.923944917], [0.84375, 0.89904617, 0.89904617],
                [0.875, 0.869186849, 0.869186849], [0.90625, 0.834620542, 0.834620542],
                [0.9375, 0.795631745, 0.795631745], [0.96875, 0.752534934, 0.752534934],
                [1, 0.705673158, 0.705673158]],
        'green': [[0, 0.298717966, 0.298717966], [0.03125, 0.353094838, 0.353094838],
                  [0.0625, 0.406535296, 0.406535296], [0.09375, 0.458757618, 0.458757618],
                  [0.125, 0.50941904, 0.50941904], [0.15625, 0.558148092, 0.558148092],
                  [0.1875, 0.604562568, 0.604562568], [0.21875, 0.648280772, 0.648280772],
                  [0.25, 0.688929332, 0.688929332], [0.28125, 0.726149107, 0.726149107],
                  [0.3125, 0.759599947, 0.759599947], [0.34375, 0.788964712, 0.788964712],
                  [0.375, 0.813952739, 0.813952739], [0.40625, 0.834302879, 0.834302879],
                  [0.4375, 0.849786142, 0.849786142], [0.46875, 0.860207984, 0.860207984],
                  [0.5, 0.86541021, 0.86541021], [0.53125, 0.848937047, 0.848937047],
                  [0.5625, 0.827384882, 0.827384882], [0.59375, 0.800927443, 0.800927443],
                  [0.625, 0.769767752, 0.769767752], [0.65625, 0.734132809, 0.734132809],
                  [0.6875, 0.694266682, 0.694266682], [0.71875, 0.650421156, 0.650421156],
                  [0.75, 0.602842431, 0.602842431], [0.78125, 0.551750968, 0.551750968],
                  [0.8125, 0.49730856, 0.49730856], [0.84375, 0.439559467, 0.439559467],
                  [0.875, 0.378313092, 0.378313092], [0.90625, 0.312874446, 0.312874446],
                  [0.9375, 0.24128379, 0.24128379], [0.96875, 0.157246067, 0.157246067],
                  [1, 0.01555616, 0.01555616]],
        'blue': [[0, 0.753683153, 0.753683153], [0.03125, 0.801466763, 0.801466763],
                 [0.0625, 0.84495867, 0.84495867], [0.09375, 0.883725899, 0.883725899],
                 [0.125, 0.917387822, 0.917387822], [0.15625, 0.945619588, 0.945619588],
                 [0.1875, 0.968154911, 0.968154911], [0.21875, 0.98478814, 0.98478814],
                 [0.25, 0.995375608, 0.995375608], [0.28125, 0.999836203, 0.999836203],
                 [0.3125, 0.998151185, 0.998151185], [0.34375, 0.990363227, 0.990363227],
                 [0.375, 0.976574709, 0.976574709], [0.40625, 0.956945269, 0.956945269],
                 [0.4375, 0.931688648, 0.931688648], [0.46875, 0.901068838, 0.901068838],
                 [0.5, 0.865395561, 0.865395561], [0.53125, 0.820880546, 0.820880546],
                 [0.5625, 0.774508472, 0.774508472], [0.59375, 0.726736146, 0.726736146],
                 [0.625, 0.678007945, 0.678007945], [0.65625, 0.628751763, 0.628751763],
                 [0.6875, 0.579375448, 0.579375448], [0.71875, 0.530263762, 0.530263762],
                 [0.75, 0.481775914, 0.481775914], [0.78125, 0.434243684, 0.434243684],
                 [0.8125, 0.387970225, 0.387970225], [0.84375, 0.343229596, 0.343229596],
                 [0.875, 0.300267182, 0.300267182], [0.90625, 0.259301199, 0.259301199],
                 [0.9375, 0.220525627, 0.220525627], [0.96875, 0.184115123, 0.184115123],
                 [1, 0.150232812, 0.150232812]]
      }
    },
    blues: {
      name: 'Blues',
      numColors: 256,
      gamma: 1,
      segmentedData: {
        'red': [[0, 0.9686274528503418, 0.9686274528503418], [0.125, 0.87058824300765991, 0.87058824300765991],
                [0.25, 0.7764706015586853, 0.7764706015586853], [0.375, 0.61960786581039429, 0.61960786581039429],
                [0.5, 0.41960784792900085, 0.41960784792900085], [0.625, 0.25882354378700256, 0.25882354378700256],
                [0.75, 0.12941177189350128, 0.12941177189350128], [0.875, 0.031372550874948502, 0.031372550874948502],
                [1, 0.031372550874948502, 0.031372550874948502]],
        'green': [[0, 0.9843137264251709, 0.9843137264251709], [0.125, 0.92156863212585449, 0.92156863212585449],
                  [0.25, 0.85882353782653809, 0.85882353782653809], [0.375, 0.7921568751335144, 0.7921568751335144],
                  [0.5, 0.68235296010971069, 0.68235296010971069], [0.625, 0.57254904508590698, 0.57254904508590698],
                  [0.75, 0.44313725829124451, 0.44313725829124451], [0.875, 0.31764706969261169, 0.31764706969261169],
                  [1, 0.18823529779911041, 0.18823529779911041]],
        'blue': [[0, 1, 1], [0.125, 0.9686274528503418, 0.9686274528503418], [0.25, 0.93725490570068359, 0.93725490570068359],
                 [0.375, 0.88235294818878174, 0.88235294818878174], [0.5, 0.83921569585800171, 0.83921569585800171],
                 [0.625, 0.7764706015586853, 0.7764706015586853], [0.75, 0.70980393886566162, 0.70980393886566162],
                 [0.875, 0.61176472902297974, 0.61176472902297974], [1, 0.41960784792900085, 0.41960784792900085]]
      }
    }
  }

  // Generate linearly spaced vectors
  // http://cens.ioc.ee/local/man/matlab/techdoc/ref/linspace.html
  function linspace(a, b, n) {
    n = n == null ? 100 : n;

    var increment = (b - a) / (n - 1);
    var vector = [];

    while(n-- > 0) {
      vector.push(a);
      a += increment;
    }

    // Make sure the last item will always be "b" because most of the
    // time we'll get numbers like 1.0000000000000002 instead of 1.
    vector[vector.length - 1] = b;

    return vector;
  }

  // Return the number of elements smaller than "elem" (binary search)
  function getRank(array, elem) {
    var left = 0;
    var right = array.length - 1;

    while(left <= right) {
      var mid = left + Math.floor((right - left) / 2);
      var midElem = array[mid];

      if(midElem === elem) {
        return mid;
      } else if(elem < midElem) {
        right = mid - 1;
      } else {
        left = mid + 1;
      }
    }

    return left;
  }

  // Find the indices into a sorted array a such that, if the corresponding elements
  // in v were inserted before the indices, the order of a would be preserved.
  // http://lagrange.univ-lyon1.fr/docs/numpy/1.11.0/reference/generated/numpy.searchsorted.html
  function searchSorted(inputArray, values) {
    var i;
    var indexes = [];
    var len = values.length;

    inputArray.sort(function(a, b) {
      return a - b;
    });

    for(i = 0; i < len; i++) {
      indexes[i] = getRank(inputArray, values[i]);
    }

    return indexes;
  }

  // Create an *N* -element 1-d lookup table
  // 
  // *data* represented by a list of x,y0,y1 mapping correspondences. Each element in this
  // list represents how a value between 0 and 1 (inclusive) represented by x is mapped to
  // a corresponding value between 0 and 1 (inclusive). The two values of y are to allow for
  // discontinuous mapping functions (say as might be found in a sawtooth) where y0 represents
  // the value of y for values of x <= to that given, and y1 is the value to be used for x >
  // than that given). The list must start with x=0, end with x=1, and all values of x must be
  // in increasing order. Values between the given mapping points are determined by simple linear
  // interpolation.
  // 
  // The function returns an array "result" where result[x*(N-1)] gives the closest value for
  // values of x between 0 and 1.
  function makeMappingArray(N, data, gamma) {
    var i;
    var x = [];
    var y0 = [];
    var y1 = [];
    var lut = [];

    gamma = gamma == null ? 1 : gamma;

    for(i = 0; i < data.length; i++) {
      var element = data[i];

      x.push((N - 1) * element[0]);
      y0.push(element[1]);
      y1.push(element[1]);
    }

    var xLinSpace = linspace(0, 1, N);
    for(i = 0; i < N; i++) {
      xLinSpace[i] = (N - 1) * Math.pow(xLinSpace[i], gamma);
    }

    var xLinSpaceIndexes = searchSorted(x, xLinSpace);

    for(i = 1; i < N - 1; i++) {
      var index = xLinSpaceIndexes[i];
      var colorPercent = ((xLinSpace[i] - x[index - 1]) / (x[index] - x[index - 1]));
      var colorDelta = (y0[index] - y1[index - 1])

      lut[i] = colorPercent * colorDelta + y1[index - 1];
    }

    lut[0] = y1[0];
    lut[N-1] = y0[data.length - 1];

    return lut;
  }

  // Colormap based on lookup tables using linear segments.
  // 
  // The lookup table is generated using linear interpolation for each
  // primary color, with the 0-1 domain divided into any number of
  // segments.
  //
  // https://github.com/stefanv/matplotlib/blob/3f1a23755e86fef97d51e30e106195f34425c9e3/lib/matplotlib/colors.py#L663
  function createLinearSegmentedColormap(segmentedData, N, gamma) {
    var i;
    var lut = [];

    N = N == null ? 256 : N;
    gamma = gamma == null ? 1 : gamma;

    var redLut = makeMappingArray(N, segmentedData.red, gamma);
    var greenLut = makeMappingArray(N, segmentedData.green, gamma);
    var blueLut = makeMappingArray(N, segmentedData.blue, gamma);

    for(i = 0; i < N; i++) {
      var red = Math.round(redLut[i] * 255);
      var green = Math.round(greenLut[i] * 255);
      var blue = Math.round(blueLut[i] * 255);
      var rgba = [red, green, blue, 255];

      lut.push(rgba);
    }

    return lut;
  }

  /*
   * Return all colormaps (id and name) available
   */
  function getColormapsList() {
    var colormaps = [];
    var keys = Object.keys(colormapsData);

    keys.forEach(function(key) {
      if(colormapsData.hasOwnProperty(key)) {
        var colormap = colormapsData[key];

        colormaps.push({
          id: key,
          name: colormap.name
        });
      }
    });

    return colormaps;
  }

  function getColormap(id, colormapData) {
    var colormap = colormapsData[id];

    if(!colormap) {
      colormap = colormapsData[id] = colormapData || {
        name: '',
        colors: []
      }
    }

    if(!colormap.colors && colormap.segmentedData) {
      colormap.colors = createLinearSegmentedColormap(colormap.segmentedData, colormap.numColors, colormap.gamma);
    }

    return {
      getColorSchemeName: function(index) {
        return colormap.name;
      },

      setColorSchemeName: function(name) {
        colormap.name = name;
      },

      getNumberOfColors: function() {
        return colormap.colors.length;
      },

      setNumberOfColors: function(numColors) {
        while(colormap.colors.length < numColors) {
          colormap.colors.push(COLOR_BLACK);
        }

        colormap.colors.length = numColors;
      },

      getColor: function(index) {
        if(this.isValidIndex(index)) {
          return colormap.colors[index];
        }

        return COLOR_BLACK;
      },

      getColorRepeating: function(index) {
        var numColors = colormap.colors.length;
        index = numColors ? index % numColors : 0;

        return this.getColor(index);
      },

      setColor: function(index, rgba) {
        if(this.isValidIndex(index)) {
          colormap.colors[index] = rgba;
        }
      },

      addColor: function(rgba) {
        colormap.colors.push(rgba);
      },

      insertColor: function(index, rgba) {
        if(this.isValidIndex(index)) {
          colormap.colors.splice(index, 0, rgba);
        }
      },

      removeColor: function(index) {
        if(this.isValidIndex(index)) {
          colormap.colors.splice(index, 1);
        }
      },

      clearColors: function() {
        colormap.colors = [];
      },

      buildLookupTable: function(lut) {
        if(!lut) {
          return;
        }

        var i;
        var numColors = colormap.colors.length;

        lut.setNumberOfTableValues(numColors);

        for(i = 0; i < numColors; i++) {
          lut.setTableValue(i, colormap.colors[i]);
        }
      },

      createLookupTable: function() {
        var lut = new cornerstone.colors.LookupTable();
        this.buildLookupTable(lut);

        return lut;
      },

      isValidIndex: function(index) {
        return (index >= 0) && (index < colormap.colors.length);
      }
    }
  }

  cornerstone.colors.getColormap = getColormap;
  cornerstone.colors.getColormapsList = getColormapsList;
  
}(cornerstone));