import { app, BrowserWindow, ipcMain, Menu, MenuItem, globalShortcut} from 'electron'
import {URL} from 'url'
import fetch from 'node-fetch'
import querystring from 'querystring'
import electronLocalshortcut from 'electron-localshortcut'

var options = {
  client_id: 'ab8b599de3eb9f9633cd',
  client_secret: '673003bf555c5e07831f3df6e870cfdde89a1512',
  scope: 'repo'
}

// 来自 index.html，打开 oauth 窗口
ipcMain.on('no-token', function (event) {
  createAuthWindow()
})

ipcMain.on('oauth-login', function (event) {
  const authUrl = `https://github.com/login/oauth/authorize?client_id=${options.client_id}&scope=${options.scope}`
  authWindow.loadURL(authUrl);
})

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow, authWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`


function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 600,
    // useContentSize: true,
    width: 1000,
  })

  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  // see https://github.com/parro-it/electron-localshortcut
  // from https://github.com/electron/electron/issues/1334#issuecomment-224181021
  electronLocalshortcut.register(mainWindow, 'Command+W', () => {
    mainWindow.minimize()
  })
}

function createAuthWindow() {
  authWindow = new BrowserWindow({
    width: 300,
    height: 400,
  })

  const authUrl = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080#auth`
  : `file://${__dirname}/index.html#auth`

  authWindow.loadURL(authUrl)

  // 显示授权窗口，隐藏主窗口
  mainWindow.hide()

  authWindow.on('closed', function () {
    authWindow = null;
  })

  // 监听 url 变化
  authWindow.webContents.on('did-get-redirect-request', function (event, oldUrl, newUrl) {
    // 进入页面 http://localhost:3000/cb?code=xxxxxxxxxxxxxx 该页面是 OAuth APP 设置的回调页面
    if (newUrl.includes('code')) {
      const code = new URL(newUrl).searchParams.get('code')

      // code 换取 token
      const params = {
        code, client_id: options.client_id, client_secret: options.client_secret
      }

      fetch('https://github.com/login/oauth/access_token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(params)
      })
      .then(res => {
        res.text().then(res => {
          let token = querystring.parse(res).access_token

          // 将 token 回传到 index.html
          mainWindow.webContents.send('send-token', token)

          // 关闭 authWindow && 显示 mainWindow
          authWindow.close()
          mainWindow.show()
        })
      })
      .catch(e => {
        console.log(e);
      })
    }
  })
}

app.on('ready', function() {
  createWindow()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})