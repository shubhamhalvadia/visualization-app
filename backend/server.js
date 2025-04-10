// backend/server.js
const cors = require('cors');
const express = require('express');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();

// Enable CORS
app.use(cors());

// Middleware to parse JSON payloads.
app.use(express.json());

// Serve static files from the "public" directory.
app.use('/static', express.static(path.join(__dirname, 'public')));

// POST endpoint for generating visualizations.
app.post('/api/generate', (req, res) => {
  const { language, code } = req.body;
  if (!language || !code) {
    return res.status(400).json({ error: 'Both language and code are required.' });
  }

  // Create a unique filename for the output image.
  const outputFilename = `${uuidv4()}.png`;
  const outputFilePath = path.join(__dirname, 'public', outputFilename);

  let scriptFile = '';
  let scriptContent = '';

  if (language.toLowerCase() === 'python') {
    // Check if the code uses Plotly (assumes interactive code if 'import plotly' is present)
    const isPlotly = code.includes('import plotly');
    // Set file extension based on whether it's interactive or static.
    const extension = isPlotly ? '.html' : '.png';
    const outputFilename = `${uuidv4()}${extension}`;
    const outputFilePath = path.join(__dirname, 'public', outputFilename);
  
    scriptFile = path.join(__dirname, 'temp_script.py');
    let savingCommand = '';
  
    if (isPlotly) {
      // Assume the user creates a figure named 'fig'
      savingCommand = "\nif 'fig' in globals():" +
                      "\n    fig.write_html(r'" + outputFilePath + "', include_plotlyjs='cdn')\n";
    } else {
      savingCommand = "\nimport matplotlib.pyplot as plt\nplt.savefig(r'" + outputFilePath + "')\n";
    }
    
    // Append the appropriate saving command to the user submitted code.
    scriptContent = `${code}${savingCommand}`;
    
    fs.writeFileSync(scriptFile, scriptContent);

    exec(`python3 ${scriptFile}`, { timeout: 10000 }, (error, stdout, stderr) => {
      if (error) {
        console.error('Python execution error:', error);
        return res.status(500).json({ error: 'Error executing Python code.' });
      }
      return res.json({ visUrl: `http://localhost:3000/static/${outputFilename}` });
    });

  } else if (language.toLowerCase() === 'r') {
    // Check if the R code uses Plotly (assumes interactive code if 'library(plotly)' is present)
    const isPlotly = code.includes('library(plotly)');
    // Set file extension based on whether it's interactive or static.
    const extension = isPlotly ? '.html' : '.png';
    const outputFilename = `${uuidv4()}${extension}`;
    const outputFilePath = path.join(__dirname, 'public', outputFilename);
    
    scriptFile = path.join(__dirname, 'temp_script.R');
    let savingCommand = '';
    
    if (isPlotly) {
      // For interactive Plotly charts in R, we assume the chart is stored in variable 'p'
      // and use htmlwidgets to save the interactive chart as an HTML file.
      savingCommand = "\nif(exists('p')) {" +
                      "\n  library(htmlwidgets);" +
                      "\n  saveWidget(as_widget(p), file = '" + outputFilePath + "', selfcontained = TRUE);" +
                      "\n}\n";
    } else {
      // For static plots using ggplot2, use ggsave.
      savingCommand = "\n\nggsave(filename = '" + outputFilePath + "', device = 'png', width = 6, height = 4, dpi = 150)\n";
    }
    // Append the saving command to the user submitted R code.
    scriptContent = `${code}${savingCommand}`;
    fs.writeFileSync(scriptFile, scriptContent);

    exec(`Rscript ${scriptFile}`, { timeout: 10000 }, (error, stdout, stderr) => {
      if (error) {
        console.error('R execution error:', error);
        return res.status(500).json({ error: 'Error executing R code.' });
      }
      return res.json({ visUrl: `http://localhost:3000/static/${outputFilename}` });
    });

  } else {
    return res.status(400).json({ error: 'Unsupported language.' });
  }
});

// Start the server.
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});