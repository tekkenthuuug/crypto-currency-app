const electron = require('electron');
const BrowserWindow = electron.remote.BrowserWindow;
const axios = require('axios');
const ipc = electron.ipcRenderer;

const notifyBtn = document.getElementById('notifyBtn');
let price = document.querySelector('h1');
let targetPrice = document.getElementById('targetPrice');

let targetPriceVal;

const notification = {
	title: 'BTC Alert',
	body: 'BTC just beat your target price!',
	icon: '../assets/images/btc.png'
};

const getBTC = () => {
	axios.get('https://min-api.cryptocompare.com/data/pricemulti?fsyms=BTC&tsyms=USD')
		.then(res => {
			const cryptos = res.data.BTC.USD;
			price.innerHTML = '$' + cryptos.toLocaleString('en');
			if (targetPrice.innerHTML !== '' && targetPriceVal < cryptos) {
				const myNotification = new window.Notification(notification.title, notification);
			}
		});
};

getBTC();
setInterval(getBTC, 10000);

notifyBtn.addEventListener('click', () => {
	let win = new BrowserWindow({ 
		width: 400, 
		height: 200, 
		transparent: true, 
		alwaysOnTop: true,
		frame: false,
		webPreferences: {
			nodeIntegration: true,
		},
	});
	win.on('close', () => {
		win = null;
	});
	win.loadFile('./src/add.html');
	win.show();
});

ipc.on('targetPriceVal', (e, arg) => {
	targetPriceVal = Number(arg);
	targetPrice.innerHTML = '$' + targetPriceVal.toLocaleString('en'); 
});