const { contextBridge, ipcRenderer, ipcMain } = require("electron");
const { captureRejectionSymbol } = require("events");
const { createWriteStream } = require("fs");
const path = require("path")

contextBridge.exposeInMainWorld("vvc", {
    changeSettingVal: (v) => ipcRenderer.send("changeSettingVal", v)
})
let setList
ipcRenderer.on("reload", () => location.reload())

document.addEventListener("DOMContentLoaded", async () => {
    let settingWindow = await ipcRenderer.invoke("settingDom")
    console.log(settingWindow)
})