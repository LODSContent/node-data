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
            let product = JSON.parse(productJSON);
            products.push(product);
        }
    }
    response(products);
}


async function generateOrdersReport(path, response) {
    let allFiles = await fs.readdir(path);
    let csvFiles = allFiles.filter(file => file.indexOf('.csv') > -1);
    let orders = []
    for (let fileNo in csvFiles) {
        let fileName = csvFiles[fileNo];
        let filePath = `${path}/${fileName}`;
        let data = await fs.readFile(filePath, 'utf8');
        let lines = data.split('\n');
        let fileData = [];
        for (let lineNo in lines) {
            let line = lines[lineNo];
            let order = line.split(',');
            fileData.push(order);
       }
       let filtered = fileData.filter(order => order[2] === 'Shipped');
       filtered.sort((a, b) => b[4] - a[4]);
       let sliced = filtered.slice(0, 5);
       orders = orders.concat(sliced);
  }
  response(orders);

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


