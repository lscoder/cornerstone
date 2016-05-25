(function(cornerstone) {

    "use strict";

    var BELOW_RANGE_COLOR_INDEX = 0;
    var ABOVE_RANGE_COLOR_INDEX = 1;
    var NAN_COLOR_INDEX = 2;
    var NUMBER_OF_SPECIAL_COLORS = NAN_COLOR_INDEX + 1;

    function scalarToColor(scalar) {
        return color;
    }

    function LookupTable() {
        this.NumberOfColors = 256;
        this.Ramp = 'linear';
        this.TableRange = [0, 255];
        this.HueRange = [0, 0.66667];
        this.SaturationRange = [0, 1];
        this.ValueRange = [0, 1];
        this.AlphaRange = [1, 1];
        this.IndexedLookup = false;
        this.Table = [];


        this.setRamp = function(ramp) {
            this.Ramp = ramp;
        };

        this.setTableRange = function(start, end) {
            // Set/Get the minimum/maximum scalar values for scalar mapping. Scalar values less than minimum range value are clamped to minimum range value.
            // Scalar values greater than maximum range value are clamped to maximum range value. The TableRange values are only used when IndexedLookup is false.
            this.TableRange[0] = start;
            this.TableRange[1] = end;
        };

        this.setHueRange = function(start, end) {
            // Set the range in hue (using automatic generation). Hue ranges between [0,1].
            this.HueRange[0] = start;
            this.HueRange[1] = end;
        };

        this.setSaturationRange = function(start, end) {
            // Set the range in saturation (using automatic generation). Saturation ranges between [0,1].
            this.SaturationRange[0] = start;
            this.SaturationRange[1] = end;
        };

        this.setValueRange = function(start, end) {
            // Set the range in value (using automatic generation). Value ranges between [0,1].
            this.ValueRange[0] = start;
            this.ValueRange[1] = end;
        };

        this.setAlphaRange = function(start, end) {
            // Set the range in alpha (using automatic generation). Alpha ranges from [0,1].
            this.AlphaRange[0] = start;
            this.AlphaRange[1] = end;
        };

        this.getColor = function(scalar) {
            // Map one value through the lookup table and return the color as an
            // RGB array of doubles between 0 and 1.
            
            return this.mapValue(scalar);
        };

        this.getOpacity = function() {
            return opacity;
        };

        this.HSVToRGB = function(hue, sat, val) {
            if (hue > 1) {
                throw "HSVToRGB expects hue < 1";
            }

            var rgb = [];

            if (sat === 0) {
                rgb[0] = val;
                rgb[1] = val;
                rgb[2] = val;
                return rgb;
            }

            var hueCase = Math.floor(hue * 6);
            var frac = 6 * hue - hueCase;
            var lx = val * (1 - sat);
            var ly = val * (1 - sat * frac);
            var lz = val * (1 - sat * (1 - frac));
            
            switch (hueCase) {
                /* 0<hue<1/6 */
                case 0:
                case 6:
                    rgb[0] = val;
                    rgb[1] = lz;
                    rgb[2] = lx;
                    break;
                    /* 1/6<hue<2/6 */
                case 1:
                    rgb[0] = ly;
                    rgb[1] = val;
                    rgb[2] = lx;
                    break;
                    /* 2/6<hue<3/6 */
                case 2:
                    rgb[0] = lx;
                    rgb[1] = val;
                    rgb[2] = lz;
                    break;
                    /* 3/6<hue/4/6 */
                case 3:
                    rgb[0] = lx;
                    rgb[1] = ly;
                    rgb[2] = val;
                    break;
                    /* 4/6<hue<5/6 */
                case 4:
                    rgb[0] = lz;
                    rgb[1] = lx;
                    rgb[2] = val;
                    break;
                    /* 5/6<hue<1 */
                case 5:
                    rgb[0] = val;
                    rgb[1] = lx;
                    rgb[2] = ly;
                    break;
            }

            return rgb;
        };

        this.build = function() {
            // Clear the table
            this.Table = [];

            var maxIndex = this.NumberOfColors - 1;

            var hinc, sinc, vinc, ainc;
            if (maxIndex) {
                hinc = (this.HueRange[1] - this.HueRange[0]) / maxIndex;
                sinc = (this.SaturationRange[1] - this.SaturationRange[0]) / maxIndex;
                vinc = (this.ValueRange[1] - this.ValueRange[0]) / maxIndex;
                ainc = (this.AlphaRange[1] - this.AlphaRange[0]) / maxIndex;
            } else {
                hinc = sinc = vinc = ainc = 0.0;
            }
            
            for (var i = 0; i < this.NumberOfColors; i++) {
                var hue = this.HueRange[0] + i * hinc;
                var sat = this.SaturationRange[0] + i * sinc;
                var val = this.ValueRange[0] + i * vinc;
                var alpha = this.AlphaRange[0] + i * ainc;

                var rgb = this.HSVToRGB(hue, sat, val);                

                var c_rgba = [];
                c_rgba[0] = (127.5 * (1.0 + Math.cos((1.0 - rgb[0]) * Math.PI)));
                c_rgba[1] = (127.5 * (1.0 + Math.cos((1.0 - rgb[1]) * Math.PI)));
                c_rgba[2] = (127.5 * (1.0 + Math.cos((1.0 - rgb[2]) * Math.PI)));
                c_rgba[3] = (alpha * 255.0);

                this.Table.push(c_rgba);
            }
        };

        // Given a scalar value v, return an rgba color value from lookup table.
        this.mapValue = function(v) {
            var index = this.getIndex(v);
            if (index < 0) {
                return this.NaNColor;
            } else if (index === 0) {
                if (this.UseBelowRangeColor && v < this.TableRange[0]) {
                    return this.BelowRangeColor;
                }
            } else if (index === this.NumberOfColors - 1) {
                if (this.UseAboveRangeColor && v > this.TableRange[1]) {
                    return this.AboveRangeColor;
                }
            }

            return this.Table[index];
        };

        this.linearIndexLookupMain = function(v, p) {
            var dIndex;

            // NOTE: Added Math.floor since values were not integers? Check VTK source
            if (v < p.Range[0]) {
                dIndex = Math.floor(p.MaxIndex + BELOW_RANGE_COLOR_INDEX + 1.5);
            } else if (v > p.Range[1]) {
                dIndex = Math.floor(p.MaxIndex + ABOVE_RANGE_COLOR_INDEX + 1.5);
            } else {
                dIndex = Math.floor((v + p.Shift) * p.Scale);

                // This conditional is needed because when v is very close to
                // p.Range[1], it may map above p.MaxIndex in the linear mapping
                // above.
                dIndex = (dIndex < p.MaxIndex ? dIndex : p.MaxIndex);
            }

            return dIndex;
        };

        this.getIndex = function(v) {
            if (this.IndexedLookup) {
                return this.GetAnnotatedValueIndex(v) % this.GetNumberOfTableValues();
            }

            // First, check whether we have a number...
            if (isNaN(v)) {
                // For backwards compatibility
                return -1;
            }

            var p = {};
            p.Range = [];
            p.MaxIndex = this.NumberOfColors - 1;

            // This was LookupShiftAndScale
            p.Shift = -this.TableRange[0];
            if (this.TableRange[1] <= this.TableRange[0]) {
                p.Scale = DOUBLE_MAX;
            } else {
                p.Scale = (p.MaxIndex + 1) / (this.TableRange[1] - this.TableRange[0]);
            }

            p.Range[0] = this.TableRange[0];
            p.Range[1] = this.TableRange[1];

            // Map to an index:
            var index = this.linearIndexLookupMain(v, p);

            // For backwards compatibility, if the index indicates an
            // out-of-range value, truncate to index range for in-range colors.
            if (index === this.NumberOfColors + BELOW_RANGE_COLOR_INDEX) {
                index = 0;
            } else if (index === this.NumberOfColors + ABOVE_RANGE_COLOR_INDEX) {
                index = this.NumberOfColors - 1;
            }

            return index;
        };
    }

    // module exports
    cornerstone.colors = {};
    cornerstone.colors.scalarToColor = scalarToColor;
    cornerstone.colors.LookupTable = LookupTable;

}(cornerstone));