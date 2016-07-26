module.exports = class CameraLayer extends VideoLayer
  constructor: (options = {}) ->
    options = Object.assign({}, options)

    {autoflip, facing} = options
    delete options.autoflip
    delete options.facing

    super(options)

    @_deviceId = null
    @_stream = null
    @_autoflip = autoflip ? true
    @_facing = facing ? 'back'

    @backgroundColor = 'transparent'

    @player.autoplay = true
    @player.muted = true
    @player.style.objectFit = 'cover'

  @define 'facing',
    get: -> @_facing
    set: (facing) ->
      @_facing = if facing == 'front' then facing else 'back'
      @start()

  @define 'autoflip',
    get: -> @_autoflip
    set: (autoflip) -> @_autoflip = !!autoflip

  toggleFacing: ->
    @_facing = if @_facing == 'front' then 'back' else 'front'
    @start()

  capture: ->

  draw: ->

  start: ->
    @_enumerateDevices()
    .then (devices) =>
      facing = "facing #{@_facing}"
      camera = devices
        .filter (device) => device.kind == 'videoinput'
        .reduce (current, next) =>
          if next.label.indexOf(facing) != -1 then next else current

      if camera?.deviceId != @_deviceId
        @_stream?.getTracks().forEach (track) -> track.stop()
        @_deviceId = camera.deviceId
        @_getUserMedia
          audio: false
          video: {optional: [{sourceId: @_deviceId}]}
      else
        Promise.reject()

    .then (stream) =>
      @player.src = URL.createObjectURL(stream)
      @_stream = stream
      @_autoflip && @_flip()

    .catch (error) -> console.error(error)

  _flip: ->
    x = if @_facing == 'front' then -1 else 1
    @player.style.webkitTransform = "scale(#{x}, 1)"

  _enumerateDevices: ->
    try
      navigator.mediaDevices.enumerateDevices()
    catch
      Promise.reject()

  _getUserMedia: (constraints) ->
    new Promise (resolve, reject) ->
      try
        gum = navigator.getUserMedia || navigator.webkitGetUserMedia
        gum.call(navigator, constraints, resolve, reject)
      catch
        reject()
