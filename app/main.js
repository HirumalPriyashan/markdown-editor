const { app, BrowserWindow, dialog, ipcMain } = require('electron');
const fs = require('fs');
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
        mainWindow.webContents.openDevTools();
        getFileFromUser();
    });
    mainWindow.on('closed', () => {
        mainWindow = null;
    });
});

const getFileFromUser = async() => {
    const response = await dialog.showOpenDialog(mainWindow, {
        properties: ['openFile'],
        filters: [
            { name: 'Text Files', extensions: ['txt'] },
            { name: 'Markdown Files', extensions: ['md', 'markdown'] }
        ]
    })
    if (!response.canceled) {
        const file = response.filePaths[0];
        openFile(file)
    } else {
        console.log("no file selected");
    }
};

const openFile = (file) => {
    const content = fs.readFileSync(file).toString();
    mainWindow.webContents.send('file-opened', file, content);
};

ipcMain.handle('dialog:openFile', getFileFromUser)