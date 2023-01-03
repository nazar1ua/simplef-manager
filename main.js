const { app, BrowserWindow } = require('electron')
const remote = require('@electron/remote/main')
remote.initialize()

function createWindow() {
   const win = new BrowserWindow({
      width: 800,
      height: 600,
      webPreferences: {
         nodeIntegration: true,
         contextIsolation: false,
      },
   })

   remote.enable(win.webContents)

   win.loadFile('index.html')
}

app.whenReady().then(() => {
   createWindow()

   app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) {
         createWindow()
      }
   })
})

app.on('window-all-closed', () => {
   if (process.platform !== 'darwin') {
      app.quit()
   }
})
