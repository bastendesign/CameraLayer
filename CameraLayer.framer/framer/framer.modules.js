require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"CameraLayer":[function(require,module,exports){
var CameraLayer,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

module.exports = CameraLayer = (function(superClass) {
  extend(CameraLayer, superClass);

  function CameraLayer(options) {
    var autoflip, facing;
    if (options == null) {
      options = {};
    }
    options = Object.assign({}, options);
    autoflip = options.autoflip, facing = options.facing;
    delete options.autoflip;
    delete options.facing;
    CameraLayer.__super__.constructor.call(this, options);
    this._deviceId = null;
    this._stream = null;
    this._autoflip = autoflip != null ? autoflip : true;
    this._facing = facing != null ? facing : 'back';
    this.backgroundColor = 'transparent';
    this.player.autoplay = true;
    this.player.muted = true;
    this.player.style.objectFit = 'cover';
  }

  CameraLayer.define('facing', {
    get: function() {
      return this._facing;
    },
    set: function(facing) {
      this._facing = facing === 'front' ? facing : 'back';
      return this.start();
    }
  });

  CameraLayer.define('autoflip', {
    get: function() {
      return this._autoflip;
    },
    set: function(autoflip) {
      return this._autoflip = !!autoflip;
    }
  });

  CameraLayer.prototype.toggleFacing = function() {
    this._facing = this._facing === 'front' ? 'back' : 'front';
    return this.start();
  };

  CameraLayer.prototype.capture = function() {};

  CameraLayer.prototype.draw = function() {};

  CameraLayer.prototype.start = function() {
    return this._enumerateDevices().then((function(_this) {
      return function(devices) {
        var camera, facing, ref;
        facing = "facing " + _this._facing;
        camera = devices.filter(function(device) {
          return device.kind === 'videoinput';
        }).reduce(function(current, next) {
          if (next.label.indexOf(facing) !== -1) {
            return next;
          } else {
            return current;
          }
        });
        if ((camera != null ? camera.deviceId : void 0) !== _this._deviceId) {
          if ((ref = _this._stream) != null) {
            ref.getTracks().forEach(function(track) {
              return track.stop();
            });
          }
          _this._deviceId = camera.deviceId;
          return _this._getUserMedia({
            audio: false,
            video: {
              optional: [
                {
                  sourceId: _this._deviceId
                }
              ]
            }
          });
        } else {
          return Promise.reject();
        }
      };
    })(this)).then((function(_this) {
      return function(stream) {
        _this.player.src = URL.createObjectURL(stream);
        _this._stream = stream;
        return _this._autoflip && _this._flip();
      };
    })(this))["catch"](function(error) {
      return console.error(error);
    });
  };

  CameraLayer.prototype._flip = function() {
    var x;
    x = this._facing === 'front' ? -1 : 1;
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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMva2Vpc2hpL2dpdGh1Yi9DYW1lcmFMYXllci9DYW1lcmFMYXllci5mcmFtZXIvbW9kdWxlcy9DYW1lcmFMYXllci5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQSxJQUFBLFdBQUE7RUFBQTs7O0FBQUEsTUFBTSxDQUFDLE9BQVAsR0FBdUI7OztFQUNSLHFCQUFDLE9BQUQ7QUFDWCxRQUFBOztNQURZLFVBQVU7O0lBQ3RCLE9BQUEsR0FBVSxNQUFNLENBQUMsTUFBUCxDQUFjLEVBQWQsRUFBa0IsT0FBbEI7SUFFVCxtQkFBQSxRQUFELEVBQVcsaUJBQUE7SUFDWCxPQUFPLE9BQU8sQ0FBQztJQUNmLE9BQU8sT0FBTyxDQUFDO0lBRWYsNkNBQU0sT0FBTjtJQUVBLElBQUMsQ0FBQSxTQUFELEdBQWE7SUFDYixJQUFDLENBQUEsT0FBRCxHQUFXO0lBQ1gsSUFBQyxDQUFBLFNBQUQsc0JBQWEsV0FBVztJQUN4QixJQUFDLENBQUEsT0FBRCxvQkFBVyxTQUFTO0lBRXBCLElBQUMsQ0FBQSxlQUFELEdBQW1CO0lBRW5CLElBQUMsQ0FBQSxNQUFNLENBQUMsUUFBUixHQUFtQjtJQUNuQixJQUFDLENBQUEsTUFBTSxDQUFDLEtBQVIsR0FBZ0I7SUFDaEIsSUFBQyxDQUFBLE1BQU0sQ0FBQyxLQUFLLENBQUMsU0FBZCxHQUEwQjtFQWxCZjs7RUFvQmIsV0FBQyxDQUFBLE1BQUQsQ0FBUSxRQUFSLEVBQ0U7SUFBQSxHQUFBLEVBQUssU0FBQTthQUFHLElBQUMsQ0FBQTtJQUFKLENBQUw7SUFDQSxHQUFBLEVBQUssU0FBQyxNQUFEO01BQ0gsSUFBQyxDQUFBLE9BQUQsR0FBYyxNQUFBLEtBQVUsT0FBYixHQUEwQixNQUExQixHQUFzQzthQUNqRCxJQUFDLENBQUEsS0FBRCxDQUFBO0lBRkcsQ0FETDtHQURGOztFQU1BLFdBQUMsQ0FBQSxNQUFELENBQVEsVUFB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U0FBUyxDQUFDO2VBQzFDLEdBQUcsQ0FBQyxJQUFKLENBQVMsU0FBVCxFQUFvQixXQUFwQixFQUFpQyxPQUFqQyxFQUEwQyxNQUExQyxFQUZGO09BQUEsY0FBQTtlQUlFLE1BQUEsQ0FBQSxFQUpGOztJQURVLENBQVI7RUFEUzs7OztHQTFFMEIiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwibW9kdWxlLmV4cG9ydHMgPSBjbGFzcyBDYW1lcmFMYXllciBleHRlbmRzIFZpZGVvTGF5ZXJcbiAgY29uc3RydWN0b3I6IChvcHRpb25zID0ge30pIC0+XG4gICAgb3B0aW9ucyA9IE9iamVjdC5hc3NpZ24oe30sIG9wdGlvbnMpXG5cbiAgICB7YXV0b2ZsaXAsIGZhY2luZ30gPSBvcHRpb25zXG4gICAgZGVsZXRlIG9wdGlvbnMuYXV0b2ZsaXBcbiAgICBkZWxldGUgb3B0aW9ucy5mYWNpbmdcblxuICAgIHN1cGVyKG9wdGlvbnMpXG5cbiAgICBAX2RldmljZUlkID0gbnVsbFxuICAgIEBfc3RyZWFtID0gbnVsbFxuICAgIEBfYXV0b2ZsaXAgPSBhdXRvZmxpcCA/IHRydWVcbiAgICBAX2ZhY2luZyA9IGZhY2luZyA/ICdiYWNrJ1xuXG4gICAgQGJhY2tncm91bmRDb2xvciA9ICd0cmFuc3BhcmVudCdcblxuICAgIEBwbGF5ZXIuYXV0b3BsYXkgPSB0cnVlXG4gICAgQHBsYXllci5tdXRlZCA9IHRydWVcbiAgICBAcGxheWVyLnN0eWxlLm9iamVjdEZpdCA9ICdjb3ZlcidcblxuICBAZGVmaW5lICdmYWNpbmcnLFxuICAgIGdldDogLT4gQF9mYWNpbmdcbiAgICBzZXQ6IChmYWNpbmcpIC0+XG4gICAgICBAX2ZhY2luZyA9IGlmIGZhY2luZyA9PSAnZnJvbnQnIHRoZW4gZmFjaW5nIGVsc2UgJ2JhY2snXG4gICAgICBAc3RhcnQoKVxuXG4gIEBkZWZpbmUgJ2F1dG9mbGlwJyxcbiAgICBnZXQ6IC0+IEBfYXV0b2ZsaXBcbiAgICBzZXQ6IChhdXRvZmxpcCkgLT4gQF9hdXRvZmxpcCA9ICEhYXV0b2ZsaXBcblxuICB0b2dnbGVGYWNpbmc6IC0+XG4gICAgQF9mYWNpbmcgPSBpZiBAX2ZhY2luZyA9PSAnZnJvbnQnIHRoZW4gJ2JhY2snIGVsc2UgJ2Zyb250J1xuICAgIEBzdGFydCgpXG5cbiAgY2FwdHVyZTogLT5cblxuICBkcmF3OiAtPlxuXG4gIHN0YXJ0OiAtPlxuICAgIEBfZW51bWVyYXRlRGV2aWNlcygpXG4gICAgLnRoZW4gKGRldmljZXMpID0+XG4gICAgICBmYWNpbmcgPSBcImZhY2luZyAje0BfZmFjaW5nfVwiXG4gICAgICBjYW1lcmEgPSBkZXZpY2VzXG4gICAgICAgIC5maWx0ZXIgKGRldmljZSkgPT4gZGV2aWNlLmtpbmQgPT0gJ3ZpZGVvaW5wdXQnXG4gICAgICAgIC5yZWR1Y2UgKGN1cnJlbnQsIG5leHQpID0+XG4gICAgICAgICAgaWYgbmV4dC5sYWJlbC5pbmRleE9mKGZhY2luZykgIT0gLTEgdGhlbiBuZXh0IGVsc2UgY3VycmVudFxuXG4gICAgICBpZiBjYW1lcmE/LmRldmljZUlkICE9IEBfZGV2aWNlSWRcbiAgICAgICAgQF9zdHJlYW0/LmdldFRyYWNrcygpLmZvckVhY2ggKHRyYWNrKSAtPiB0cmFjay5zdG9wKClcbiAgICAgICAgQF9kZXZpY2VJZCA9IGNhbWVyYS5kZXZpY2VJZFxuICAgICAgICBAX2dldFVzZXJNZWRpYVxuICAgICAgICAgIGF1ZGlvOiBmYWxzZVxuICAgICAgICAgIHZpZGVvOiB7b3B0aW9uYWw6IFt7c291cmNlSWQ6IEBfZGV2aWNlSWR9XX1cbiAgICAgIGVsc2VcbiAgICAgICAgUHJvbWlzZS5yZWplY3QoKVxuXG4gICAgLnRoZW4gKHN0cmVhbSkgPT5cbiAgICAgIEBwbGF5ZXIuc3JjID0gVVJMLmNyZWF0ZU9iamVjdFVSTChzdHJlYW0pXG4gICAgICBAX3N0cmVhbSA9IHN0cmVhbVxuICAgICAgQF9hdXRvZmxpcCAmJiBAX2ZsaXAoKVxuXG4gICAgLmNhdGNoIChlcnJvcikgLT4gY29uc29sZS5lcnJvcihlcnJvcilcblxuICBfZmxpcDogLT5cbiAgICB4ID0gaWYgQF9mYWNpbmcgPT0gJ2Zyb250JyB0aGVuIC0xIGVsc2UgMVxuICAgIEBwbGF5ZXIuc3R5bGUud2Via2l0VHJhbnNmb3JtID0gXCJzY2FsZSgje3h9LCAxKVwiXG5cbiAgX2VudW1lcmF0ZURldmljZXM6IC0+XG4gICAgdHJ5XG4gICAgICBuYXZpZ2F0b3IubWVkaWFEZXZpY2VzLmVudW1lcmF0ZURldmljZXMoKVxuICAgIGNhdGNoXG4gICAgICBQcm9taXNlLnJlamVjdCgpXG5cbiAgX2dldFVzZXJNZWRpYTogKGNvbnN0cmFpbnRzKSAtPlxuICAgIG5ldyBQcm9taXNlIChyZXNvbHZlLCByZWplY3QpIC0+XG4gICAgICB0cnlcbiAgICAgICAgZ3VtID0gbmF2aWdhdG9yLmdldFVzZXJNZWRpYSB8fCBuYXZpZ2F0b3Iud2Via2l0R2V0VXNlck1lZGlhXG4gICAgICAgIGd1bS5jYWxsKG5hdmlnYXRvciwgY29uc3RyYWludHMsIHJlc29sdmUsIHJlamVjdClcbiAgICAgIGNhdGNoXG4gICAgICAgIHJlamVjdCgpXG4iXX0=
