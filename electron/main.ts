import { app, BrowserWindow, ipcMain } from 'electron';
import run from '../src/com/services/puppeteer';
import pie from 'puppeteer-in-electron';
import puppeteer from 'puppeteer-core';
let mainWindow: BrowserWindow | null

// declare const MAIN_WINDOW_WEBPACK_ENTRY: string
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string

// const assetsPath =
//   process.env.NODE_ENV === 'production'
//     ? process.resourcesPath
//     : app.getAppPath()

async function createWindow () {
  await pie.initialize(app);

  const browser = await pie.connect(app, puppeteer as any);

  const url = 'https://www.youtube.com';
  
  mainWindow = new BrowserWindow({
    // icon: path.join(assetsPath, 'assets', 'icon.png'),
    width: 1100,
    height: 700,
    backgroundColor: '#191622',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY
    }
  })

  mainWindow.loadURL(url)

  
  mainWindow.on('closed', () => {
    mainWindow = null
  })
  const page = await pie.getPage(browser, mainWindow);

  console.log(page.url());
  
}

async function registerListeners () {
  /**
   * This comes from bridge integration, check bridge.ts
   */
  ipcMain.on('message', (_, message) => {
    console.log(message)
  })

  ipcMain.on('run', () => {
    run();
  })
}

app.on('ready', createWindow)
  .whenReady()
  .then(registerListeners)
  .catch(e => console.error(e))

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})
