// eslint-disable-next-line import/no-extraneous-dependencies
import { app, BrowserWindow } from 'electron';

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
    },
  });
  win.webContents.openDevTools();

  // and load the index.html of the app.
  win.loadFile('dist/index.html');
}
app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});
