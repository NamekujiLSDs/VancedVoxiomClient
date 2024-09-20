const { contextBridge, ipcRenderer, ipcMain } = require("electron");
const { captureRejectionSymbol } = require("events");
const { createWriteStream } = require("fs");
const path = require("path")

let setList
ipcRenderer.on("reload", () => { console.log("reloaddd") })
ipcRenderer.on("setList", (e, v) => { console.log(v), setList = v })

let settingWindow = `<div id="closer"></div><div id="settingWindow"><h2 id="windowTitle">Client Settings</h2>`
const createSettingWindow = () => {
    Object.values(setList).forEach((v) => {
        switch (v.type) {
            case ("checkbox"):
                settingWindow += `<div class="setBox"><label for="${v.id}">${v.name}<input type="checkbox" name="${v.id}" id="${v.id}">
            </label></div>`;
            case ("select"):
                "";
            case ("join"):
                "";
            case ("inv"):
                "";
        }
    })
    settingWindow += `</div>`
    console.log(settingWindow)
}
createSettingWindow()