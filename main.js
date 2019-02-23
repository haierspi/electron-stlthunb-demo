const fs = require('fs')
const child_process = require('child_process')
const path = require('path')

// Modules to control application life and create native browser window
const {app, ipcMain, BrowserWindow, Menu, Tray} = require('electron')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1400, // 窗口宽度
    height: 670, // 窗口高度
    fullscreen: false, // 不允许全屏
    resizable: true, // 不允许改变窗口size
    skipTaskbar: false,
    icon: 'icon.ico',
    show: false,
    allowclose: false
  })
  Menu.setApplicationMenu(null)



  // and load the index.html of the app.
  mainWindow.loadURL('https://cn.bing.com/')

  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
  })
  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  appTray = new Tray('icon.ico')
  // 系统托盘右键菜单

  const contextMenu = Menu.buildFromTemplate([{
    label: '关闭',
    click: function () {
      mainWindow.allowclose = true
      app.quit()
      app.quit(); // 因为程序设定关闭为最小化，所以调用两次关闭，防止最大化时一次不能关闭的情况
    }
  }])

  // 设置此托盘图标的悬停提示内容
  appTray.setToolTip('客服系统')

  // 设置此图标的上下文菜单
  appTray.setContextMenu(contextMenu)
  // 单击右下角小图标显示应用
  appTray.on('click', function () {
    if (mainWindow.isVisible()) {
      mainWindow.hide()
      mainWindow.setSkipTaskbar(true)
    } else {
      mainWindow.show()
      mainWindow.setSkipTaskbar(false)
    }
  })
  var count = 0
  setInterval(function () {
    if (count++ % 2 == 0) {
      appTray.setImage('icon.ico')
    } else {
      appTray.setImage('icon.ico')
    }
  }, 400)

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })

  mainWindow.on('close', function (event) {
    if (!mainWindow.allowclose) {
      mainWindow.setSkipTaskbar(true)
      mainWindow.hide()
      event.preventDefault()
    }
  })
  let intervalhandle = null
  mainWindow.on('focus', function () {
    clearInterval(intervalhandle)
    mainWindow.flashFrame(false)
  })
  mainWindow.on('blur', function () {
    intervalhandle = setInterval(function () {
      mainWindow.flashFrame(true)
    }, 2000)
  })
  mainWindow.on('minimize', function () {
    intervalhandle = setInterval(function () {
      mainWindow.flashFrame(true)
    }, 2000)
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})
