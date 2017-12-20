const electron = require('electron');
const url = require('url');
const path = require('path');

const {app, BrowserWindow, Menu, ipcMain} = electron;

let mainWindow;
let addWindow;
let calculatorWindow;

process.env.NODE_ENV = 'production';
//listen for app to be ready
app.on('ready', () => {
    //create new window
    mainWindow = new BrowserWindow({});
    //load html into window
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'mainWindow.html'),
        protocol: 'file:',
        slashes: true
    }));
    
    //Quit app when closed
    mainWindow.on('closed', () => {
        app.quit();
    });
    // Build menu from template
    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
    // Insert menu
    Menu.setApplicationMenu(mainMenu);

});

//Handle create add window 
function createAddWindow(){
    //create new window
    addWindow = new BrowserWindow({
        width: 300,
        height: 200,
        title: 'Add shopping list item'
    });
    //load html into window
    addWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'addWindow.html'),
        protocol: 'file:',
        slashes: true
    }));
    
    //Garbage collection handle
    addWindow.on('close', () => {
        addWindow = null;
    });
}

//Handle create calculator window 
function createCalculatorWindow(){
    //create new window
    calculatorWindow = new BrowserWindow({
        width: 400,
        height: 600,
        title: 'Calculator'
    });
    //load html into window
    calculatorWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'calculatorWindow.html'),
        protocol: 'file:',
        slashes: true
    }));
    
    //Garbage collection handle
    calculatorWindow.on('close', () => {
        calculatorWindow = null;
    });
}

// Catch item add 
ipcMain.on('item:add', (e, item) => {
    console.log(item);
    mainWindow.webContents.send('item:add', item);
    //addWindow.close();
});

// Create menu template
const mainMenuTemplate = [
    {
        label:'File',
        submenu: [
            {
                label: 'Add Item',
                click(){
                    createAddWindow();
                }
            },
            {
                label: 'Calculator',
                click(){
                    createCalculatorWindow();
                }
            },
            {
                label: 'Clear Items',
                click(){
                    mainWindow.webContents.send('item:clear');
                }
            },
            {
                label: 'Quit',
                accelerator: process.platform == 'darwin' ? 'Command+Q' : 'Ctrl+Q',
                click(){
                    app.quit();
                }
            }
        ]
    }
];

// If on mac, add empty object at the beginning of the menu
(process.platform == 'darwin') && mainMenuTemplate.shift({});
// Add developer tools if its not in production mode
if(process.env.NODE_ENV !== 'production'){
    mainMenuTemplate.push({
        label: 'Developer Tools',
        submenu:[
            {
                label: 'Toggle DevTools',
                accelerator: process.platform == 'darwin' ? 'Command+I' : 'Ctrl+I',
                click(item, focusedWindow){
                    focusedWindow.toggleDevTools();
                }
            },
            {
                role: 'reload'
            }
        ]
    })
}