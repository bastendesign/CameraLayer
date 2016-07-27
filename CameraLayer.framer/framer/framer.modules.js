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
    options = (function(clone) {
      var key, value;
      for (key in options) {
        value = options[key];
        clone[key] = value;
      }
      return clone;
    })({});
    autoflip = options.autoflip, facing = options.facing;
    delete options.autoflip;
    delete options.facing;
    CameraLayer.__super__.constructor.call(this, options);
    this._device = null;
    this._stream = null;
    this._autoflip = autoflip != null ? autoflip : true;
    this._facing = facing != null ? facing : 'back';
    this.backgroundColor = 'transparent';
    this.player.src = '';
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
          audio: false,
          video: {
            optional: [
              {
                sourceId: _this._device.deviceId
              }
            ]
          }
        };
        return _this._getUserMedia(constraints).then(function(stream) {
          _this.player.src = URL.createObjectURL(stream);
          _this._stream = stream;
          return _this._autoflip && _this._flip();
        });
      };
    })(this))["catch"](function(error) {
      return console.error(error);
    });
  };

  CameraLayer.prototype.stop = function() {
    var ref;
    this.player.pause();
    this.player.src = '';
    if ((ref = this._stream) != null) {
      ref.getTracks().forEach(function(track) {
        return track.stop();
      });
    }
    this._stream = null;
    return this._device = null;
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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvMjI3MTQ3NzEvZ2l0aHViL0NhbWVyYUxheWVyL0NhbWVyYUxheWVyLmZyYW1lci9tb2R1bGVzL0NhbWVyYUxheWVyLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBLElBQUEsV0FBQTtFQUFBOzs7QUFBQSxNQUFNLENBQUMsT0FBUCxHQUF1Qjs7O0VBQ1IscUJBQUMsT0FBRDtBQUNYLFFBQUE7O01BRFksVUFBVTs7SUFDdEIsT0FBQSxHQUFhLENBQUEsU0FBQyxLQUFEO0FBQ1gsVUFBQTtBQUFBLFdBQUEsY0FBQTs7UUFBQSxLQUFNLENBQUEsR0FBQSxDQUFOLEdBQWE7QUFBYjthQUNBO0lBRlcsQ0FBQSxDQUFILENBQVksRUFBWjtJQUlULG1CQUFBLFFBQUQsRUFBVyxpQkFBQTtJQUNYLE9BQU8sT0FBTyxDQUFDO0lBQ2YsT0FBTyxPQUFPLENBQUM7SUFFZiw2Q0FBTSxPQUFOO0lBRUEsSUFBQyxDQUFBLE9BQUQsR0FBVztJQUNYLElBQUMsQ0FBQSxPQUFELEdBQVc7SUFDWCxJQUFDLENBQUEsU0FBRCxzQkFBYSxXQUFXO0lBQ3hCLElBQUMsQ0FBQSxPQUFELG9CQUFXLFNBQVM7SUFFcEIsSUFBQyxDQUFBLGVBQUQsR0FBbUI7SUFFbkIsSUFBQyxDQUFBLE1BQU0sQ0FBQyxHQUFSLEdBQWM7SUFDZCxJQUFDLENBQUEsTUFBTSxDQUFDLFFBQVIsR0FBbUI7SUFDbkIsSUFBQyxDQUFBLE1BQU0sQ0FBQyxLQUFSLEdBQWdCO0lBQ2hCLElBQUMsQ0FBQSxNQUFNLENBQUMsS0FBSyxDQUFDLFNBQWQsR0FBMEI7RUFyQmY7O0VBdUJiLFdBQUMsQ0FBQSxNQUFELENBQVEsUUFBUixFQUNFO0lBQUEsR0FBQSxFQUFLLFNBQUE7YUFBRyxJQUFDLENBQUE7SUFBSixDQUFMO0lBQ0EsR0FBQSxFQUFLLFNBQUMsTUFBRDtNQUNILElBQUMsQ0FBQSxPQUFELEdB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QUFBLENBQUEsR0FBTyxJQUFDLENBQUEsT0FBRCxLQUFZLE9BQWYsR0FBNEIsQ0FBQyxDQUE3QixHQUFvQztXQUN4QyxJQUFDLENBQUEsTUFBTSxDQUFDLEtBQUssQ0FBQyxlQUFkLEdBQWdDLFFBQUEsR0FBUyxDQUFULEdBQVc7RUFGdEM7O3dCQUlQLGlCQUFBLEdBQW1CLFNBQUE7QUFDakIsUUFBQTtBQUFBO2FBQ0UsU0FBUyxDQUFDLFlBQVksQ0FBQyxnQkFBdkIsQ0FBQSxFQURGO0tBQUEsY0FBQTthQUdFLE9BQU8sQ0FBQyxNQUFSLENBQUEsRUFIRjs7RUFEaUI7O3dCQU1uQixhQUFBLEdBQWUsU0FBQyxXQUFEO1dBQ1QsSUFBQSxPQUFBLENBQVEsU0FBQyxPQUFELEVBQVUsTUFBVjtBQUNWLFVBQUE7QUFBQTtRQUNFLEdBQUEsR0FBTSxTQUFTLENBQUMsWUFBVixJQUEwQixTQUFTLENBQUM7ZUFDMUMsR0FBRyxDQUFDLElBQUosQ0FBUyxTQUFULEVBQW9CLFdBQXBCLEVBQWlDLE9BQWpDLEVBQTBDLE1BQTFDLEVBRkY7T0FBQSxjQUFBO2VBSUUsTUFBQSxDQUFBLEVBSkY7O0lBRFUsQ0FBUjtFQURTOzs7O0dBdEYwQiIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJtb2R1bGUuZXhwb3J0cyA9IGNsYXNzIENhbWVyYUxheWVyIGV4dGVuZHMgVmlkZW9MYXllclxuICBjb25zdHJ1Y3RvcjogKG9wdGlvbnMgPSB7fSkgLT5cbiAgICBvcHRpb25zID0gZG8gKGNsb25lID0ge30pIC0+XG4gICAgICBjbG9uZVtrZXldID0gdmFsdWUgZm9yIGtleSwgdmFsdWUgb2Ygb3B0aW9uc1xuICAgICAgY2xvbmVcblxuICAgIHthdXRvZmxpcCwgZmFjaW5nfSA9IG9wdGlvbnNcbiAgICBkZWxldGUgb3B0aW9ucy5hdXRvZmxpcFxuICAgIGRlbGV0ZSBvcHRpb25zLmZhY2luZ1xuXG4gICAgc3VwZXIob3B0aW9ucylcblxuICAgIEBfZGV2aWNlID0gbnVsbFxuICAgIEBfc3RyZWFtID0gbnVsbFxuICAgIEBfYXV0b2ZsaXAgPSBhdXRvZmxpcCA/IHRydWVcbiAgICBAX2ZhY2luZyA9IGZhY2luZyA/ICdiYWNrJ1xuXG4gICAgQGJhY2tncm91bmRDb2xvciA9ICd0cmFuc3BhcmVudCdcblxuICAgIEBwbGF5ZXIuc3JjID0gJydcbiAgICBAcGxheWVyLmF1dG9wbGF5ID0gdHJ1ZVxuICAgIEBwbGF5ZXIubXV0ZWQgPSB0cnVlXG4gICAgQHBsYXllci5zdHlsZS5vYmplY3RGaXQgPSAnY292ZXInXG5cbiAgQGRlZmluZSAnZmFjaW5nJyxcbiAgICBnZXQ6IC0+IEBfZmFjaW5nXG4gICAgc2V0OiAoZmFjaW5nKSAtPlxuICAgICAgQF9mYWNpbmcgPSBpZiBmYWNpbmcgPT0gJ2Zyb250JyB0aGVuIGZhY2luZyBlbHNlICdiYWNrJ1xuICAgICAgQHN0YXJ0KClcblxuICBAZGVmaW5lICdhdXRvZmxpcCcsXG4gICAgZ2V0OiAtPiBAX2F1dG9mbGlwXG4gICAgc2V0OiAoYXV0b2ZsaXApIC0+IEBfYXV0b2ZsaXAgPSAhIWF1dG9mbGlwXG5cbiAgdG9nZ2xlRmFjaW5nOiAtPlxuICAgIEBfZmFjaW5nID0gaWYgQF9mYWNpbmcgPT0gJ2Zyb250JyB0aGVuICdiYWNrJyBlbHNlICdmcm9udCdcbiAgICBAc3RhcnQoKVxuXG4gIGNhcHR1cmU6IC0+XG5cbiAgZHJhdzogLT5cblxuICBzdGFydDogLT5cbiAgICBAX2VudW1lcmF0ZURldmljZXMoKVxuICAgIC50aGVuIChkZXZpY2VzKSA9PlxuICAgICAgZGV2aWNlcyA9IGRldmljZXMuZmlsdGVyIChkZXZpY2UpIC0+IGRldmljZS5raW5kID09ICd2aWRlb2lucHV0J1xuICAgICAgcmV0dXJuIGlmIGRldmljZXMubGVuZ3RoID09IDBcblxuICAgICAgZmFjaW5nID0gXCJmYWNpbmcgI3tAX2ZhY2luZ31cIlxuICAgICAgZGV2aWNlcy5yZWR1Y2UgKGN1cnJlbnQsIG5leHQpIC0+XG4gICAgICAgIGlmIG5leHQubGFiZWwuaW5kZXhPZihmYWNpbmcpICE9IC0xIHRoZW4gbmV4dCBlbHNlIGN1cnJlbnRcblxuICAgIC50aGVuIChkZXZpY2UpID0+XG4gICAgICByZXR1cm4gaWYgIWRldmljZSB8fCBkZXZpY2UuZGV2aWNlSWQgPT0gQF9kZXZpY2U/LmRldmljZUlkXG5cbiAgICAgIEBzdG9wKClcbiAgICAgIFxuICAgICAgQF9kZXZpY2UgPSBkZXZpY2VcbiAgICAgIGNvbnN0cmFpbnRzID0gYXVkaW86IGZhbHNlLCB2aWRlbzoge29wdGlvbmFsOiBbe3NvdXJjZUlkOiBAX2RldmljZS5kZXZpY2VJZH1dfVxuXG4gICAgICBAX2dldFVzZXJNZWRpYShjb25zdHJhaW50cykudGhlbiAoc3RyZWFtKSA9PlxuICAgICAgICBAcGxheWVyLnNyYyA9IFVSTC5jcmVhdGVPYmplY3RVUkwoc3RyZWFtKVxuICAgICAgICBAX3N0cmVhbSA9IHN0cmVhbVxuICAgICAgICBAX2F1dG9mbGlwICYmIEBfZmxpcCgpXG5cbiAgICAuY2F0Y2ggKGVycm9yKSAtPlxuICAgICAgY29uc29sZS5lcnJvcihlcnJvcilcblxuICBzdG9wOiAtPlxuICAgIEBwbGF5ZXIucGF1c2UoKVxuICAgIEBwbGF5ZXIuc3JjID0gJydcblxuICAgIEBfc3RyZWFtPy5nZXRUcmFja3MoKS5mb3JFYWNoICh0cmFjaykgLT4gdHJhY2suc3RvcCgpXG4gICAgQF9zdHJlYW0gPSBudWxsXG4gICAgQF9kZXZpY2UgPSBudWxsXG5cbiAgX2ZsaXA6IC0+XG4gICAgeCA9IGlmIEBfZmFjaW5nID09ICdmcm9udCcgdGhlbiAtMSBlbHNlIDFcbiAgICBAcGxheWVyLnN0eWxlLndlYmtpdFRyYW5zZm9ybSA9IFwic2NhbGUoI3t4fSwgMSlcIlxuXG4gIF9lbnVtZXJhdGVEZXZpY2VzOiAtPlxuICAgIHRyeVxuICAgICAgbmF2aWdhdG9yLm1lZGlhRGV2aWNlcy5lbnVtZXJhdGVEZXZpY2VzKClcbiAgICBjYXRjaFxuICAgICAgUHJvbWlzZS5yZWplY3QoKVxuXG4gIF9nZXRVc2VyTWVkaWE6IChjb25zdHJhaW50cykgLT5cbiAgICBuZXcgUHJvbWlzZSAocmVzb2x2ZSwgcmVqZWN0KSAtPlxuICAgICAgdHJ5XG4gICAgICAgIGd1bSA9IG5hdmlnYXRvci5nZXRVc2VyTWVkaWEgfHwgbmF2aWdhdG9yLndlYmtpdEdldFVzZXJNZWRpYVxuICAgICAgICBndW0uY2FsbChuYXZpZ2F0b3IsIGNvbnN0cmFpbnRzLCByZXNvbHZlLCByZWplY3QpXG4gICAgICBjYXRjaFxuICAgICAgICByZWplY3QoKVxuIl19
