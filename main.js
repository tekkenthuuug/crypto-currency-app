const { app, BrowserWindow, Menu, shell, ipcMain } = require('electron');

let win;

const isDevelopment = !app.isPackaged;

function createWindow () {
	win = new BrowserWindow({
		minWidth: 800,
		height: 600,
		webPreferences: {
			nodeIntegration: true,
		},
	});

	win.loadFile('./src/index.html');

	win.on('close', () => {
		app.quit();
	});

	const menuTemplate = [
		{
			label: 'Menu',
			submenu: [
				{
					label: 'Adjust notification value',
				},
				{
					label: 'CoinMarketCap',
					click: () => {
						shell.openExternal('http://coinmarketcap.com');
					}
				},
				{type: 'separator'},
				{
					label: 'Exit',
					click: () => {
						app.quit();
					},
				},
			],
		},
	];

	if (isDevelopment) {
		menuTemplate.push({
			label: 'Toggle dev tools',
			click: (item, focusedWindow) => {
				focusedWindow.toggleDevTools();
			}
		});
	}

	let menu = Menu.buildFromTemplate(menuTemplate);

	Menu.setApplicationMenu(menu);
}

app.setAppUserModelId(process.execPath);

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('activate', () => {
	if (BrowserWindow.getAllWindows().length === 0) {
		createWindow();
	}
});

ipcMain.on('update-notify-value', (e, arg) => {
	win.webContents.send('targetPriceVal', arg);
});