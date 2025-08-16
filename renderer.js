document.addEventListener('DOMContentLoaded', () => {
    const mainContent = document.getElementById('main-content');

    const loadRiskRegister = async () => {
        try {
            const config = await window.electronAPI.getConfig();
            const riskData = await window.electronAPI.getRisks();
            
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
            const rows = riskData.trim().split('\n');
            const dataRows = rows.slice(1); // Skip header row

            dataRows.forEach(rowData => {
                const row = tbody.insertRow();
                const cells = rowData.split(',');
                cells.forEach(cellData => {
                    const cell = row.insertCell();
                    cell.textContent = cellData.replace(/"/g, ''); // Clean up quotes
                });
            });

            mainContent.innerHTML = '<h2>Risk Register</h2>';
            mainContent.appendChild(table);

        } catch (error) {
            console.error('Failed to load risk register:', error);
            mainContent.innerHTML = '<p style="color: red;">Error loading risk register. See console for details.</p>';
        }
    };

    const loadAiProcessor = async () => {
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
            const files = await window.electronAPI.listInbox();
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

    const navLinks = {
        'nav-risk-register': loadRiskRegister,
        'nav-ai-processor': loadAiProcessor,
        'nav-settings': () => { mainContent.innerHTML = '<h2>Settings</h2><p>Display configuration UI here.</p>'; }
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

    // Load risk register by default
    loadRiskRegister();
    document.getElementById('nav-risk-register').classList.add('active');
});