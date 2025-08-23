const { app } = require('electron');
const path = require('path');

const userDataRoot = path.join(app.getPath('userData'), 'ai-risk-register');
const dataDir = path.join(userDataRoot, 'data');
const inboxDir = path.join(userDataRoot, 'inbox');
const processedDir = path.join(userDataRoot, 'processed');
const logsDir = path.join(userDataRoot, 'logs');

const configPath = path.join(dataDir, 'config.json');
const csvPath = path.join(dataDir, 'risk_register.csv');
const logFile = path.join(logsDir, 'app.log');

module.exports = {
  userDataRoot,
  dataDir,
  inboxDir,
  processedDir,
  logsDir,
  configPath,
  csvPath,
  logFile
};
