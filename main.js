const { app, BrowserWindow, screen } = require("electron")

const createWindow = () => {
	const {width, height} = screen.getPrimaryDisplay().workAreaSize
	const win = new BrowserWindow({
		width,
		height,
		autoHideMenuBar: true,
		title: "Pixelful",
		icon: "Assets/icons/win/icon.ico"
	})
  
	win.maximize()
	win.loadFile("web/index.html")
}


app.whenReady().then(() => {
	createWindow()
  
	app.on('activate', () => {
		if (BrowserWindow.getAllWindows().length === 0) createWindow()
	})
})

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') app.quit()
})