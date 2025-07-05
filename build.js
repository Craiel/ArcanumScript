const fs = require('fs');
const path = require('path');

// Configuration
const config = {
    targetFile: 'ArcanumEnhancements.user',
    sourceDir: 'src',
    versions: {
        stable: {
            validVersions: [
                'Version: stable 0.11.1.3'
            ],
            sourceSubDir: 'stable'
        },
        unstable: {
            validVersions: [
                'vers pseudo_stable 0.8.1',
                'vers 0.8.0',
                'Version: pseudo_stable 0.10.4',
                'unstable 0.12.2.38'
            ],
            sourceSubDir: 'unstable'
        }
    }
};

function getAllSourceFiles(baseDir, versionDir) {
    const files = new Map();

    // Read files from base directory
    if (fs.existsSync(baseDir)) {
        fs.readdirSync(baseDir).forEach(file => {
            if (file.endsWith('.js')) {
                files.set(file, path.join(baseDir, file));
            }
        });
    }

    // Read version-specific files (these will override base files if they exist)
    const versionPath = path.join(baseDir, versionDir);
    if (fs.existsSync(versionPath)) {
        fs.readdirSync(versionPath).forEach(file => {
            if (file.endsWith('.js')) {
                files.set(file, path.join(versionPath, file));
            }
        });
    }

    // Convert to array and sort by filename
    return Array.from(files.entries())
        .sort(([fileNameA], [fileNameB]) => fileNameA.localeCompare(fileNameB))
        .map(([_, filePath]) => filePath);
}

function buildUserScript(version) {
    console.log(`Building ${config.targetFile} for ${version} version`);

    // Delete existing file if it exists
    let targetPath = path.join(process.cwd(), `${config.targetFile}.js`);
    if(version !== 'stable') {
        targetPath = path.join(process.cwd(), `${config.targetFile}.${version}.js`);
    }

    if (fs.existsSync(targetPath)) {
        fs.unlinkSync(targetPath);
    }

    // Get all source files for this version
    const sourceDir = path.join(process.cwd(), config.sourceDir);
    const versionConfig = config.versions[version];
    const files = getAllSourceFiles(sourceDir, versionConfig.sourceSubDir);

    // Process each file
    files.forEach(filePath => {
        const fileName = path.basename(filePath);
        console.log(`Processing: ${fileName} (${filePath})`);

        try {
            // Read file content
            const content = fs.readFileSync(filePath, 'utf8');

            // Append to target file with newlines
            fs.appendFileSync(targetPath, content);
            fs.appendFileSync(targetPath, '\n\n');
        } catch (error) {
            console.error(`Error processing ${fileName}: ${error.message}`);
        }
    });

    console.log(`Build complete: ${targetPath}`);
    console.log(`Processed ${files.length} files\n`);
}

// Build both versions
buildUserScript('stable');
buildUserScript('unstable');