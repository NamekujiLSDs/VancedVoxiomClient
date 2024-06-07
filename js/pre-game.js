const { contextBridge, ipcRenderer } = require("electron")
const webFrame = require("electron").webFrame

ipcRenderer.on("setSetting", (e, n, v) => {
    console.log(e, n, v)
    processSettedValue(n, v)
})
let settingNames = ["crosshair"]

ipcRenderer.on("reload", v => {
    location.reload()
})

const processSettedValue = (n, v) => {
    switch (n) {
        case ("crosshair"):
            return ""
        case ("css"):
            return ""
        case ("unlimitedFps"):
            return ""
    }
}

document.addEventListener("DOMContentLoaded", webFrame.executeJavaScript("console.log('a')"))