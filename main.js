const { app, BrowserWindow, Menu, dialog } = require('electron');

const createApp = () => {
    const win = new BrowserWindow({
        width: 500,
        height: 600,
        webPreferences: {
            contextIsolation: false,
            nodeIntegration: true,
        },
        resizable: false
    });

    const menuTemplate = [
        {
            label: 'File',
            submenu: [
                {
                    label: 'Open',
                    accelerator: 'CmdOrCtrl+O',
                    click: async () => {
                        const openFile = await dialog.showOpenDialog(win, {
                            properties: ['openFile'],
                            filters: [
                                { name: 'Musics', extensions: ['mp3', 'wav'] }
                            ]
                        });
                        const filepath = openFile.filePaths[0];
                        win.webContents.send('open-file', filepath);
                    }
                },
                {
                    type: 'separator'
                },
                {
                    role: 'quit'
                }
            ]
        }
    ]

    const menu = Menu.buildFromTemplate(menuTemplate);
    Menu.setApplicationMenu(menu)
    
    win.loadFile('index.html');
}

app.whenReady().then(createApp);