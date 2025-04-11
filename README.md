# Visualization App

## Overview

The Visualization App is a web application designed to generate visualizations from user-supplied scripts written in **Python** or **R**. The project is divided into two main parts:

- **Frontend:**  
  - Built with Angular (using standalone components) and Angular Material for UI components and theming.
  - Provides an interface that allows users to select the scripting language, input their visualization code, and view the generated output (displayed in an iframe).

- **Backend:**  
  - Built with Node.js and Express.
  - Receives the code and language selection via an API endpoint.
  - Dynamically executes the supplied code using child processes (via Python or R) and appends hardcoded file-saving commands based on the libraries detected:
    - For Python, uses **Matplotlib** (for static images) or **Plotly** (for interactive and 3D visualizations with Kaleido).
    - For R, uses **ggplot2** (for static plots) or **Plotly** (for interactive and 3D plots via htmlwidgets).
  - Generated visualization files (PNG or HTML) are saved in the backend’s public folder and served as absolute URLs.

**System Requirements:**  
Before running this application, ensure that the system has both **Python** and **R** installed along with the necessary libraries/packages:

- **Python:** Must have libraries such as `matplotlib`, `plotly`, and `kaleido` installed.
- **R:** Must have packages such as `ggplot2`, `plotly`, and `htmlwidgets` installed.

*Note:* The saving mechanism is hardcoded in the backend—commands such as `plt.savefig` (Python) and `ggsave` (R) with specified dimensions and DPI are appended automatically to the user’s code prior to execution.

## Issues Encountered and Steps Taken

1. **CORS Issues:**  
   - *Problem:* Angular (running on port 4200) and the Node.js backend (port 3000) had cross-origin request conflicts.  
   - *Resolution:* The `cors` middleware was installed and enabled in the backend to allow cross-origin requests.

2. **Relative URL Problem for Static Assets:**  
   - *Problem:* Initial responses returned relative URLs (e.g., `/static/...`), causing the Angular app to look for assets on the wrong port.  
   - *Resolution:* Modified the backend to return absolute URLs (e.g., `http://localhost:3000/static/<filename>`) ensuring that assets load correctly.

3. **Dynamic Code Execution & File Saving:**  
   - *Problem:* Ensuring that both Python and R code executed correctly and that the resulting visualizations were saved in a controlled manner.  
   - *Resolution:* The backend now checks the submitted code for library imports (e.g., `import plotly` in Python or `library(plotly)` in R) and appends the appropriate saving command. This command is hardcoded with parameters for file dimensions, DPI, and output format (PNG for static and HTML for interactive visualizations).

4. **Dependency Issues & Environment Setup:**  
   - *Problem:* Required libraries for Plotly saving (e.g., Pandoc) were missing in some environments, and R was not finding packages like `ggplot2`.  
   - *Resolution:* Instructions have been provided to install Pandoc (and necessary R packages) on the system. The application documentation specifies that Python and R must be preinstalled with all required libraries and packages for the application to run correctly.

## Running the Application

### Backend Setup

1. Navigate to the `backend/` directory.
2. Install dependencies with:
   ```bash
   npm install
3. Ensure that both Python and R are installed on the system, and the following are available:
    - For Python: matplotlib, plotly, kaleido, etc.
    - For R: ggplot2, plotly, htmlwidgets, etc.
4. Start the backend server:
   ```bash
   npm start

### Frontend Setup

1. Navigate to the `frontend/visualization-app-frontend/` directory.
2. Install dependencies with:
   ```bash
   npm install
3. Start the Angular development server:
   ```bash
   ng serve
4. Open your browser and navigate to http://localhost:4200 to use the application.

## Conclusion

The Visualization App demonstrates a modern, language-agnostic approach to rendering visualizations. By integrating Angular for the frontend and Node.js for secure, dynamic code execution on the backend, the app supports generating static, interactive, and 3D visualizations using Python and R.
Please note that both Python and R must be installed on the system with their respective libraries, and the file-saving functionality in the backend is hardcoded for consistent output.

## Application working video

[Click here to view the demo video](https://drive.google.com/uc?id=1ytAgGhbWc0jQpcAZhQb1xZg2kEiCr9xD&export=download)
