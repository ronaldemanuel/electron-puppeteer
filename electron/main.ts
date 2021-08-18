import { app, BrowserView, BrowserWindow, ipcMain } from 'electron';
import pie from "puppeteer-in-electron";
import puppeteer from "puppeteer-core";
import { Browser, Page } from 'puppeteer-in-electron/node_modules/@types/puppeteer';

let mainWindow: BrowserWindow | null
let page: Page
let browser: Browser

declare const MAIN_WINDOW_WEBPACK_ENTRY: string
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string

// const assetsPath =
//   process.env.NODE_ENV === 'production'
//     ? process.resourcesPath
//     : app.getAppPath()

const initializePuppeteer = async () => {
  await pie.initialize(app);
  browser = await pie.connect(app, puppeteer as any);
}

initializePuppeteer()

const createWindow = () => {
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

  const url = MAIN_WINDOW_WEBPACK_ENTRY;
  mainWindow.loadURL(url);
};


async function registerListeners() {
  /**
   * This comes from bridge integration, check bridge.ts
   */
  ipcMain.on('message', (_, message) => {
    console.log(message)
  })

  ipcMain.on('run', async () => {
    const view = new BrowserView({ webPreferences: {} })

    mainWindow?.setBrowserView(view)

    const viewWidth = mainWindow!.getSize()[0] * 0.9;
    const viewHeight = mainWindow!.getSize()[1] * 0.9;

    const viewX = mainWindow!.getSize()[0] * 0.05;
    const viewY = mainWindow!.getSize()[1] * 0.05;

    view.setBounds({ x: viewX, y: viewY, width: viewWidth, height: viewHeight })
    view.setAutoResize({ height: true, width: true })
    await view.webContents.loadURL('https://facebook.com')

    page = await pie.getPage(browser, view);
    console.log(page.url());
  })
}

app.on('ready', createWindow)
  .whenReady()
  .then(registerListeners)
  .then()
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