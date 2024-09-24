const { BrowserWindow, dialog, session, protocol, app, Menu, webContents, shell, ipcMain } = require("electron")
const path = require("path")
const store = require('electron-store')
const config = new store()
const shortcut = require("electron-localshortcut")
const { autoUpdater } = require('electron-updater')
const fs = require('fs')
const log = require('electron-log')

//Skip checkForUpdates...の問題を修正するためのもの
Object.defineProperty(app, 'isPackaged', {
    get() {
        return true;
    }
});

let mainWindow
let keyWindow
let splashWindow

//カスタムプロトコルの登録
app.on('ready', () => {
    protocol.registerFileProtocol('vvc', (request, callback) =>
        callback(decodeURI(request.url.replace(/^vvc:\//, '')))
    )
})
protocol.registerSchemesAsPrivileged([
    {
        scheme: 'vvc',
        privileges: {
            secure: true,
            corsEnabled: true
        }
    }
])
function createSplash() {
    splashWindow = new BrowserWindow({
        width: 600,
        height: 300,
        frame: false,
        resizable: false,
        show: false,
        transparent: true,
        alwaysOnTop: true,
        icon: "./icon.ico",
        webPreferences: {
            contextIsolation: true,
            preload: path.join(__dirname, './js/pre-splash.js')
        }
    })
    splashWindow.loadFile(path.join(__dirname, 'html/splash.html'))
    Menu.setApplicationMenu(null)
    const update = async () => {
        let updateCheck = null
        autoUpdater.on('checking-for-update', () => {
            splashWindow.webContents.send('status', 'Checking for updates...')
            updateCheck = setTimeout(() => {
                splashWindow.webContents.send('status', 'Update check error!')
                setTimeout(() => {
                    createKeyInput()
                }, 1000)
            }, 15000)
        })
        autoUpdater.on('update-available', i => {
            if (updateCheck) clearTimeout(updateCheck)
            splashWindow.webContents.send(
                'status',
                `Found new version v${i.version}!`
            )
        })
        autoUpdater.on('update-not-available', () => {
            if (updateCheck) clearTimeout(updateCheck)
            splashWindow.webContents.send(
                'status',
                'You are using the latest version!'
            )
            setTimeout(() => {
                createKeyInput()
            }, 1000)
        })
        autoUpdater.on('error', e => {
            if (updateCheck) clearTimeout(updateCheck)
            splashWindow.webContents.send('status', 'Error!' + e.name)
            setTimeout(() => {
                createKeyInput()
            }, 1000)
        })
        autoUpdater.on('download-progress', i => {
            if (updateCheck) clearTimeout(updateCheck)
            splashWindow.webContents.send('status', 'Downloading new version...')
        })
        autoUpdater.on('update-downloaded', i => {
            if (updateCheck) clearTimeout(updateCheck)
            splashWindow.webContents.send('status', 'Update downloaded')
            setTimeout(() => {
                autoUpdater.quitAndInstall()
            }, 1000)
        })
        autoUpdater.autoDownload = 'download'
        autoUpdater.allowPrerelease = false
        autoUpdater.checkForUpdates()
    }
    splashWindow.webContents.on('did-finish-load', () => {
        splashWindow.show()
        update()
    })
}
//キーを入力させる
//キーはどんなキーがいいかなぁ＾＾
const createKeyInput = () => {
    keyWindow = new BrowserWindow({
        show: true,
        webPreferences: {
            preload: path.join(__dirname, "./js/key.js")
        },
    })
    keyWindow.webContents.loadFile("./html/key.html")
}
//メインウィンドウを作るやつ
const createMain = async () => {
    mainWindow = new BrowserWindow({
        x: config.get("x"),
        y: config.get("y"),
        height: config.get("height"),
        width: config.get("width"),
        show: false,
        icon: "./icon.ico",
        fullscreen: config.get("fullscreen", true),
        resizable: true,
        webPreferences: {
            webSecurity: false,
            contextIsolation: true,
            preload: path.join(__dirname, "./js/preload.js"),
            worldSafeExecuteJavaScript: false,
        },
    })
    let def = config.get("defPage") ? config.get("defPage") : "default"
    switch (def) {
        case ("default"):
            mainWindow.loadURL("https://voxiom.io/")
            break
        case ("experimental"):
            mainWindow.loadURL("https://voxiom.io/experimental")
            break
    }
    mainWindow.setTitle("Vanced Voxiom Client | Discontinued")
    mainWindow.webContents.on('will-prevent-unload', e => {
        e.preventDefault()
    })
    //ショートカットキーを設定する
    shortcut.register(mainWindow, "F1", () => {
        //メインウィンドウにopenSettingを送る。ipcRendererで受け取り
        mainWindow.webContents.send("openSetting")
    })
    shortcut.register(mainWindow, "F5", () => {
        //メインウィンドウにreloadを送る。ipcRendererで受け取り
        mainWindow.webContents.send("reload")
    })
    shortcut.register(mainWindow, 'F11', () => {
        const isFullScreen = mainWindow.isFullScreen()
        config.set('Fullscreen', !isFullScreen)
        mainWindow.setFullScreen(!isFullScreen)
    })
    shortcut.register(mainWindow, "F12", () => {
        mainWindow.webContents.openDevTools()
    })
    // shortcut.register(mainWindow, "0", () => {
    //     let v = config.get("betterDebugDisplay")
    //     mainWindow.webContents.send("betterDebugDisplay", v)
    // })

    //表示の準備ができたらメインウィンドウを表示してスプラッシュウィンドウを破棄する
    mainWindow.once("ready-to-show", () => {
        config.get("maximize") ? mainWindow.maximize() : "";
        mainWindow.show()
        splashWindow.destroy()
    })
    //ページのタイトルを固定する
    mainWindow.on('page-title-updated', e => {
        e.preventDefault()
    })
    //閉じるときの処理
    mainWindow.on('close', () => {
        if (!mainWindow.isDestroyed()) {
            //座標などを保存する
            const { x, y, width, height } = mainWindow.getBounds()
            config.set({ x, y, width, height })
            config.set("fullscreen", mainWindow.isFullScreen())
            config.set("maximize", mainWindow.isMaximized())
            mainWindow.destroy()
        } try { settingWindow.close() } catch (e) { }
    });
    Menu.setApplicationMenu(null)
    //新しいウィンドウの挙動を変更する
    mainWindow.webContents.on("new-window", (e, v) => {
        console.log(v)
        e.preventDefault()
        if (v.startsWith("https://voxiom.io/assets/pages") || v.startsWith("https://voxiom.io/package")) {
            shell.openExternal(v)
        } else if (v.startsWith("https://voxiom.io") || v.startsWith("https://accounts.google.com/") || v.startsWith("https://discord.com/") || v.startsWith("https://www.facebook.com/")) {
            mainWindow.loadURL(v)
        } else {
            shell.openExternal(v)
        }
    });

    mainWindow.webContents.on("will-navigate", (e, v) => {
        console.log(v)
        if (v.startsWith("https://voxiom.io/assets/pages")) {
            e.preventDefault()
            shell.openExternal(v)
        } else if (v.startsWith("https://voxiom.io/package")) {
            e.preventDefault()
            shell.openExternal(v)
        } else if (v.startsWith("https://voxiom.io") || v.startsWith("https://accounts.google.com/") || v.startsWith("https://discord.com/") || v.startsWith("https://www.facebook.com/")) {
            return
        } else {
            e.preventDefault()
            shell.openExternal(v)
        }
    })
    //カスタムJSを読み込ませる
    mainWindow.webContents.on('did-start-loading', e => {
        mainWindow.webContents.send("injectScript", config.get("customJs"))
    })
    mainWindow.webContents.send("console", reject)
    //リソーススワッパーのやつ
    mainWindow.webContents.session.webRequest.onBeforeRequest((details, callback) => {
        if (config.get('swapper') && files.includes(json[details.url])) {
            log.info("Swapped :", details.url, "to", 'vvc://' + path.join(app.getPath('documents'), '/VVC-Swapper', json[details.url]))
            callback({
                redirectURL: 'vvc://' + path.join(app.getPath('documents'), '/VVC-Swapper', json[details.url])
            })
        } else if (containsAnySubstr(details.url, reject)) {
            log.info("Blocked :", details.url)
            callback({ cancel: true })
        } else {
            callback({})
        }
    })
}
function containsAnySubstr(str, substrings) {
    return substrings.some(substring => str.includes(substring));
}
//リソーススワッパーの部分
const swapperJson = () => {
    const filePath = swapper().includes('swapperConfig.json')
        ? path.join(app.getPath('documents'), '/VVC-Swapper', 'swapperConfig.json')
        : path.join(__dirname, 'js/swapperConfig.json')
    try {
        let data = fs.readFileSync(filePath, 'utf8')
        const jsonContent = JSON.parse(data)
        return jsonContent
    } catch (e) { }
}
const rejectJson = () => {
    const filePath = swapper().includes('rejectConfig.json')
        ? path.join(app.getPath('documents'), '/VVC-Swapper', 'rejectConfig.json')
        : path.join(__dirname, 'js/rejectConfig.json')
    try {
        let data = fs.readFileSync(filePath, 'utf8')
        let jsonContent = JSON.parse(data)
        jsonContent = jsonContent.reject
        return jsonContent
    } catch (e) { }
}
const swapper = () => {
    const swapperPath = path.join(app.getPath('documents'), '/VVC-Swapper')
    if (!fs.existsSync(swapperPath)) {
        fs.mkdirSync(swapperPath, { recursive: true })
    }
    const fileNames = fs.readdirSync(swapperPath)
    return fileNames
}
let files = swapper()
let json = swapperJson()
let reject = rejectJson()
console.log(reject)

//アプリのバージョンを返す
ipcMain.on("appVer", e => {
    e.sender.send("appVerRe", app.getVersion())
})

ipcMain.handle("settingDom", () => {
    let dom = config.get("unlimitedFps")
    return dom
})
//いつもの
const initFlags = () => {
    const flaglist = [
        ['disable-frame-rate-limit', null, config.get('unlimitedFps', true)],
        ['use-angle', config.get('angleType', 'default'), true],
    ]
    flaglist.forEach(f => {
        const isEnable = f[2] ? 'Enable' : 'Disable'
        if (f[2]) {
            if (f[1] === null) {
                app.commandLine.appendSwitch(f[0])
            } else {
                app.commandLine.appendSwitch(f[0], f[1])
            }
        }
    })
    app.commandLine.appendSwitch("disable-gpu-vsync")
    app.commandLine.appendSwitch("in-process-gpu")
    app.commandLine.appendSwitch("enable-quic")
    app.commandLine.appendSwitch("enable-gpu-rasterization")
    app.commandLine.appendSwitch("enable-pointer-lock-options")
    app.commandLine.appendSwitch("enable-heavy-ad-intervention")
}
initFlags()

app.on("ready", () => {
    // testConfigs()
    createSplash()
})
