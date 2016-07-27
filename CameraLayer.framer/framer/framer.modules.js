require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"CameraLayer":[function(require,module,exports){
var CameraLayer,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

module.exports = CameraLayer = (function(superClass) {
  extend(CameraLayer, superClass);

  function CameraLayer(options) {
    var autoFlip, facing, fit, flipped, resolution;
    if (options == null) {
      options = {};
    }
    options = (function(clone) {
      var key, value;
      for (key in options) {
        value = options[key];
        clone[key] = value;
      }
      return clone;
    })({});
    facing = options.facing, flipped = options.flipped, autoFlip = options.autoFlip, resolution = options.resolution, fit = options.fit;
    delete options.facing;
    delete options.flipped;
    delete options.autoFlip;
    delete options.resolution;
    delete options.fit;
    CameraLayer.__super__.constructor.call(this, options);
    this._facing = facing != null ? facing : 'back';
    this._flipped = flipped != null ? flipped : false;
    this._autoFlip = autoFlip != null ? autoFlip : true;
    this._resolution = resolution != null ? resolution : 480;
    this._started = false;
    this._device = null;
    this._stream = null;
    this._scheduledRestart = null;
    this.backgroundColor = 'transparent';
    this.player.src = '';
    this.player.autoplay = true;
    this.player.muted = true;
    this.player.style.objectFit = fit != null ? fit : 'cover';
  }

  CameraLayer.define('facing', {
    get: function() {
      return this._facing;
    },
    set: function(facing) {
      this._facing = facing === 'front' ? facing : 'back';
      return this._setRestart();
    }
  });

  CameraLayer.define('flipped', {
    get: function() {
      return this._flipped;
    },
    set: function(flipped) {
      this._flipped = flipped;
      return this._setRestart();
    }
  });

  CameraLayer.define('autoFlip', {
    get: function() {
      return this._autoFlip;
    },
    set: function(autoFlip) {
      this._autoFlip = autoFlip;
      return this._setRestart();
    }
  });

  CameraLayer.define('resolution', {
    get: function() {
      return this._resolution;
    },
    set: function(resolution) {
      this._resolution = resolution;
      return this._setRestart();
    }
  });

  CameraLayer.define('fit', {
    get: function() {
      return this.player.style.objectFit;
    },
    set: function(fit) {
      return this.player.style.objectFit = fit;
    }
  });

  CameraLayer.prototype.toggleFacing = function() {
    this._facing = this._facing === 'front' ? 'back' : 'front';
    return this._setRestart();
  };

  CameraLayer.prototype.capture = function() {};

  CameraLayer.prototype.draw = function() {};

  CameraLayer.prototype.start = function() {
    return this._enumerateDevices().then((function(_this) {
      return function(devices) {
        var facing;
        devices = devices.filter(function(device) {
          return device.kind === 'videoinput';
        });
        if (devices.length === 0) {
          return;
        }
        facing = "facing " + _this._facing;
        return devices.reduce(function(current, next) {
          if (next.label.indexOf(facing) !== -1) {
            return next;
          } else {
            return current;
          }
        });
      };
    })(this)).then((function(_this) {
      return function(device) {
        var constraints, ref;
        if (!device || device.deviceId === ((ref = _this._device) != null ? ref.deviceId : void 0)) {
          return;
        }
        _this.stop();
        _this._device = device;
        constraints = {
          video: {
            mandatory: {
              minWidth: _this._resolution,
              minHeight: _this._resolution
            },
            optional: [
              {
                sourceId: _this._device.deviceId
              }
            ]
          },
          audio: false
        };
        return _this._getUserMedia(constraints).then(function(stream) {
          _this.player.src = URL.createObjectURL(stream);
          _this._started = true;
          _this._stream = stream;
          return _this._flip();
        });
      };
    })(this))["catch"](function(error) {
      return console.error(error);
    });
  };

  CameraLayer.prototype.stop = function() {
    var ref;
    this._started = false;
    this.player.pause();
    this.player.src = '';
    if ((ref = this._stream) != null) {
      ref.getTracks().forEach(function(track) {
        return track.stop();
      });
    }
    this._stream = null;
    this._device = null;
    if (this._scheduledRestart) {
      cancelAnimationFrame(this._scheduledRestart);
      return this._scheduledRestart = null;
    }
  };

  CameraLayer.prototype._setRestart = function() {
    if (!this._started || this._scheduledRestart) {
      return;
    }
    return this._scheduledRestart = requestAnimationFrame((function(_this) {
      return function() {
        _this._scheduledRestart = null;
        return _this.start();
      };
    })(this));
  };

  CameraLayer.prototype._flip = function() {
    var x;
    if (this._autoFlip) {
      this._flipped = this._facing === 'front';
    }
    x = this._flipped ? -1 : 1;
    return this.player.style.webkitTransform = "scale(" + x + ", 1)";
  };

  CameraLayer.prototype._enumerateDevices = function() {
    var error1;
    try {
      return navigator.mediaDevices.enumerateDevices();
    } catch (error1) {
      return Promise.reject();
    }
  };

  CameraLayer.prototype._getUserMedia = function(constraints) {
    return new Promise(function(resolve, reject) {
      var error1, gum;
      try {
        gum = navigator.getUserMedia || navigator.webkitGetUserMedia;
        return gum.call(navigator, constraints, resolve, reject);
      } catch (error1) {
        return reject();
      }
    });
  };

  return CameraLayer;

})(VideoLayer);


},{}]},{},[])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMva2Vpc2hpL2dpdGh1Yi9DYW1lcmFMYXllci9DYW1lcmFMYXllci5mcmFtZXIvbW9kdWxlcy9DYW1lcmFMYXllci5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQSxJQUFBLFdBQUE7RUFBQTs7O0FBQUEsTUFBTSxDQUFDLE9BQVAsR0FBdUI7OztFQUNSLHFCQUFDLE9BQUQ7QUFDWCxRQUFBOztNQURZLFVBQVU7O0lBQ3RCLE9BQUEsR0FBYSxDQUFBLFNBQUMsS0FBRDtBQUNYLFVBQUE7QUFBQSxXQUFBLGNBQUE7O1FBQUEsS0FBTSxDQUFBLEdBQUEsQ0FBTixHQUFhO0FBQWI7YUFDQTtJQUZXLENBQUEsQ0FBSCxDQUFZLEVBQVo7SUFJVCxpQkFBQSxNQUFELEVBQVMsa0JBQUEsT0FBVCxFQUFrQixtQkFBQSxRQUFsQixFQUE0QixxQkFBQSxVQUE1QixFQUF3QyxjQUFBO0lBQ3hDLE9BQU8sT0FBTyxDQUFDO0lBQ2YsT0FBTyxPQUFPLENBQUM7SUFDZixPQUFPLE9BQU8sQ0FBQztJQUNmLE9BQU8sT0FBTyxDQUFDO0lBQ2YsT0FBTyxPQUFPLENBQUM7SUFDZiw2Q0FBTSxPQUFOO0lBRUEsSUFBQyxDQUFBLE9BQUQsb0JBQVcsU0FBUztJQUNwQixJQUFDLENBQUEsUUFBRCxxQkFBWSxVQUFVO0lBQ3RCLElBQUMsQ0FBQSxTQUFELHNCQUFhLFdBQVc7SUFDeEIsSUFBQyxDQUFBLFdBQUQsd0JBQWUsYUFBYTtJQUU1QixJQUFDLENBQUEsUUFBRCxHQUFZO0lBQ1osSUFBQyxDQUFBLE9BQUQsR0FBVztJQUNYLElBQUMsQ0FBQSxPQUFELEdBQVc7SUFDWCxJQUFDLENBQUEsaUJBQUQsR0FBcUI7SUFFckIsSUFBQyxDQUFBLGVBQUQsR0FBbUI7SUFFbkIsSUFBQyxDQUFBLE1BQU0sQ0FBQyxHQUFSLEdBQWM7SUFDZCxJQUFDLENBQUEsTUFBTSxDQUFDLFFB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Q0FBUjtFQURTOzs7O0dBbkkwQiIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJtb2R1bGUuZXhwb3J0cyA9IGNsYXNzIENhbWVyYUxheWVyIGV4dGVuZHMgVmlkZW9MYXllclxuICBjb25zdHJ1Y3RvcjogKG9wdGlvbnMgPSB7fSkgLT5cbiAgICBvcHRpb25zID0gZG8gKGNsb25lID0ge30pIC0+XG4gICAgICBjbG9uZVtrZXldID0gdmFsdWUgZm9yIGtleSwgdmFsdWUgb2Ygb3B0aW9uc1xuICAgICAgY2xvbmVcblxuICAgIHtmYWNpbmcsIGZsaXBwZWQsIGF1dG9GbGlwLCByZXNvbHV0aW9uLCBmaXR9ID0gb3B0aW9uc1xuICAgIGRlbGV0ZSBvcHRpb25zLmZhY2luZ1xuICAgIGRlbGV0ZSBvcHRpb25zLmZsaXBwZWRcbiAgICBkZWxldGUgb3B0aW9ucy5hdXRvRmxpcFxuICAgIGRlbGV0ZSBvcHRpb25zLnJlc29sdXRpb25cbiAgICBkZWxldGUgb3B0aW9ucy5maXRcbiAgICBzdXBlcihvcHRpb25zKVxuXG4gICAgQF9mYWNpbmcgPSBmYWNpbmcgPyAnYmFjaydcbiAgICBAX2ZsaXBwZWQgPSBmbGlwcGVkID8gZmFsc2VcbiAgICBAX2F1dG9GbGlwID0gYXV0b0ZsaXAgPyB0cnVlXG4gICAgQF9yZXNvbHV0aW9uID0gcmVzb2x1dGlvbiA/IDQ4MFxuXG4gICAgQF9zdGFydGVkID0gZmFsc2VcbiAgICBAX2RldmljZSA9IG51bGxcbiAgICBAX3N0cmVhbSA9IG51bGxcbiAgICBAX3NjaGVkdWxlZFJlc3RhcnQgPSBudWxsXG5cbiAgICBAYmFja2dyb3VuZENvbG9yID0gJ3RyYW5zcGFyZW50J1xuXG4gICAgQHBsYXllci5zcmMgPSAnJ1xuICAgIEBwbGF5ZXIuYXV0b3BsYXkgPSB0cnVlXG4gICAgQHBsYXllci5tdXRlZCA9IHRydWVcbiAgICBAcGxheWVyLnN0eWxlLm9iamVjdEZpdCA9IGZpdCA/ICdjb3ZlcidcblxuICBAZGVmaW5lICdmYWNpbmcnLFxuICAgIGdldDogLT4gQF9mYWNpbmdcbiAgICBzZXQ6IChmYWNpbmcpIC0+XG4gICAgICBAX2ZhY2luZyA9IGlmIGZhY2luZyA9PSAnZnJvbnQnIHRoZW4gZmFjaW5nIGVsc2UgJ2JhY2snXG4gICAgICBAX3NldFJlc3RhcnQoKVxuXG4gIEBkZWZpbmUgJ2ZsaXBwZWQnLFxuICAgIGdldDogLT4gQF9mbGlwcGVkXG4gICAgc2V0OiAoZmxpcHBlZCkgLT5cbiAgICAgIEBfZmxpcHBlZCA9IGZsaXBwZWRcbiAgICAgIEBfc2V0UmVzdGFydCgpXG5cbiAgQGRlZmluZSAnYXV0b0ZsaXAnLFxuICAgIGdldDogLT4gQF9hdXRvRmxpcFxuICAgIHNldDogKGF1dG9GbGlwKSAtPlxuICAgICAgQF9hdXRvRmxpcCA9IGF1dG9GbGlwXG4gICAgICBAX3NldFJlc3RhcnQoKVxuXG4gIEBkZWZpbmUgJ3Jlc29sdXRpb24nLFxuICAgIGdldDogLT4gQF9yZXNvbHV0aW9uXG4gICAgc2V0OiAocmVzb2x1dGlvbikgLT5cbiAgICAgIEBfcmVzb2x1dGlvbiA9IHJlc29sdXRpb25cbiAgICAgIEBfc2V0UmVzdGFydCgpXG5cbiAgQGRlZmluZSAnZml0JyxcbiAgICBnZXQ6IC0+IEBwbGF5ZXIuc3R5bGUub2JqZWN0Rml0XG4gICAgc2V0OiAoZml0KSAtPiBAcGxheWVyLnN0eWxlLm9iamVjdEZpdCA9IGZpdFxuXG4gIHRvZ2dsZUZhY2luZzogLT5cbiAgICBAX2ZhY2luZyA9IGlmIEBfZmFjaW5nID09ICdmcm9udCcgdGhlbiAnYmFjaycgZWxzZSAnZnJvbnQnXG4gICAgQF9zZXRSZXN0YXJ0KClcblxuICBjYXB0dXJlOiAtPlxuXG4gIGRyYXc6IC0+XG5cbiAgc3RhcnQ6IC0+XG4gICAgQF9lbnVtZXJhdGVEZXZpY2VzKClcbiAgICAudGhlbiAoZGV2aWNlcykgPT5cbiAgICAgIGRldmljZXMgPSBkZXZpY2VzLmZpbHRlciAoZGV2aWNlKSAtPiBkZXZpY2Uua2luZCA9PSAndmlkZW9pbnB1dCdcbiAgICAgIHJldHVybiBpZiBkZXZpY2VzLmxlbmd0aCA9PSAwXG5cbiAgICAgIGZhY2luZyA9IFwiZmFjaW5nICN7QF9mYWNpbmd9XCJcbiAgICAgIGRldmljZXMucmVkdWNlIChjdXJyZW50LCBuZXh0KSAtPlxuICAgICAgICBpZiBuZXh0LmxhYmVsLmluZGV4T2YoZmFjaW5nKSAhPSAtMSB0aGVuIG5leHQgZWxzZSBjdXJyZW50XG5cbiAgICAudGhlbiAoZGV2aWNlKSA9PlxuICAgICAgcmV0dXJuIGlmICFkZXZpY2UgfHwgZGV2aWNlLmRldmljZUlkID09IEBfZGV2aWNlPy5kZXZpY2VJZFxuXG4gICAgICBAc3RvcCgpXG4gICAgICBAX2RldmljZSA9IGRldmljZVxuXG4gICAgICBjb25zdHJhaW50cyA9XG4gICAgICAgIHZpZGVvOlxuICAgICAgICAgIG1hbmRhdG9yeToge21pbldpZHRoOiBAX3Jlc29sdXRpb24sIG1pbkhlaWdodDogQF9yZXNvbHV0aW9ufVxuICAgICAgICAgIG9wdGlvbmFsOiBbe3NvdXJjZUlkOiBAX2RldmljZS5kZXZpY2VJZH1dXG4gICAgICAgIGF1ZGlvOlxuICAgICAgICAgIGZhbHNlXG5cbiAgICAgIEBfZ2V0VXNlck1lZGlhKGNvbnN0cmFpbnRzKS50aGVuIChzdHJlYW0pID0+XG4gICAgICAgIEBwbGF5ZXIuc3JjID0gVVJMLmNyZWF0ZU9iamVjdFVSTChzdHJlYW0pXG4gICAgICAgIEBfc3RhcnRlZCA9IHRydWVcbiAgICAgICAgQF9zdHJlYW0gPSBzdHJlYW1cbiAgICAgICAgQF9mbGlwKClcblxuICAgIC5jYXRjaCAoZXJyb3IpIC0+XG4gICAgICBjb25zb2xlLmVycm9yKGVycm9yKVxuXG4gIHN0b3A6IC0+XG4gICAgQF9zdGFydGVkID0gZmFsc2VcblxuICAgIEBwbGF5ZXIucGF1c2UoKVxuICAgIEBwbGF5ZXIuc3JjID0gJydcblxuICAgIEBfc3RyZWFtPy5nZXRUcmFja3MoKS5mb3JFYWNoICh0cmFjaykgLT4gdHJhY2suc3RvcCgpXG4gICAgQF9zdHJlYW0gPSBudWxsXG4gICAgQF9kZXZpY2UgPSBudWxsXG5cbiAgICBpZiBAX3NjaGVkdWxlZFJlc3RhcnRcbiAgICAgIGNhbmNlbEFuaW1hdGlvbkZyYW1lKEBfc2NoZWR1bGVkUmVzdGFydClcbiAgICAgIEBfc2NoZWR1bGVkUmVzdGFydCA9IG51bGxcblxuICBfc2V0UmVzdGFydDogLT5cbiAgICByZXR1cm4gaWYgIUBfc3RhcnRlZCB8fCBAX3NjaGVkdWxlZFJlc3RhcnRcblxuICAgIEBfc2NoZWR1bGVkUmVzdGFydCA9IHJlcXVlc3RBbmltYXRpb25GcmFtZSA9PlxuICAgICAgQF9zY2hlZHVsZWRSZXN0YXJ0ID0gbnVsbFxuICAgICAgQHN0YXJ0KClcblxuICBfZmxpcDogLT5cbiAgICBAX2ZsaXBwZWQgPSBAX2ZhY2luZyA9PSAnZnJvbnQnIGlmIEBfYXV0b0ZsaXBcbiAgICB4ID0gaWYgQF9mbGlwcGVkIHRoZW4gLTEgZWxzZSAxXG4gICAgQHBsYXllci5zdHlsZS53ZWJraXRUcmFuc2Zvcm0gPSBcInNjYWxlKCN7eH0sIDEpXCJcblxuICBfZW51bWVyYXRlRGV2aWNlczogLT5cbiAgICB0cnlcbiAgICAgIG5hdmlnYXRvci5tZWRpYURldmljZXMuZW51bWVyYXRlRGV2aWNlcygpXG4gICAgY2F0Y2hcbiAgICAgIFByb21pc2UucmVqZWN0KClcblxuICBfZ2V0VXNlck1lZGlhOiAoY29uc3RyYWludHMpIC0+XG4gICAgbmV3IFByb21pc2UgKHJlc29sdmUsIHJlamVjdCkgLT5cbiAgICAgIHRyeVxuICAgICAgICBndW0gPSBuYXZpZ2F0b3IuZ2V0VXNlck1lZGlhIHx8IG5hdmlnYXRvci53ZWJraXRHZXRVc2VyTWVkaWFcbiAgICAgICAgZ3VtLmNhbGwobmF2aWdhdG9yLCBjb25zdHJhaW50cywgcmVzb2x2ZSwgcmVqZWN0KVxuICAgICAgY2F0Y2hcbiAgICAgICAgcmVqZWN0KClcbiJdfQ==
