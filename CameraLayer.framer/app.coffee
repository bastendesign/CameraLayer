CameraLayer = require('CameraLayer')

Screen.backgroundColor = 'black'

camera = new CameraLayer
	size: Screen.size
	facing: 'front'
	autoflip: true

camera.onClick -> camera.toggleFacing()

camera.start()