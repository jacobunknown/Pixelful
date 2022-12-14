const { app, BrowserWindow, screen } = require("electron")

if(require("electron-squirrel-startup")) {
	app.quit()
}

const createWindow = () => {
	const {width, height} = screen.getPrimaryDisplay().workAreaSize
	const win = new BrowserWindow({
		width,
		height,
		autoHideMenuBar: true,
		title: "Pixelful",
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