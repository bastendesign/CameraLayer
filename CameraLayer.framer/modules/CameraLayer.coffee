module.exports = class CameraLayer extends VideoLayer
  constructor: (options = {}) ->
    options = do (clone = {}) ->
      clone[key] = value for key, value of options
      clone

    {facing, flipped, autoFlip, resolution, fit} = options
    delete options.facing
    delete options.flipped
    delete options.autoFlip
    delete options.resolution
    delete options.fit
    super(options)

    @_facing = facing ? 'back'
    @_flipped = flipped ? false
    @_autoFlip = autoFlip ? true
    @_resolution = resolution ? 480

    @_started = false
    @_device = null
    @_stream = null
    @_scheduledRestart = null

    @backgroundColor = 'transparent'

    @player.src = ''
    @player.autoplay = true
    @player.muted = true
    @player.style.objectFit = fit ? 'cover'

  @define 'facing',
    get: -> @_facing
    set: (facing) ->
      @_facing = if facing == 'front' then facing else 'back'
      @_setRestart()

  @define 'flipped',
    get: -> @_flipped
    set: (flipped) ->
      @_flipped = flipped
      @_setRestart()

  @define 'autoFlip',
    get: -> @_autoFlip
    set: (autoFlip) ->
      @_autoFlip = autoFlip
      @_setRestart()

  @define 'resolution',
    get: -> @_resolution
    set: (resolution) ->
      @_resolution = resolution
      @_setRestart()

  @define 'fit',
    get: -> @player.style.objectFit
    set: (fit) -> @player.style.objectFit = fit

  toggleFacing: ->
    @_facing = if @_facing == 'front' then 'back' else 'front'
    @_setRestart()

  capture: ->

  draw: ->

  start: ->
    @_enumerateDevices()
    .then (devices) =>
      devices = devices.filter (device) -> device.kind == 'videoinput'
      return if devices.length == 0

      facing = "facing #{@_facing}"
      devices.reduce (current, next) ->
        if next.label.indexOf(facing) != -1 then next else current

    .then (device) =>
      return if !device || device.deviceId == @_device?.deviceId

      @stop()
      @_device = device

      constraints =
        video:
          mandatory: {minWidth: @_resolution, minHeight: @_resolution}
          optional: [{sourceId: @_device.deviceId}]
        audio:
          false

      @_getUserMedia(constraints).then (stream) =>
        @player.src = URL.createObjectURL(stream)
        @_started = true
        @_stream = stream
        @_flip()

    .catch (error) ->
      console.error(error)

  stop: ->
    @_started = false

    @player.pause()
    @player.src = ''

    @_stream?.getTracks().forEach (track) -> track.stop()
    @_stream = null
    @_device = null

    if @_scheduledRestart
      cancelAnimationFrame(@_scheduledRestart)
      @_scheduledRestart = null

  _setRestart: ->
    return if !@_started || @_scheduledRestart

    @_scheduledRestart = requestAnimationFrame =>
      @_scheduledRestart = null
      @start()

  _flip: ->
    @_flipped = @_facing == 'front' if @_autoFlip
    x = if @_flipped then -1 else 1
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
