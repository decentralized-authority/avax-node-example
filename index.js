const { app, BrowserWindow, dialog, ipcMain } = require('electron');
const path = require('path');
const nl = require('node-launcher');
const fs = require('fs-extra');

let appWindow, node;

app.on('ready', () => {
  appWindow = new BrowserWindow({
    width: 400,
    height: 600,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'public', 'api.js'),
    }
  });
  appWindow.on('ready-to-show', () => {
    appWindow.show();
  });
  appWindow.loadURL('http://localhost:3000');
});

ipcMain.handle('OPEN_FILE_DIALOG', async (e, options) => {
  const { filePaths } = await dialog.showOpenDialog(options);
  return filePaths;
});

/**
 * Node-related Event Handlers from the UI
 */

ipcMain.handle('CREATE_NODE', async (e, { id, peerPort, rpcPort, rootDir }) => {
  const configPath = path.join(rootDir, 'config.json');
  const walletDir = path.join(rootDir, 'keys');
  const dataDir = path.join(rootDir, 'data');
  const newNode = new nl.AVAX({
    id,
    version: '1.7.1',
    peerPort,
    rpcPort,
    configPath,
    dataDir,
    walletDir,
  });
  await fs.ensureDir(walletDir);
  await fs.ensureDir(dataDir);
  await fs.writeFileSync(configPath, newNode.generateConfig());
  return newNode.toObject();
});

ipcMain.handle('STOP_NODE', async () => {
  await node.stop();
});

const createNodeInstance = (nodeData) => {
  node = new nl.AVAX(nodeData);
  node.on('OUTPUT', console.log);
  node.on('CLOSE', () => {
    appWindow.send('NODE_STATUS', nl.constants.Status.STOPPED);
  });
};

ipcMain.handle('START_NODE', async (e, nodeData) => {
  if(!node)
    createNodeInstance(nodeData);
  await node.start();
  await new Promise(resolve => {
    setTimeout(() => {
      node.getStatus()
        .then(status => {
          appWindow.send('NODE_STATUS', status);
          resolve();
        })
        .catch(console.error);
    }, 2000);
  });
});

ipcMain.on('GET_NODE_STATUS', async () => {
  let status;
  try {
    status = await node.getStatus();
  } catch(err) {
    status = nl.constants.Status.STOPPED;
  }
  appWindow.send('NODE_STATUS', status);
});

ipcMain.on('GET_NODE_VERSION', async () => {
  let version;
  try {
    version = await node.rpcGetVersion();
  } catch(err) {
    version = ''
  }
  appWindow.send('NODE_VERSION', version);
});

ipcMain.on('GET_NODE_UPGRADE', (e, nodeData) => {
  try {
    if(!node)
      createNodeInstance(nodeData);
    const availableUpdate = nl.AVAX.getAvailableUpgrade(node, nl.AVAX.versions(node.client, node.network));
    if(availableUpdate)
      appWindow.send('NODE_UPGRADE', {
        version: availableUpdate.version,
        clientVersion: availableUpdate.clientVersion,
        image: availableUpdate.image,
      });
  } catch(err) {
    // do nothing
  }
});

ipcMain.on('UPGRADE_NODE', async (e, upgrade) => {
  try {
    const isRunning = await node.isRunning();
    if(isRunning)
      await node.stop();
    await nl.AVAX.upgradeNode(node, upgrade);
    appWindow.send('NODE_UPDATED', node.toObject());
    await node.start();
  } catch(err) {
    console.error(err);
  }
});
