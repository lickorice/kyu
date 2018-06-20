const electron = require('electron');
const url = require('url');
const path = require('path');

const {
  app,
  BrowserWindow,
  ipcMain
} = electron;

let mainWindow;
let prefWindow;

// listen for preferences button
ipcMain.on('show-preferences', function() {
  // init
  prefWindow = new BrowserWindow({
    width: 500,
    height: 300,
    resizable: false,
    frame: false
  });
  prefWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'html/pref.html'),
    protocol: 'file:',
    slashes: true
  }));
  prefWindow.show();
});

ipcMain.on('client-refresh', function() {
  mainWindow.reload();
});

// method on ready
app.on('ready', function() {
  // init main window
  mainWindow = new BrowserWindow({
    width: 300,
    height: 400,
    // resizable: false,
    frame: false
  });

  // set as fullscreen (uncomment)
  // mainWindow.setFullScreen(true);

  // init html
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'html/main.html'),
    protocol: 'file:',
    slashes: true
  }));

  // quit when closed
  mainWindow.on('closed', function() {
    app.quit();
  });
});
