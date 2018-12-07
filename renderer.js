// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const { remote,ipcRenderer } = require ('electron'); 
const path = require('path');
const fs = require('fs');

let getstlthumb = function (selected_thumbfile) {
    console.log(selected_thumbfile);
    let stlrealpath = '';
    if (typeof selected_thumbfile == 'undefined') {
        stlrealpath = remote.app.getAppPath()  + '/' + document.getElementById('input').value+ '.stl';
        stlrealpath = stlrealpath.split(path.sep).join('/')     
    } else {
        stlrealpath = selected_thumbfile.split(path.sep).join('/');
    }

    console.log( stlrealpath)

    fs.access(stlrealpath, fs.constants.F_OK, (err) => {
        if (err) {
            document.getElementById('stlthumb').innerHTML = 'STL文件路径错误';
        } else {
            document.getElementById('stlthumb').innerHTML = 'Loadding...';
            ipcRenderer.send('stlthumb', stlrealpath);
        }
    });
}
ipcRenderer.on('stlthumb-reply', function (event, succeed, thumbfile) {
    document.getElementById('stlthumb').innerHTML = '<img src="' + thumbfile + '" />';
});

ipcRenderer.on('stlthumb-selected_file', function (event, selected_thumbfile) {
    getstlthumb(selected_thumbfile[0]);
});

