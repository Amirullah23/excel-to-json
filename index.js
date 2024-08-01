const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

function convertExcelFolderToJsonSingleFile(folderPath, outputFilePath) {
    let allData = [];

    // Read all files in the folder
    const files = fs.readdirSync(folderPath);

    // Filter for Excel files (.xls and .xlsx)
    const excelFiles = files.filter(file => /\.xlsx?$/.test(path.extname(file)));

    // Loop through each Excel file
    excelFiles.forEach(file => {
        const filePath = path.join(folderPath, file);
        const workbook = XLSX.readFile(filePath);

        // Convert each sheet in the Excel file to JSON
        workbook.SheetNames.forEach(sheetName => {
            const sheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(sheet, { header:1 }); // Get raw data in rows

            // Map each row converting to JSON object, preserving percentage format
            const headers = jsonData[0];
            const dataRows = jsonData.slice(1).map(row => {
                const rowObject = {};
                row.forEach((cell, index) => {
                    if (headers[index].includes("%")) {
                        // Ensure percentage values are correctly formatted as strings
                        rowObject[headers[index]] = `${(cell * 100).toFixed(2)}%`;
                    } else {
                        rowObject[headers[index]] = cell;
                    }
                });
                return rowObject;
            });

            allData.push(dataRows);
        });
    });

    // Save all data to a single JSON file
    fs.writeFileSync(outputFilePath, JSON.stringify(allData, null, 2));
    console.log(`All data has been written to ${outputFilePath}`);
}

// Example usage:
convertExcelFolderToJsonSingleFile('excel', 'allData.json');
