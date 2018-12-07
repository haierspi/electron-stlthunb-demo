const fs = require('fs');
const child_process = require('child_process');
const path = require('path');


// Modules to control application life and create native browser window
const {
  app,
  Menu,
  ipcMain,
  BrowserWindow,
  dialog
} = require('electron')


const template = [{
  label: '选择文件',
  click: function () {
    dialog.showOpenDialog({
      properties: [ 'openFile' ],
      message: '选择需要缩略图的文件',
      filters: [
        {name: '3D', extensions: ['stl']},
        {name: 'All Files', extensions: ['*']}
      ]
    },function (files) {
        if (files) {
          console.log(files);
          mainWindow.webContents.send('stlthumb-selected_file', files)
        }
    });
  }
}]
menu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(menu);


// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 320, // 窗口宽度
    height: 670, // 窗口高度
    fullscreen: false // 不允许全屏
   // resizable: false // 不允许改变窗口size
  })

  // and load the index.html of the app.
  mainWindow.loadFile('index.html')

  // Open the DevTools.
  mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
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

ipcMain.on('stlthumb', (event, stlrealpath) => {

  let apppath = app.getAppPath().split(path.sep).join('/');
  var tempfilename = guid();
  var thumbfile = apppath + '/cache/' + tempfilename + '.png';
  var scadfile = apppath + '/cache/' + tempfilename + '.scad';


  fs.writeFile(scadfile, 'import("' + stlrealpath + '");', function (err) {
    var command = apppath + '/openscad/openscad.exe --viewall --autocenter --imgsize=300,300 --colorscheme=Metallic ' + scadfile + ' -o ' + thumbfile;

    if (err != null) event.sender.send('stlthumb-reply', false)
    else {
      child_process.exec(command, function (err, stdout, stderr) {
        if (err != null) event.sender.send('stlthumb-reply', false)
        else {
          console.log(err, stdout, stderr);
          fs.unlink(scadfile, function () {});
          return event.sender.send('stlthumb-reply', true, thumbfile);
        }
      });
    }
  });
});



function S4() {
  return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
}

function guid() {
  return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
}

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.