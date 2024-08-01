const fs = require('fs');

function calculateAverages(data, name) {
    let totalCPU = 0;
    let totalRAMPercentage = 0;
    let count = 0;

    data.forEach(nodes => {
        nodes.forEach(node => {
            if (node["Node Name"].includes(name)) { // Only process nodes with "CORE" in the name
                totalCPU += parseFloat(node["CPU (%)"].replace('%', ''));
                console.log('node["CPU (%)"]:', parseFloat(node["CPU (%)"].replace('%', '')));

                // Extracting RAM percentage using regex
                let ramPercentage = node["Device RAM"].split(' ');
                ramPercentage = ramPercentage[ramPercentage.length - 1];
                const regex = /(\d+)%/;
                const match = ramPercentage.match(regex);
                if (match && match[1]) {
                    ramPercentage = parseInt(match[1]);
                }

                console.log('ramPercentage:', ramPercentage);   
                totalRAMPercentage += ramPercentage;
                count++;
            }
        });
    });

    const averageCPU = totalCPU / count;
    const averageRAMPercentage = totalRAMPercentage / count;

    return {
        averageCPU: averageCPU,
        averageRAMPercentage: averageRAMPercentage
    };
}

// Function to read JSON from file and calculate averages
function processFile(filePath) {
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return;
        }
        const jsonData = JSON.parse(data);
        const averages = calculateAverages(jsonData, 'AGG');
        console.log(`Average CPU (%): ${averages.averageCPU}`);
        console.log(`Average RAM Percentage (%): ${averages.averageRAMPercentage}`);
    });
}

// Example usage
processFile('allData.json');
