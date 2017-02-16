
  LCL.prototype.color = {

    // converts hex to RGB
    hexToRGB: function(hex) {
      var rgb = [];

      hex = hex.substr(1);

      // converts #abc to #aabbcc
      if (hex.length === 3) {
        hex = hex.replace(/(.)/g, '$1$1');
      }

      hex.replace(/../g, function(color){
        rgb.push(parseInt(color, 0x10));
      });

      return {
        r: rgb[0],
        g: rgb[1],
        b: rgb[2],
        rgb: "rgb(" + rgb.join(",") + ")"
      };
    },

    // converts rgb to HSL
    rgbToHSL: function(r, g, b) {
      r /= 255, g /= 255, b /= 255;
      var max = Math.max(r, g, b),
        min = Math.min(r, g, b);
      var h, s, l = (max + min) / 2;

      if(max == min){
        h = s = 0; // achromatic
      }else{
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch(max){
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
        }
        h /= 6;
      }

      return {
        h: h,
        s: s,
        l: l,
        hsl: "hsl(" + h * 360 + ', ' + s * 100 + '%' + ', ' + l * 100 + '%' + ")"
      };
    },

    // converts hsl to RGB
    hslToRGB: function() {
    },

    // color lighten
    lighten: function(color, percent) {
      var hsl, h, s, l, rgba, a;
      if(!color || !percent || !/^[0-9]{1,2}%$/.test(percent)) {
        return;
      }
      if(this.isRgba(color)) {
        rgba = this.getRgba(color);
        a = +rgba.a - +( percent.slice(0, -1) / 100 );
        return 'rgba(' + rgba.r + ', ' + rgba.g + ', ' + rgba.b + ', ' + a + ')';
      } else {
        hsl = this.getHsl(color);
        h = +hsl.h;
        s = +hsl.s;
        l = +hsl.l * 100 + +percent.slice(0, -1);

        return "hsl(" + h * 360 + ', ' + s * 100 + '%' + ', ' + l + '%' + ")";
      }
    },

    // color darken
    darken: function(color, percent) {
      var hsl, h, s, l, rgba, a;
      if(!color || !percent || !/^[0-9]{1,2}%$/.test(percent)) {
        return;
      }
      if(this.isRgba(color)) {
        rgba = this.getRgba(color);
        a = +rgba.a + +( percent.slice(0, -1) / 100 );
        return 'rgba(' + rgba.r + ', ' + rgba.g + ', ' + rgba.b + ', ' + a + ')';
      } else {
        hsl = this.getHsl(color);
        h = +hsl.h;
        s = +hsl.s;
        l = +hsl.l * 100 - +percent.slice(0, -1);

        return "hsl(" + h * 360 + ', ' + s * 100 + '%' + ', ' + l + '%' + ")";
      }
    },

    isHex: function(color) {
      return /^#[a-fA-F0-9]{3}$|#[a-fA-F0-9]{6}$/.test(color);
    },

    isRgb: function(color) {
      return /^rgb\((\s*[0-5]{0,3}\s*,?){3}\)$/.test(color);
    },

    isRgba: function(color) {
      return /^rgba\((\s*[0-5]{0,3}\s*,?){3}[0-9.\s]*\)$/.test(color);
    },

    getRgb: function(color) {
      var rgb, r, g, b;
      if(this.isHex(color)) {
        rgb = this.hexToRGB(color);
        r = rgb.r;
        g = rgb.g;
        b = rgb.b;
      } else if(this.isRgb(color)) {
        rgb = color.slice(4, -1).split(',');
        r = rgb[0],
        g = rgb[1],
        b = rgb[2];
      }
      return {
        r: r,
        g: g,
        b: b
      };
    },

    getRgba: function(color) {
      var rgba, r, g, b, a;
      rgba = color.slice(5, -1).split(',');
      r = rgba[0];
      g = rgba[1];
      b = rgba[2];
      a = rgba[3];

      return {
        r: r,
        g: g,
        b: b,
        a: a
      };
    },

    getHsl: function(color) {
      var hsl, rgb, r, g, b, h, s, l;
      rgb = this.getRgb(color);
      r = rgb.r;
      g = rgb.g;
      b = rgb.b;

      hsl = this.rgbToHSL(r, g, b);
      h = hsl.h;
      s = hsl.s;
      l = hsl.l;
      return {
        h: h,
        s: s,
        l: l
      };
    }

  };