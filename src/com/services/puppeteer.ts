import { app, BrowserWindow } from 'electron';
import pie from 'puppeteer-in-electron';
import puppeteer from 'puppeteer-core';

export default async function run() {
    await pie.initialize(app);
    const browser = await pie.connect(app, puppeteer as any);
  
    const window = new BrowserWindow();
    const url = "https://www.youtube.com/";
    await window.loadURL(url);
  
    const page = await pie.getPage(browser, window);
    console.log(page.url());
    window.destroy();
}

