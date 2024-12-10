const { BrowserWindow, dialog, session, protocol, app, Menu, webContents, shell, ipcMain } = require("electron")
const path = require("path")

//Skip checkForUpdates...の問題を修正するためのもの
Object.defineProperty(app, 'isPackaged', {
    get() {
        return true;
    }
});
let splashWindow
function createSplash() {
    splashWindow = new BrowserWindow({
        width: 600,
        height: 300,
        show: true,
    })
    splashWindow.loadFile(path.join(__dirname, 'html/main.html'))
    Menu.setApplicationMenu(null)
}

app.on("ready", () => {
    createSplash()
})
