require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"CameraLayer":[function(require,module,exports){
var CameraLayer,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

module.exports = CameraLayer = (function(superClass) {
  extend(CameraLayer, superClass);

  function CameraLayer(options) {
    var baseOptions, customProps, ref, ref1, ref2, ref3, ref4;
    if (options == null) {
      options = {};
    }
    customProps = {
      facing: true,
      flipped: true,
      autoFlip: true,
      resolution: true,
      fit: true
    };
    baseOptions = Object.keys(options).filter(function(key) {
      return !customProps[key];
    }).reduce(function(clone, key) {
      clone[key] = options[key];
      return clone;
    }, {});
    CameraLayer.__super__.constructor.call(this, baseOptions);
    this._facing = (ref = options.facing) != null ? ref : 'back';
    this._flipped = (ref1 = options.flipped) != null ? ref1 : false;
    this._autoFlip = (ref2 = options.autoFlip) != null ? ref2 : true;
    this._resolution = (ref3 = options.resolution) != null ? ref3 : 480;
    this._started = false;
    this._device = null;
    this._matchedFacing = 'unknown';
    this._stream = null;
    this._scheduledRestart = null;
    this.backgroundColor = 'transparent';
    this.player.src = '';
    this.player.autoplay = true;
    this.player.muted = true;
    this.player.style.objectFit = (ref4 = options.fit) != null ? ref4 : 'cover';
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
        var device, i, len;
        devices = devices.filter(function(device) {
          return device.kind === 'videoinput';
        });
        if (devices.length === 0) {
          return;
        }
        for (i = 0, len = devices.length; i < len; i++) {
          device = devices[i];
          if (device.label.indexOf(_this._facing) !== -1) {
            _this._matchedFacing = _this._facing;
            return device;
          }
        }
        _this._matchedFacing = 'unknown';
        return devices[0];
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
      this._flipped = this._matchedFacing === 'front';
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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvMjI3MTQ3NzEvZ2l0aHViL0NhbWVyYUxheWVyL0NhbWVyYUxheWVyLmZyYW1lci9tb2R1bGVzL0NhbWVyYUxheWVyLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBLElBQUEsV0FBQTtFQUFBOzs7QUFBQSxNQUFNLENBQUMsT0FBUCxHQUF1Qjs7O0VBQ1IscUJBQUMsT0FBRDtBQUNYLFFBQUE7O01BRFksVUFBVTs7SUFDdEIsV0FBQSxHQUNFO01BQUEsTUFBQSxFQUFRLElBQVI7TUFDQSxPQUFBLEVBQVMsSUFEVDtNQUVBLFFBQUEsRUFBVSxJQUZWO01BR0EsVUFBQSxFQUFZLElBSFo7TUFJQSxHQUFBLEVBQUssSUFKTDs7SUFNRixXQUFBLEdBQWMsTUFBTSxDQUFDLElBQVAsQ0FBWSxPQUFaLENBQ1osQ0FBQyxNQURXLENBQ0osU0FBQyxHQUFEO2FBQVMsQ0FBQyxXQUFZLENBQUEsR0FBQTtJQUF0QixDQURJLENBRVosQ0FBQyxNQUZXLENBRUosU0FBQyxLQUFELEVBQVEsR0FBUjtNQUNOLEtBQU0sQ0FBQSxHQUFBLENBQU4sR0FBYSxPQUFRLENBQUEsR0FBQTthQUNyQjtJQUZNLENBRkksRUFLVixFQUxVO0lBT2QsNkNBQU0sV0FBTjtJQUVBLElBQUMsQ0FBQSxPQUFELDBDQUE0QjtJQUM1QixJQUFDLENBQUEsUUFBRCw2Q0FBOEI7SUFDOUIsSUFBQyxDQUFBLFNBQUQsOENBQWdDO0lBQ2hDLElBQUMsQ0FBQSxXQUFELGdEQUFvQztJQUVwQyxJQUFDLENBQUEsUUFBRCxHQUFZO0lBQ1osSUFBQyxDQUFBLE9BQUQsR0FBVztJQUNYLElBQUMsQ0FBQSxjQUFELEdBQWtCO0lBQ2xCLElBQUMsQ0FBQSxPQUFELEdBQVc7SUFDWCxJQUFDLENBQUEsaUJBQUQsR0FBcUI7SUFFckIsSUFBQyxDQUFBLGVBQUQsR0FBbUI7SUFFbkIsSUFBQyxDQUFBLE1B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QUExQyxFQUZGO09BQUEsY0FBQTtlQUlFLE1BQUEsQ0FBQSxFQUpGOztJQURVLENBQVI7RUFEUzs7OztHQTVJMEIiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwibW9kdWxlLmV4cG9ydHMgPSBjbGFzcyBDYW1lcmFMYXllciBleHRlbmRzIFZpZGVvTGF5ZXJcbiAgY29uc3RydWN0b3I6IChvcHRpb25zID0ge30pIC0+XG4gICAgY3VzdG9tUHJvcHMgPVxuICAgICAgZmFjaW5nOiB0cnVlXG4gICAgICBmbGlwcGVkOiB0cnVlXG4gICAgICBhdXRvRmxpcDogdHJ1ZVxuICAgICAgcmVzb2x1dGlvbjogdHJ1ZVxuICAgICAgZml0OiB0cnVlXG5cbiAgICBiYXNlT3B0aW9ucyA9IE9iamVjdC5rZXlzKG9wdGlvbnMpXG4gICAgICAuZmlsdGVyIChrZXkpIC0+ICFjdXN0b21Qcm9wc1trZXldXG4gICAgICAucmVkdWNlIChjbG9uZSwga2V5KSAtPlxuICAgICAgICBjbG9uZVtrZXldID0gb3B0aW9uc1trZXldXG4gICAgICAgIGNsb25lXG4gICAgICAsIHt9XG5cbiAgICBzdXBlcihiYXNlT3B0aW9ucylcblxuICAgIEBfZmFjaW5nID0gb3B0aW9ucy5mYWNpbmcgPyAnYmFjaydcbiAgICBAX2ZsaXBwZWQgPSBvcHRpb25zLmZsaXBwZWQgPyBmYWxzZVxuICAgIEBfYXV0b0ZsaXAgPSBvcHRpb25zLmF1dG9GbGlwID8gdHJ1ZVxuICAgIEBfcmVzb2x1dGlvbiA9IG9wdGlvbnMucmVzb2x1dGlvbiA/IDQ4MFxuXG4gICAgQF9zdGFydGVkID0gZmFsc2VcbiAgICBAX2RldmljZSA9IG51bGxcbiAgICBAX21hdGNoZWRGYWNpbmcgPSAndW5rbm93bidcbiAgICBAX3N0cmVhbSA9IG51bGxcbiAgICBAX3NjaGVkdWxlZFJlc3RhcnQgPSBudWxsXG5cbiAgICBAYmFja2dyb3VuZENvbG9yID0gJ3RyYW5zcGFyZW50J1xuXG4gICAgQHBsYXllci5zcmMgPSAnJ1xuICAgIEBwbGF5ZXIuYXV0b3BsYXkgPSB0cnVlXG4gICAgQHBsYXllci5tdXRlZCA9IHRydWVcbiAgICBAcGxheWVyLnN0eWxlLm9iamVjdEZpdCA9IG9wdGlvbnMuZml0ID8gJ2NvdmVyJ1xuXG4gIEBkZWZpbmUgJ2ZhY2luZycsXG4gICAgZ2V0OiAtPiBAX2ZhY2luZ1xuICAgIHNldDogKGZhY2luZykgLT5cbiAgICAgIEBfZmFjaW5nID0gaWYgZmFjaW5nID09ICdmcm9udCcgdGhlbiBmYWNpbmcgZWxzZSAnYmFjaydcbiAgICAgIEBfc2V0UmVzdGFydCgpXG5cbiAgQGRlZmluZSAnZmxpcHBlZCcsXG4gICAgZ2V0OiAtPiBAX2ZsaXBwZWRcbiAgICBzZXQ6IChmbGlwcGVkKSAtPlxuICAgICAgQF9mbGlwcGVkID0gZmxpcHBlZFxuICAgICAgQF9zZXRSZXN0YXJ0KClcblxuICBAZGVmaW5lICdhdXRvRmxpcCcsXG4gICAgZ2V0OiAtPiBAX2F1dG9GbGlwXG4gICAgc2V0OiAoYXV0b0ZsaXApIC0+XG4gICAgICBAX2F1dG9GbGlwID0gYXV0b0ZsaXBcbiAgICAgIEBfc2V0UmVzdGFydCgpXG5cbiAgQGRlZmluZSAncmVzb2x1dGlvbicsXG4gICAgZ2V0OiAtPiBAX3Jlc29sdXRpb25cbiAgICBzZXQ6IChyZXNvbHV0aW9uKSAtPlxuICAgICAgQF9yZXNvbHV0aW9uID0gcmVzb2x1dGlvblxuICAgICAgQF9zZXRSZXN0YXJ0KClcblxuICBAZGVmaW5lICdmaXQnLFxuICAgIGdldDogLT4gQHBsYXllci5zdHlsZS5vYmplY3RGaXRcbiAgICBzZXQ6IChmaXQpIC0+IEBwbGF5ZXIuc3R5bGUub2JqZWN0Rml0ID0gZml0XG5cbiAgdG9nZ2xlRmFjaW5nOiAtPlxuICAgIEBfZmFjaW5nID0gaWYgQF9mYWNpbmcgPT0gJ2Zyb250JyB0aGVuICdiYWNrJyBlbHNlICdmcm9udCdcbiAgICBAX3NldFJlc3RhcnQoKVxuXG4gIGNhcHR1cmU6IC0+XG5cbiAgZHJhdzogLT5cblxuICBzdGFydDogLT5cbiAgICBAX2VudW1lcmF0ZURldmljZXMoKVxuICAgIC50aGVuIChkZXZpY2VzKSA9PlxuICAgICAgZGV2aWNlcyA9IGRldmljZXMuZmlsdGVyIChkZXZpY2UpIC0+IGRldmljZS5raW5kID09ICd2aWRlb2lucHV0J1xuICAgICAgcmV0dXJuIGlmIGRldmljZXMubGVuZ3RoID09IDBcblxuICAgICAgZm9yIGRldmljZSBpbiBkZXZpY2VzXG4gICAgICAgIGlmIGRldmljZS5sYWJlbC5pbmRleE9mKEBfZmFjaW5nKSAhPSAtMVxuICAgICAgICAgIEBfbWF0Y2hlZEZhY2luZyA9IEBfZmFjaW5nXG4gICAgICAgICAgcmV0dXJuIGRldmljZVxuXG4gICAgICBAX21hdGNoZWRGYWNpbmcgPSAndW5rbm93bidcbiAgICAgIGRldmljZXNbMF1cblxuICAgIC50aGVuIChkZXZpY2UpID0+XG4gICAgICByZXR1cm4gaWYgIWRldmljZSB8fCBkZXZpY2UuZGV2aWNlSWQgPT0gQF9kZXZpY2U/LmRldmljZUlkXG5cbiAgICAgIEBzdG9wKClcbiAgICAgIEBfZGV2aWNlID0gZGV2aWNlXG5cbiAgICAgIGNvbnN0cmFpbnRzID1cbiAgICAgICAgdmlkZW86XG4gICAgICAgICAgbWFuZGF0b3J5OiB7bWluV2lkdGg6IEBfcmVzb2x1dGlvbiwgbWluSGVpZ2h0OiBAX3Jlc29sdXRpb259XG4gICAgICAgICAgb3B0aW9uYWw6IFt7c291cmNlSWQ6IEBfZGV2aWNlLmRldmljZUlkfV1cbiAgICAgICAgYXVkaW86XG4gICAgICAgICAgZmFsc2VcblxuICAgICAgQF9nZXRVc2VyTWVkaWEoY29uc3RyYWludHMpLnRoZW4gKHN0cmVhbSkgPT5cbiAgICAgICAgQHBsYXllci5zcmMgPSBVUkwuY3JlYXRlT2JqZWN0VVJMKHN0cmVhbSlcbiAgICAgICAgQF9zdGFydGVkID0gdHJ1ZVxuICAgICAgICBAX3N0cmVhbSA9IHN0cmVhbVxuICAgICAgICBAX2ZsaXAoKVxuXG4gICAgLmNhdGNoIChlcnJvcikgLT5cbiAgICAgIGNvbnNvbGUuZXJyb3IoZXJyb3IpXG5cbiAgc3RvcDogLT5cbiAgICBAX3N0YXJ0ZWQgPSBmYWxzZVxuXG4gICAgQHBsYXllci5wYXVzZSgpXG4gICAgQHBsYXllci5zcmMgPSAnJ1xuXG4gICAgQF9zdHJlYW0/LmdldFRyYWNrcygpLmZvckVhY2ggKHRyYWNrKSAtPiB0cmFjay5zdG9wKClcbiAgICBAX3N0cmVhbSA9IG51bGxcbiAgICBAX2RldmljZSA9IG51bGxcblxuICAgIGlmIEBfc2NoZWR1bGVkUmVzdGFydFxuICAgICAgY2FuY2VsQW5pbWF0aW9uRnJhbWUoQF9zY2hlZHVsZWRSZXN0YXJ0KVxuICAgICAgQF9zY2hlZHVsZWRSZXN0YXJ0ID0gbnVsbFxuXG4gIF9zZXRSZXN0YXJ0OiAtPlxuICAgIHJldHVybiBpZiAhQF9zdGFydGVkIHx8IEBfc2NoZWR1bGVkUmVzdGFydFxuXG4gICAgQF9zY2hlZHVsZWRSZXN0YXJ0ID0gcmVxdWVzdEFuaW1hdGlvbkZyYW1lID0+XG4gICAgICBAX3NjaGVkdWxlZFJlc3RhcnQgPSBudWxsXG4gICAgICBAc3RhcnQoKVxuXG4gIF9mbGlwOiAtPlxuICAgIEBfZmxpcHBlZCA9IEBfbWF0Y2hlZEZhY2luZyA9PSAnZnJvbnQnIGlmIEBfYXV0b0ZsaXBcbiAgICB4ID0gaWYgQF9mbGlwcGVkIHRoZW4gLTEgZWxzZSAxXG4gICAgQHBsYXllci5zdHlsZS53ZWJraXRUcmFuc2Zvcm0gPSBcInNjYWxlKCN7eH0sIDEpXCJcblxuICBfZW51bWVyYXRlRGV2aWNlczogLT5cbiAgICB0cnlcbiAgICAgIG5hdmlnYXRvci5tZWRpYURldmljZXMuZW51bWVyYXRlRGV2aWNlcygpXG4gICAgY2F0Y2hcbiAgICAgIFByb21pc2UucmVqZWN0KClcblxuICBfZ2V0VXNlck1lZGlhOiAoY29uc3RyYWludHMpIC0+XG4gICAgbmV3IFByb21pc2UgKHJlc29sdmUsIHJlamVjdCkgLT5cbiAgICAgIHRyeVxuICAgICAgICBndW0gPSBuYXZpZ2F0b3IuZ2V0VXNlck1lZGlhIHx8IG5hdmlnYXRvci53ZWJraXRHZXRVc2VyTWVkaWFcbiAgICAgICAgZ3VtLmNhbGwobmF2aWdhdG9yLCBjb25zdHJhaW50cywgcmVzb2x2ZSwgcmVqZWN0KVxuICAgICAgY2F0Y2hcbiAgICAgICAgcmVqZWN0KClcbiJdfQ==
