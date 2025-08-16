# AI-Powered Risk Register Application

This is a standalone desktop application built with Electron to streamline the creation and management of a project risk register. It is designed to replace manual, spreadsheet-based workflows by providing a user-friendly interface and leveraging AI to process unstructured documents.

---

## How to Run the Application

1.  **Navigate to the `APP` directory** in your terminal.
2.  **Install dependencies:** If you haven't already, run the following command. This only needs to be done once.
    ```bash
    npm install
    ```
3.  **Start the application:**
    ```bash
    npm start
    ```

---

## Current Status

The application is in a foundational stage. The following features have been successfully implemented:

-   **Electron Shell:** The basic application window and process management are in place.
-   **UI Structure:** A two-panel layout with navigation for "Risk Register," "AI Document Processor," and "Settings."
-   **Data Persistence:**
    -   `config.json`: Stores the schema for the risk register, including all fields, dropdowns, and the impact matrix.
    -   `risk_register.csv`: Stores the actual risk data.
-   **Risk Register View:** The application successfully reads the config and CSV files on launch and dynamically renders the risk register in a styled table.
-   **Workflow Directory Structure:** `inbox` and `processed` folders have been created to manage the document processing flow.
-   **AI Processor UI:** The UI for the AI processor is set up and correctly lists files found in the `inbox` directory.

---

## Next Steps for Development

To complete the core functionality, the following features need to be implemented:

1.  **Implement CRUD Operations for Risks:**
    -   **Create:** Add a form (modal or dedicated view) to add new risks to the `risk_register.csv`.
    -   **Update:** Allow inline editing or a form to modify existing risks.
    -   **Delete:** Add functionality to remove risks from the register.
    *All operations must write back to the `risk_register.csv` file immediately.*

2.  **Build the Settings Page:**
    -   Create the UI for the "Settings" page to allow dynamic management of the `config.json` file.
    -   Implement logic to add/remove/reorder fields and manage dropdown options.

3.  **Implement the AI Processing Logic:**
    -   Add an interface on the "AI Document Processor" page for the user to enter their LLM API key (e.g., for Gemini or OpenAI).
    -   When a file from the "Inbox" is selected and a "Process" button is clicked, the application should:
        a. Read the content of the selected file.
        b. Send the content to the chosen LLM API with a carefully crafted prompt to extract risks.
        c. Receive the structured JSON response from the API.
        d. Display the suggested risks in the "Suggested Risks" panel for user review.
        e. Provide "Import" buttons to add a suggested risk to the main `risk_register.csv`.
        f. Move the processed file from the `inbox` to the `processed` folder.
        g. Log the operation in the "Processing Log" panel.