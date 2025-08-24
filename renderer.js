// renderer.js

const api = window.api || null;

function ensureApi() {
  if (!api) {
    console.error('Preload API missing. Check preload/sandbox settings.');
    (document.querySelector('#content') || document.body)
      .insertAdjacentHTML('afterbegin', '<div style="color:#b00">App API not available. See console.</div>');
    return null;
  }
  return api;
}

// Function to load Risk Register content
const loadRiskRegister = async () => {
  const mainContent = document.getElementById('main-content');
  try {
    const config = await window.api.getConfig();
    const riskData = await window.api.getRisks();

    const table = document.createElement('table');
    table.className = 'risk-table';

    // Create table header
    const thead = table.createTHead();
    const headerRow = thead.insertRow();
    config.fields.forEach(field => {
      const th = document.createElement('th');
      th.textContent = field.name;
      headerRow.appendChild(th);
    });

    // Create table body
    const tbody = table.createTBody();
    const headers = config.fields.map(field => field.name);

    riskData.forEach(risk => {
      const row = tbody.insertRow();
      headers.forEach(header => {
        const cell = row.insertCell();
        cell.textContent = risk[header] || '';
      });
    });

    mainContent.innerHTML = '<h2>Risk Register</h2>';
    mainContent.appendChild(table);

  } catch (error) {
    console.error('Failed to load risk register:', error);
    mainContent.innerHTML = '<p style="color: red;">Error loading risk register. See console for details.</p>';
  }
};

// Function to load AI Processor content
const loadAiProcessor = async () => {
  const mainContent = document.getElementById('main-content');
  mainContent.innerHTML = `
    <h2>AI Document Processor</h2>
    <div class="ai-processor-grid">
      <div class="ai-processor-panel">
        <h3>1. Inbox</h3>
        <p>Files ready for processing.</p>
        <div id="inbox-files">Loading...</div>
      </div>
      <div class="ai-processor-panel">
        <h3>2. Suggested Risks</h3>
        <p>Review risks identified by the AI before importing.</p>
        <div id="suggested-risks"></div>
      </div>
      <div class="ai-processor-panel">
        <h3>3. Processing Log</h3>
        <p>See the status of processed files.</p>
        <div id="processing-log"></div>
      </div>
    </div>
  `;

  try {
    const files = await window.api.listInbox();
    const inboxFilesDiv = document.getElementById('inbox-files');
    if (files.length === 0) {
      inboxFilesDiv.innerHTML = '<p>No files in inbox.</p>';
    } else {
      const fileList = files.map(file => `<div>${file}</div>`).join('');
      inboxFilesDiv.innerHTML = fileList;
    }
  } catch (error) {
    console.error('Failed to list inbox files:', error);
    document.getElementById('inbox-files').innerHTML = '<p style="color: red;">Error loading inbox files.</p>';
  }
};

// Function to load Settings content
const loadSettings = () => {
  const mainContent = document.getElementById('main-content');
  mainContent.innerHTML = '<h2>Settings</h2><p>Display configuration UI here.</p>';
};


// Main DOMContentLoaded listener
document.addEventListener('DOMContentLoaded', () => {
  const mainContent = document.getElementById('main-content');
  const byId = id => document.getElementById(id);

  // Check for API availability
  if (!window.api) {
    console.error('Preload API missing. Check preload logs.');
    // show a toast/banner instead of crashing
  }

  // Default view on launch
  loadRiskRegister();
  byId('nav-risk-register')?.classList.add('active'); // Set initial active state

  // Wire up sidebar navigation
  const navLinks = {
    'nav-risk-register': loadRiskRegister,
    'nav-ai-processor': loadAiProcessor,
    'nav-settings': loadSettings
  };

  document.querySelector('.nav-panel').addEventListener('click', (event) => {
    if (event.target.tagName === 'A') {
      const navId = event.target.id;
      if (navLinks[navId]) {
        navLinks[navId]();

        // Active link styling
        document.querySelectorAll('.nav-panel nav ul li a').forEach(link => link.classList.remove('active'));
        event.target.classList.add('active');
      }
    }
  });
});
