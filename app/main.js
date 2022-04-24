const { app, BrowserWindow, dialog, ipcMain } = require('electron');
const fs = require('fs');
require('electron-reload')(__dirname);

let mainWindow = null;

const windows = new Set();

app.on('ready', () => {
    createWindow()
});

const createWindow = () => {
    let x, y;
    const currentWindow = BrowserWindow.getFocusedWindow();

    if (currentWindow) {
        const [currentWindowX, currentWindowY] = currentWindow.getPosition();
        x = currentWindowX + 10;
        y = currentWindowY + 10;
    }
    var newWindow = new BrowserWindow({
        x,
        y,
        show: false,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });
    newWindow.loadFile('app/index.html');
    newWindow.once('ready-to-show', () => {
        newWindow.show();
    });
    newWindow.on('closed', () => {
        windows.delete(newWindow);
        newWindow = null;
    });
    windows.add(newWindow);
    return newWindow;
};

const getFileFromUser = async(targetWindow) => {
    const response = await dialog.showOpenDialog(targetWindow, {
        properties: ['openFile'],
        filters: [
            { name: 'Text Files', extensions: ['txt'] },
            { name: 'Markdown Files', extensions: ['md', 'markdown'] }
        ]
    })
    if (!response.canceled) {
        return openFile(targetWindow, response.filePaths[0])
    } else {
        console.log("no file selected");
    }
};

const openFile = (targetWindow, file) => {
    const content = fs.readFileSync(file).toString();
    return { file, content };
};

ipcMain.handle('dialog:openFile', getFileFromUser)
ipcMain.handle('dialog:createWindow', createWindow)

app.on('window-all-closed', () => {
    if (process.platform === 'darwin') {
        return false;
    }
    app.quit();
});

app.on('activate', (event, hasVisibleWindows) => {
    if (!hasVisibleWindows) { createWindow(); }
});