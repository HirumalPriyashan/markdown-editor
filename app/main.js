const { app, BrowserWindow } = require('electron');

require('electron-reload')(__dirname);

let mainWindow = null;

app.on('ready', () => {
    mainWindow = new BrowserWindow({ 
            show: false,
            webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        } 
    });
    mainWindow.loadFile('app/index.html');
    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
        // mainWindow.webContents.openDevTools();
    });
    mainWindow.on('closed', () => {
        mainWindow = null;
    });
});