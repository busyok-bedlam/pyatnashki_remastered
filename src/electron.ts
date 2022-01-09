// eslint-disable-next-line import/no-extraneous-dependencies
import { app, BrowserWindow } from 'electron';

const NODE_ENV = process.env.NODE_ENV || 'development';
function createWindow() {
  const win = new BrowserWindow({
    width: 600,
    height: 640,
    webPreferences: {
      nodeIntegration: true,
    },
  });
  // and load the index.html of the app.
  const pathToHTML = NODE_ENV === 'production' ? 'dist/index.html' : 'index.html';
  win.loadFile(pathToHTML);
}
app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});
