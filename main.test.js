import { describe, it, expect, vi, beforeEach } from 'vitest';
import { parse } from 'csv-parse/sync';
import { registerIpcHandlers } from './src/main/ipc.js';
import { getPaths } from './src/main/paths.js';
import * as fs from 'fs';

vi.mock('fs', () => ({
  readFileSync: vi.fn(),
  writeFileSync: vi.fn(),
  appendFileSync: vi.fn(),
}));
vi.mock('electron-log', () => ({
  info: vi.fn(),
  error: vi.fn(),
}));

// Mock ipcMain and capture handlers
let ipcHandlers = {};
const ipcMain = {
  handle: vi.fn((channel, handler) => {
    ipcHandlers[channel] = handler;
  }),
};

const mockApp = {
  getPath: () => '/tmp/test-userData',
};

const config = {
  fields: [
    { name: 'ID' },
    { name: 'Title' },
    { name: 'Description' },
  ],
};

const initialCsvData = `"ID","Title","Description"
"1","Test Risk","A risk, with a comma"
"2","Another Risk","A risk with a
newline"`;

describe('IPC Handlers', () => {

  beforeEach(() => {
    vi.clearAllMocks();
    ipcHandlers = {}; // Clear handlers before each test

    const paths = getPaths(mockApp);
    registerIpcHandlers(ipcMain, paths);

    fs.readFileSync.mockImplementation((path) => {
      if (path === paths.configPath) {
        return JSON.stringify(config);
      }
      if (path === paths.csvPath) {
        return initialCsvData;
      }
      throw new Error(`ENOENT: no such file or directory, open '${path}'`);
    });
  });

  it('getRisks should parse CSV correctly', async () => {
    const getRisks = ipcHandlers['get-risks'];
    const risks = await getRisks();
    expect(risks).toHaveLength(2);
    expect(risks[0].ID).toBe('1');
    expect(risks[0].Title).toBe('Test Risk');
    expect(risks[0].Description).toBe('A risk, with a comma');
    expect(risks[1].Description).toBe('A risk with a\nnewline');
  });

  it('addRisk should append a new risk', async () => {
    const addRisk = ipcHandlers['add-risk'];
    const newRisk = { ID: '3', Title: 'New Risk', Description: 'A brand new risk' };

    fs.appendFileSync.mockReturnValue(undefined); // Mock the write operation
    await addRisk(null, newRisk);

    expect(fs.appendFileSync).toHaveBeenCalledTimes(1);
    const writtenData = fs.appendFileSync.mock.calls[0][1];
    const parsedData = parse(writtenData.trim(), { columns: false });

    expect(parsedData[0][0]).toBe('3');
    expect(parsedData[0][1]).toBe('New Risk');
    expect(parsedData[0][2]).toBe('A brand new risk');
  });

  it('updateRisk should rewrite the file with updated data', async () => {
    const updateRisk = ipcHandlers['update-risk'];
    const updates = { Title: 'Updated Title' };

    fs.writeFileSync.mockReturnValue(undefined); // Mock the write operation
    await updateRisk(null, { id: '1', updates });

    expect(fs.writeFileSync).toHaveBeenCalledTimes(1);
    const writtenData = fs.writeFileSync.mock.calls[0][1];
    const records = parse(writtenData, { columns: true });

    const updatedRisk = records.find(r => r.ID === '1');
    expect(updatedRisk.Title).toBe('Updated Title');
    expect(records.find(r => r.ID === '2').Title).toBe('Another Risk');
  });

  it('updateRisk should return error if risk not found', async () => {
    const updateRisk = ipcHandlers['update-risk'];
    const updates = { Title: 'Updated Title' };
    const result = await updateRisk(null, { id: '999', updates });
    expect(result.success).toBe(false);
    expect(result.error).toBe('Risk with ID 999 not found.');
  });
});
