const { app, BrowserWindow, screen, nativeImage } = require("electron")

if(require("electron-squirrel-startup")) {
	app.quit()
}

app.dock.setIcon(nativeImage.createFromPath(
	app.getAppPath() + "/Assets/icons/mac/icon.icns"
))

const createWindow = () => {
	const {width, height} = screen.getPrimaryDisplay().workAreaSize
	const win = new BrowserWindow({
		width,
		height,
		autoHideMenuBar: true,
		title: "Pixelful",
		icon: __dirname + "/Assets/icons/png/512x512.png",
		backgroundColor: "#222222",
		show: false
	})
  
	win.maximize()
	win.loadFile("web/index.html")
	win.once('ready-to-show', () => {
		win.show()
	})
}

app.whenReady().then(() => {
	createWindow()
  
	app.on('activate', () => {
		if (BrowserWindow.getAllWindows().length === 0) createWindow()
	})
})

app.on('window-all-closed', () => {
	if (process.platform == 'darwin') {
		app.quit()
	}
})