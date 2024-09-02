const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const axios = require('axios');
const cheerio = require('cheerio');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  mainWindow.loadFile('index.html');
  mainWindow.center();

  // Open the DevTools automatically
  // mainWindow.webContents.openDevTools();
}

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

ipcMain.on('search-food', async (event, { foodName, weight }) => {
  const url = `https://www.fatsecret.it/calorie-nutrizione/search?q=${encodeURIComponent(foodName)}`;

  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    const caloriesElement = $('.smallText.greyText.greyLink').first();
    const caloriesText = caloriesElement.text().trim();

    console.log(`Found calories text: ${caloriesText}`);

    event.reply('food-result', caloriesText); // Send back the calorie information
  } catch (error) {
    event.reply('food-result', 'Errore durante la ricerca delle calorie.');
    console.error(error);
  }
});
