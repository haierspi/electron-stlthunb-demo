const { remote,ipcRenderer } = require ('electron'); 
const path = require('path');
const fs = require('fs');

let menu_openfile = function () {
    ipcRenderer.send('menu', 'openfile');
}
let getstlthumb = function (selected_thumbfile) {
    console.log(selected_thumbfile);
    stlrealpath = selected_thumbfile.split(path.sep).join('/');

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
    document.getElementById('input').value = selected_thumbfile[ 0 ];
    getstlthumb(selected_thumbfile[0]);
});

