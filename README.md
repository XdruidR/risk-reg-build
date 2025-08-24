# AI-Powered Risk Register Application

## Overview

This is a standalone desktop application built with **Electron** to streamline the creation and management of a project risk register. It replaces manual, spreadsheet-based workflows with a user-friendly interface and leverages AI to process unstructured documents into structured risk data.

**Key Goals:**

* **Automated Risk Identification** – Use LLM APIs (Gemini, OpenAI, Anthropic, etc.) to parse documents and suggest risks or opportunities.
* **Simplified Data Entry** – Provide a clean UI for adding, editing, and reviewing risks.
* **Centralized Local Data** – Store configuration and data in simple, human-readable files (`config.json` and `risk_register.csv`).

## Getting Started

### Prerequisites

* [Node.js](https://nodejs.org/) (LTS recommended)
* [npm](https://www.npmjs.com/)

### Installation & Launch

```bash
# Clone the repository
git clone <repo-url>
cd ai-risk-register

# Install dependencies
npm install

# Start the app
npm start
```

### First-Run Behavior / Architecture

On first launch, the app will generate the following files and folders in the user's local app data directory (`<userData>/ai-risk-register`) if they are missing:

* `risk_register.csv` → CSV with headers from `config.json`.
* `config.json` → Defines fields, dropdowns, and impact matrices.
* Folders → `inbox/`, `processed/`, and `logs/` (for document intake and tracking).

Runtime paths are resolved from Electron's `userData` directory and are initialized only after the `app.ready` event to ensure testability and predictable behavior.

### Data Storage

All data is stored in plain files under the **user’s local app data directory** (not the install folder):

* `risk_register.csv` – Risk records.
* `config.json` – Schema and dropdown options.
* `inbox/`, `processed/` – Documents for AI ingestion.

## Application Architecture

* **Electron** – Desktop container.
* **Node.js (Main Process)** – Handles file I/O, API calls, and system logic.
* **Renderer (Frontend)** – HTML/CSS/JS for UI. Communicates via `ipcMain`/`ipcRenderer`.
* **Preload Layer** – Secure bridge exposing only whitelisted APIs to renderer.

### File Layout

```
├── main.js         # Electron entry point
├── preload.js      # Secure API bridge
├── renderer.js     # Frontend logic
├── index.html      # Main UI
├── style.css       # Styling
├── config.json     # Schema & defaults
├── risk_register.csv # Risk register data
└── inbox/processed/logs # Data directories
```

## Configuration

The schema is driven by `config.json`. Default fields include:

| Field                               | Type     | Options                                                                                                                                                                                                       |
| ----------------------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Risk Status                         | dropdown | Draft, Open, Closed                                                                                                                                                                                           |
| ID                                  | text     | -                                                                                                                                                                                                             |
| Source                              | text     | -                                                                                                                                                                                                             |
| RBS                                 | dropdown | Customers/Stakeholders, Business/Government, Management Controls & Systems, Financial, Commercial & Legal, Environment & Sustainability, Safety & Security, Planning, Design, Procurement, Construction, O\&M |
| Title: Description                  | textarea | -                                                                                                                                                                                                             |
| Threat / Opportunity                | dropdown | Threat, Opportunity                                                                                                                                                                                           |
| Causes                              | tags     | -                                                                                                                                                                                                             |
| Consequences                        | text     | -                                                                                                                                                                                                             |
| Existing Controls                   | tags     | -                                                                                                                                                                                                             |
| Control effectiveness               | dropdown | High, Good, Effective, Moderate, Partially Effective, Ineffective                                                                                                                                             |
| Leading Consequence Category        | dropdown | Cost, Time, Health & Safety, Quality, Environmental, Legal, Social                                                                                                                                            |
| Other Relevant Consequence Category | dropdown | Cost, Time, Health & Safety, Quality, Environmental, Legal, Social                                                                                                                                            |
| Max Consequence Level               | text     | -                                                                                                                                                                                                             |
| Likelihood Level                    | dropdown | Rare (<0.4%), Very Unlikely (0.4%-2%), Unlikely (2%-10%), Possible (10%-50%), Likely (50%-90%), Very Likely (>90%)                                                                                            |
| Risk Rating                         | text     | -                                                                                                                                                                                                             |
| Risk Owner                          | text     | -                                                                                                                                                                                                             |
| Decision                            | dropdown | Within Tolerance, Treat, Transfer                                                                                                                                                                             |
| Comments                            | textarea | -                                                                                                                                                                                                             |
| Treatment Actions                   | textarea | -                                                                                                                                                                                                             |

## AI Integration

To use AI-powered risk identification:

1. Go to **AI Document Processor** in the app.
2. Enter your LLM provider API key (stored securely via OS keychain, not config files).
3. Drop a document in `inbox/` and click **Process**.
4. Suggested risks appear in **Suggested Risks**, where you can review/edit before import.

## Testing

The application includes automated tests for the core IPC and path handling logic.

To run the tests:
```bash
npm test
```

Manual testing is also recommended:

1. Run the app → `npm start`.
2. Test CRUD operations: add, edit, delete risks.
3. Confirm changes in `risk_register.csv`.
4. Place a document in `inbox/` and test AI processing.
5. Check that settings reflect `config.json`.

## Roadmap (Next Steps)

* [ ] Implement secure API key storage (`keytar`).
* [ ] Improve CSV parsing (switch to `csv-parse` or `papaparse`).
* [ ] Add form-based **Add/Edit Risk** modal.
* [ ] Build validation pipeline (Zod/AJV for AI JSON output).
* [ ] Add risk scoring & heatmap visualization.
* [ ] Package app with `electron-builder` for distribution.