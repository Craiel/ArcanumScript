const fs = require('fs').promises;
const path = require('path');
// Use modern import for fetch
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const ROOTURL = 'https://mathiashjelm.gitlab.io/arcanum/data/';

// Helper function to download a file and optionally parse as JSON
async function downloadFile(url, outputPath, parseJson = false) {
    console.log(`Downloading ${url}`);
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to download ${url}: ${response.statusText}`);
        }
        const content = await response.text();

        // Ensure the directory exists
        await fs.mkdir(path.dirname(outputPath), { recursive: true });

        // Save the file
        await fs.writeFile(outputPath, content);

        // If parseJson is true, also return the parsed JSON
        if (parseJson) {
            return JSON.parse(content);
        }
    } catch (error) {
        console.error(`Error downloading ${url}:`, error);
        throw error;
    }
}

// Function to get all required files from modules.json
async function getAllRequiredFiles(modulesJson) {
    const files = new Set();

    // Add core files (these are usually listed in the core array)
    if (modulesJson.core) {
        modulesJson.core.forEach(file => {
            files.add(`${file}.json`);
        });
    }

    // Process modules
    const moduleFiles = [];
    if (modulesJson.modules) {
        modulesJson.modules.forEach(moduleId => {
            // Add module's JSON file with proper path structure
            moduleFiles.push({
                url: `${ROOTURL}modules/${moduleId}.json`,
                outputPath: `modules/${moduleId}.json`
            });

            // If this module has requires, add them to main files
            const moduleConfig = modulesJson[moduleId];
            if (moduleConfig && moduleConfig.requires) {
                moduleConfig.requires.forEach(file => {
                    files.add(`${file}.json`);
                });
            }
        });
    }

    return {
        mainFiles: Array.from(files),
        moduleFiles
    };
}

// Main download function
async function downloadAllFiles() {
    try {
        // First download and parse modules.json
        console.log('Downloading and parsing modules.json...');
        const modulesData = await downloadFile(
            `${ROOTURL}modules.json`,
            'modules.json',
            true
        );

        // Get all required files
        const { mainFiles, moduleFiles } = await getAllRequiredFiles(modulesData);

        console.log('Files to download:', {
            main: mainFiles,
            modules: moduleFiles.map(f => f.outputPath)
        });

        // Download main files
        const mainPromises = mainFiles.map(file =>
            downloadFile(`${ROOTURL}${file}`, file)
        );

        // Download module files
        const modulePromises = moduleFiles.map(file =>
            downloadFile(file.url, file.outputPath)
        );

        // Wait for all downloads to complete
        await Promise.all([...mainPromises, ...modulePromises]);
        console.log('All files downloaded successfully');

    } catch (error) {
        console.error('Download process failed:', error);
    }
}

// Create necessary directories and start the download
async function init() {
    try {
        // Create required directories (including nested paths for seasonal modules)
        await fs.mkdir('modules', { recursive: true });
        await fs.mkdir('modules/seasonal', { recursive: true });

        // Start the download process
        await downloadAllFiles();
    } catch (error) {
        console.error('Initialization failed:', error);
    }
}

// Run the script
init().catch(error => {
    console.error('Critical error:', error);
});