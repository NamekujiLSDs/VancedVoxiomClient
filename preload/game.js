const { ipcRenderer, ipcMain } = require("electron")
const account = require("../util/account")
const path = require('path');
let ver = "";
ipcRenderer.invoke("appVer").then((version) => {
    ver = version
});
// //ESCの入力を受け取り   
//100ms秒のDelayを入れるとメニューが消えなくて済む。機体によっても差が出るかもしれないから要検証
ipcRenderer.on("ESC", () => {
    setTimeout(() => {
        document.exitPointerLock();
        console.log("55ms")
    }, 100
    )
})
ipcRenderer.on("F8", () => {
    location.href = "https://voxiom.io/"
})

//右下のロゴ
function vvcLogo() {
    let tempDom4 = `<div id="clientLogo">Vanced Voxiom Client v${ver}</div>`
    document.body.insertAdjacentHTML("beforeend", tempDom4)
}

function newPage() {
    //VVC用の最低限のCSSをinject
    let cssIn = document.createElement("link")
    cssIn.setAttribute("rel", "stylesheet");
    cssIn.setAttribute("href", `vvc://${path.join(__dirname, "/css/vvc.css")}`)
    document.head.appendChild(cssIn)
    console.log("css injected");
    if (!document.getElementById("clientLogo")) {
        vvcLogo()
    }


    //VVCの設定用のJSをinject
    let settingJsIn = document.createElement("script");
    settingJsIn.setAttribute("type", "text/javascript")
    settingJsIn.setAttribute("src", `vvc://${path.join(__dirname, "../util/settingMenu.js")}`)
    document.body.appendChild(settingJsIn);
    console.log("Setting.js injected");

    //ページの変遷を検知してページごとに動作を分岐
    let url = location.href;
    if (url === "https://voxiom.io/account") {
        account.pageload()
    } else if (url === "https://voxiom.io/#google_vignette") {
        location.href = "https://voxiom.io/experimental"
    } else if (url === "https://voxiom.io/experimental#google_vignette") {
        location.href = "https://voxiom.io/"
    }
}

// 0.1秒ごとにURLを確認してページの変遷を検知するインターバル関数
let curUrl = "";
setInterval(() => {
    let newUrl = window.location.href;
    if (curUrl !== newUrl) {
        newPage()
        curUrl = newUrl;
    }
}, 100);
