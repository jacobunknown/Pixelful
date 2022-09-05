const { app, BrowserWindow } = require("electron")

const createWindow = () => {
	const win = new BrowserWindow({
		width: 800,
		height: 600,
		autoHideMenuBar: true,
		title: "Pixelful"
	})

	const ses = win.webContents.session
	ses.clearStorageData()
  
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