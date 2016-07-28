module.exports = class CameraLayer extends VideoLayer
  constructor: (options = {}) ->
    customProps =
      facing: true
      flipped: true
      autoFlip: true
      resolution: true
      fit: true

    baseOptions = Object.keys(options)
      .filter (key) -> !customProps[key]
      .reduce (clone, key) ->
        clone[key] = options[key]
        clone
      , {}

    super(baseOptions)

    @_facing = options.facing ? 'back'
    @_flipped = options.flipped ? false
    @_autoFlip = options.autoFlip ? true
    @_resolution = options.resolution ? 480

    @_started = false
    @_device = null
    @_matchedFacing = 'unknown'
    @_stream = null
    @_scheduledRestart = null

    @backgroundColor = 'transparent'

    @player.src = ''
    @player.autoplay = true
    @player.muted = true
    @player.style.objectFit = options.fit ? 'cover'

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

      for device in devices
        if device.label.indexOf(@_facing) != -1
          @_matchedFacing = @_facing
          return device

      @_matchedFacing = 'unknown'
      devices[0]

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
    @_flipped = @_matchedFacing == 'front' if @_autoFlip
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
