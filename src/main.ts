import { app, BrowserWindow, ipcMain, IpcMainEvent } from "electron";
import * as path from "path";

// ClientId вашего приложения
// Приложение создается тут https://oauth.yandex.ru/client/new
const CLIENT_ID = '<ClientId вашего приложения>';
// Можно указать какой пожелаете, главное чтобы яндекс не жаловался на невалидность url, иначе будет ошибка при попытке редиректа
// Указывается при создании приложения
// Важно, в конце должен быть '/', но только в CALLBACK_URL, фильтр запросов требует path
const CALLBACK_URL = 'http://localhost:9589/';
const AUTH_URL = `https://oauth.yandex.ru/authorize?response_type=token&client_id=${CLIENT_ID}`;
const REQUEST_FILTER = { urls: [CALLBACK_URL] };

//Паттерн позволяет достать сразу токен и время истечения токена
const REGEX_PATTERN = /access_token=([^&]*).+expires_in=(\d+)/si;

let mainWindow: BrowserWindow;

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    autoHideMenuBar: true,
    title: 'Yandex OAuth example app',
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  mainWindow.loadFile(path.join(__dirname, "../index.html"));

  ipcMain.on('auth-window', function (event: IpcMainEvent) {
    createLoginWindow(event);
  });
}

app.on("ready", () => {
  createMainWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createMainWindow();
  });

  ipcMain.on('logout', (event) => {
    let defaultSession = getDefaultSession();
    defaultSession.clearStorageData();
    event.sender.send('logout-processed');
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

function createLoginWindow(event: IpcMainEvent) {
  let authWindow = new BrowserWindow({
    center: true,
    minimizable: false,
    closable: true,
    maximizable: false,
    autoHideMenuBar: true,
    skipTaskbar: true,
    show: false,
    fullscreenable: false,
    backgroundColor: 'black',
    width: 440,
    height: 750,
    maxHeight: 750,
    maxWidth: 440,
    minHeight: 750,
    minWidth: 440,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    }
  });

  authWindow.once("ready-to-show", () => {
    authWindow.show()
  });

  authWindow.once("closed", () => {
    authWindow.removeAllListeners();
    authWindow = null;
  });

  mainWindow.once('close', () => {
    if (authWindow != null)
      authWindow.close();
  });

  let defaultSession = getDefaultSession();
  defaultSession.webRequest.onBeforeRequest(REQUEST_FILTER, (details, callback) => {
    event.sender.send('auth-info', ParseAuthInfo(details.url));
    authWindow.close();
    callback({});
  });

  authWindow.loadURL(AUTH_URL);
}

function getDefaultSession(): Electron.Session {
  const { session } = require('electron');
  return session.defaultSession;
}

function ParseAuthInfo(url: string) {
  let regexMath = url.match(REGEX_PATTERN)!;
  let token = regexMath[1];
  let expires = Number(regexMath[2]);
  let result = Object.assign({
    token,
    expires
  });
  return result;
}