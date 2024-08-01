const fs = require('fs');
const XLSX = require('xlsx');

function generateExcelFromJSON(data, outputFilePath, name) {
    // Create a new workbook
    let workbook = XLSX.utils.book_new();

    // Helper function to create a sheet from a list of nodes
    function addSheetForNodes(nodes, sheetName) {
        // Convert JSON data to a worksheet
        let worksheet = XLSX.utils.json_to_sheet(nodes);
        // Add this worksheet to the workbook under a specific name
        XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
    }

    // Group data by the node name prefix (e.g., "R-CORE", "R-AGG")
    let nodeGroups = {};
    data.forEach(nodesArray => {
        nodesArray.forEach(node => {
            if (node["Node Name"].includes(name)) { // Only process nodes with "CORE" in the name
            // Parse CPU data
            node['cpu'] = parseFloat(node["CPU (%)"].replace('%', ''));

            // Parse RAM percentage
            let ramPercentage = node["Device RAM"].split(' ');
            ramPercentage = ramPercentage[ramPercentage.length - 1];
            const regex = /(\d+)%/;
            const match = ramPercentage.match(regex);
            if (match && match[1]) {
                node['ram'] = parseInt(match[1], 10);
            } else {
                node['ram'] = null; // Set to null if no match found
            }
            // Extract the prefix from the node name
            let prefix = node["Node Name"].match(/[A-Z]+/)[0];
            if (!nodeGroups[prefix]) {
                nodeGroups[prefix] = [];
            }
            nodeGroups[prefix].push(node);
        }
        });
    });

    // Create a worksheet for each group
    for (let groupName in nodeGroups) {
        addSheetForNodes(nodeGroups[groupName], groupName);
    }

    // Write the workbook to a file
    XLSX.writeFile(workbook, outputFilePath);
    console.log(`Excel file has been written to ${outputFilePath}`);
}



// Function to read JSON from file and calculate averages
function processFile(filePath) {
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return;
        }
        const jsonData = JSON.parse(data);
        // Generate Excel file
        generateExcelFromJSON(jsonData, 'output.xlsx', 'R-CORE1');

    });
}

processFile('allData.json');