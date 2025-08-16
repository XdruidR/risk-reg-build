# Prompt for Building an AI-Powered Risk Register Application

## 1. Persona

You are an expert full-stack software developer with extensive experience in creating data-driven, user-friendly web applications. You are proficient in Python (with Flask or FastAPI), vanilla JavaScript, HTML, and CSS. You have a keen eye for good UI/UX design and understand how to build applications that are both powerful and intuitive. You are tasked with building a standalone desktop application using web technologies (specifically Electron.js) to solve a critical business need for a risk manager on a major infrastructure project.

## 2. Core Problem to Solve

A Risk & Opportunity Lead on a major Public-Private Partnership (PPP) tender needs a tool to streamline the creation and management of a project risk register. The current workflow involves manually identifying risks from various unstructured documents (meeting notes, technical reports, emails), capturing them in a structured format, and compiling them into a master spreadsheet. This process is tedious, error-prone, and inefficient.

The goal is to create a desktop application that:
-   **Automates Risk Identification:** Uses an LLM API (like Gemini or OpenAI) to process unstructured text and suggest potential risks and opportunities.
-   **Simplifies Data Entry:** Provides a user-friendly interface for creating, editing, and managing risk entries, making it significantly better than a spreadsheet.
-   **Centralizes Data:** Uses a simple, file-based system (`risk_register.csv` for data, `config.json` for settings) that is easy to access, back up, and even open in Excel if needed.
-   **Provides Powerful Visualization:** Allows the user to group, sort, and filter the risk register by any field to gain insights.
-   **Is Highly Configurable:** Allows the user to define the fields, dropdown values, and other parameters of the risk register on-the-fly through the UI.

## 3. Core Functionalities

### 3.1. Document Processing & AI-Powered Risk Identification
-   **File Input:** The user can upload one or more documents (`.txt`, `.md`, `.pdf`, `.docx`).
-   **AI Analysis:** The user can select an LLM provider (Gemini/OpenAI - requires user's API key) and send the content of the uploaded document(s) to the API.
-   **Structured Output:** The application will prompt the LLM to identify potential risks and opportunities based on the text and return them in a structured JSON format that matches the fields defined in `config.json`.
-   **Review & Import:** The identified risks are displayed in a temporary holding area in the UI. The user can review, edit, or discard each suggested risk before importing them into the main risk register.

### 3.2. Risk Register Management (CRUD Operations)
-   **View Risks:** Display the `risk_register.csv` in a clean, sortable, and filterable table.
-   **Create/Add Risk:** A dedicated "Add New Risk" form that uses the fields and validation rules from `config.json`. Dropdowns should be populated from the config file.
-   **Edit Risk:** Ability to edit any risk directly in the table view or via a modal/form.
-   **Delete Risk:** Ability to delete one or more selected risks.
-   **Live Sync:** All CRUD operations must immediately update both the UI and the underlying `risk_register.csv` and `config.json` files. There is no "save" button for the register itself; changes are saved automatically.

### 3.3. Configuration Management
-   **UI for Configuration:** A dedicated "Settings" or "Configuration" page where the user can manage the `config.json` file.
-   **Field Management:** The user can add, remove, and reorder fields for the risk register.
-   **Dropdown Management:** For fields designated as "dropdowns," the user can add, edit, or remove the valid options (e.g., for "Risk Status", the user can manage "Open", "Closed", "Draft").
-   **Impact Matrix Configuration:** A dedicated interface to manage the `Impact Matrix` within the `config.json`. The user should be able to edit the definitions, values, and categories (Cost, Time, etc.).

### 3.4. Data Visualization & Reporting
-   **Grouping:** Allow the user to group the risk register data by any categorical field (e.g., "Risk Owner", "RBS", "Status"). This should create collapsible sections in the UI.
-   **Filtering & Sorting:** Advanced filtering options for all columns (e.g., text search, date range, dropdown selection). All columns should be sortable.
-   **CSV Export:** While the main file is a CSV, provide an explicit "Export to CSV" button that ensures the currently filtered/sorted view can be exported if needed.

## 4. User Interface (UI) & User Experience (UX)

-   **Layout:** A clean, modern, two-panel layout.
    -   **Left Panel (Navigation):** Simple navigation links: "Risk Register", "AI Document Processor", "Settings".
    -   **Right Panel (Main Content):** Displays the content for the selected navigation link.
-   **Risk Register View:**
    -   A full-width, spreadsheet-like table but with better controls (e.g., rich filtering options in each column header).
    -   Use alternating row colors for readability.
    -   Risk ratings should be color-coded based on severity (e.g., Red for High, Amber for Medium, Green for Low).
-   **AI Document Processor View:**
    -   A simple drag-and-drop area for file uploads.
    -   A "Process Documents" button that becomes active after files are added.
    -   A clear "review" area where suggested risks appear post-processing, with "Import" or "Discard" buttons for each.
-   **Settings View:**
    -   Use intuitive UI elements like drag-and-drop for reordering fields, and simple forms for adding/editing field properties and dropdown values.
-   **No Spreadsheets:** The experience must feel like a dedicated application, not just a wrapper for a CSV file. The UI should be the primary way of interacting with the data.

## 5. Technical Stack & Architecture

-   **Framework:** **Electron.js**. This is crucial as it needs to be a standalone desktop application that can read/write to the local file system directly and easily.
-   **Frontend:** **Vanilla JavaScript, HTML, and CSS.** No complex frontend frameworks (like React or Vue) are necessary. Keep it simple and lightweight.
-   **Backend (within Electron):** **Node.js** for file system operations (`fs` module) to read/write `risk_register.csv` and `config.json`.
-   **Data Storage:**
    -   **`risk_register.csv`:** The single source of truth for all risk data. The app reads from and writes to this file directly. The file should be created if it doesn't exist.
    -   **`config.json`:** The single source of truth for the application's configuration. This file defines the schema of the risk register, all dropdown options, and the impact matrix. The app reads from and writes to this file directly. A default version should be created if it doesn't exist.

## 6. Data Structures (Initial State)

### `config.json`
Create a default `config.json` file on first launch if one doesn't exist. It should contain the complete structure from the `risk_capture_template.md`, including the full `Impact Matrix`.

*(You should embed the full JSON structure from the provided `risk_capture_template.md` here in the prompt, including the entire `Impact Matrix`)*

### `risk_register.csv`
The header row of the `risk_register.csv` file must be dynamically generated from the fields defined in `config.json`.

## 7. Final Deliverable

A complete, runnable Electron.js application project. The code should be well-structured, commented, and easy to understand. Provide a `README.md` with simple instructions on how to run the application (`npm install` and `npm start`).