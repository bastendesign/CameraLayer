CameraLayer = require('CameraLayer')

Screen.backgroundColor = 'black'

camera = new CameraLayer
	size: Screen.size
	facing: 'front'
	flipped: false
	autoFlip: true
	resolution: 720
	fit: 'cover'

camera.start()
