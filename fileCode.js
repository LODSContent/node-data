const fs = require('fs').promises;

async function readCustomer(fileName, response) {
    let data = await fs.readFile(fileName, 'utf8');
    let customer = JSON.parse(data);
    response(customer);
}


async function readProducts(fileName, response) {
    let data = await fs.readFile(fileName, 'utf8');
    let lines = data.split('\n');
    let products = [];
    for (let lineNo in lines) {
        let line = lines[lineNo];
        if (line.trim().length > 0) {
            let productJSON = line.slice(2);
            product = JSON.parse(productJSON);
            products.push(product);
        }
    }
    response(products);
}


async function generateOrdersReport(path, response) {
    let allFiles = await fs.readdir(path);
    let csvFiles = allFiles.filter(file => file.indexOf('.csv') > -1);
    let results = []
    for (let fileNo in csvFiles) {
        let contents = await fs.readFile(`${path}\\${csvFiles[fileNo]}`, 'utf8');
        let lines = contents.split('\n');
        fileData = [];
        for (lineNo in lines) {
            data = lines[lineNo].split(',');
            fileData.push(data);
        }
        processed = processMonthlyOrders(fileData);
        results = results.concat(processed);
    }
    response(results);

}

function processMonthlyOrders(orders) {
    let filtered = orders.filter(order => order[2] === 'Shipped');
    filtered.sort((a, b) => {
        return a[4] > b[4] ? -1 : 1;
    });
    return filtered.slice(0, 5);
}

module.exports.readCustomer = readCustomer;
module.exports.readProducts = readProducts;
module.exports.generateOrdersReport = generateOrdersReport;


