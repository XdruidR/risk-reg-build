const fs = require('fs');
const log = require('electron-log');
const { parse } = require('csv-parse/sync');
const { stringify } = require('csv-stringify/sync');

const getConfig = (paths) => async () => {
  const data = fs.readFileSync(paths.configPath, 'utf8');
  return JSON.parse(data);
};

const getRisks = (paths) => async () => {
  const data = fs.readFileSync(paths.csvPath, 'utf8');
  const records = parse(data, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
    bom: true,
  });
  return records;
};

const listInbox = (paths) => async () => {
  const files = fs.readdirSync(paths.inboxDir);
  return files;
};

const addRisk = (paths) => async (event, riskObj) => {
  try {
    const configData = JSON.parse(fs.readFileSync(paths.configPath, 'utf8'));
    const headers = configData.fields.map(field => field.name);

    const csvString = stringify([riskObj], { header: false, columns: headers, quoted: true });
    fs.appendFileSync(paths.csvPath, csvString);

    log.info('Added new risk:', riskObj.ID);
    return { success: true };
  } catch (error) {
    log.error('Failed to add risk:', error);
    return { success: false, error: error.message };
  }
};

const updateRisk = (paths) => async (event, { id, updates }) => {
  try {
    const configData = JSON.parse(fs.readFileSync(paths.configPath, 'utf8'));
    const headers = configData.fields.map(field => field.name);

    const data = fs.readFileSync(paths.csvPath, 'utf8');
    const records = parse(data, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
      bom: true,
    });

    const riskIndex = records.findIndex(risk => risk.ID === id);

    if (riskIndex === -1) {
      throw new Error(`Risk with ID ${id} not found.`);
    }

    records[riskIndex] = { ...records[riskIndex], ...updates };

    const csvString = stringify(records, { header: true, columns: headers, quoted: true });
    fs.writeFileSync(paths.csvPath, csvString);

    log.info(`Updated risk ${id}`);
    return { success: true };
  } catch (error) {
    log.error(`Failed to update risk ${id}:`, error);
    return { success: false, error: error.message };
  }
};

function registerIpcHandlers(ipcMain, paths) {
  ipcMain.handle('get-config', getConfig(paths));
  ipcMain.handle('get-risks', getRisks(paths));
  ipcMain.handle('list-inbox', listInbox(paths));
  ipcMain.handle('add-risk', addRisk(paths));
  ipcMain.handle('update-risk', updateRisk(paths));
}

module.exports = {
  // We no longer need to export the individual handlers for testing
  registerIpcHandlers,
};
