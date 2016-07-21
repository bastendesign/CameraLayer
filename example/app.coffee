camera = new Framer.CameraLayer()
camera.start()

layout= ->
  camera.width = Math.min(640, Screen.width)
  camera.height = Math.min(480, Screen.height)
  camera.center()

Screen.on("resize", layout)
layout()
