const fileData = require("./fileCode");
const fs = require("fs");
const fsp = require('fs').promises;
var testData = {};
//Test Code
function customerCallback(customer) {

    //Test 1: Check for an object
    let test1 = customer!=null ? 1 : 0;
    let display1 = test1===1?"Congratulations! You have returned a customer.":"Your code still needs to return a customer.";
    
    //Test 2: Check for valid data in the object
    let test2 = 0;
    let display2 = "";
    if(test1) {
        test2 = customer.customerNumber === testData.test1.customerNumber?1:0;
        display2 = test2===1 ? "Congratulations! You have returned a customer with the correct customerNumber" : "Your code still needs to return a customer with the correct information.";
    }

    //Output results
    console.log(display1);
    console.log(display2);

    //Output either the score (if scored), or example data.
    if(testData.score===1) {
        result = test1 + test2;
        console.log(`Score: ${result/2}`);
    } else {
        console.log(`Here is the customer data\n${JSON.stringify(customer)}`);
    }
}

function productsCallback(products) {

    //Test 1: Correct number of elements
    let test1 = (products != null) && (products.length === testData.test2.count) ? 1: 0;
    let display1 = test1 ===1 ? `Congratulations! You returned the correct number of products (${testData.test2.count}).` : "You still need to return the correct number of products.";

    //Test 2: Correct data
    let test2 = (test1===1) && (products[testData.test2.element].productCode===testData.test2.productCode) ? 1: 0;
    let display2 = test2 === 1 ? "Congratulations! You have returned the correct product data.":"Your code still needs to return the correct product data.";

    //Output test results
    console.log(display1);
    console.log(display2);

    if(testData.score) {
        let result = test1 + test2;
        console.log(`Score: ${result/2}`);
    } else {
        console.log(`Here is a sample product:\n${JSON.stringify(products[testData.test2.element])}`);
    }
}

function reportCallback(report) {
    let test1 = report != null && report.length === testData.test3.count ? 1 : 0;
    let display1 = test1 === 1 ? `Congratulations! You have returned the correct number of purchase records (${testData.test3.count})` : "You still need to return the correct number of purchase records.";
    let test2 = (test1 === 1) && (report[testData.test3.element].length>4) && (report[testData.test3.element][4]==testData.test3.totalCost) ? 1 : 0;
    let display2 = test2 === 1 ? "Congratulations, you have returned the correct data." : "You still need to return the correct data";

    console.log(display1);
    console.log(display2);

    if(testData.score) {
        let result = test1 + test2;
        console.log(`Score: ${result/2}`);
    } else {
        console.log(`Here is a sample purchase record:\n${JSON.stringify(report[testData.test3.element])}`);
    }
}

fs.readFile('./settings.json', 'utf8', function (err, data) {
    const settings = JSON.parse(data);
    testData.test1 = settings.test1;
    testData.test2 = settings.test2;
    testData.test3 = settings.test3;

    let testNo = 0;
    let score = 0;
    if ((process.argv.length > 2) && (process.argv[2].match(/[123]/g) !== null)) {
        testNo = parseInt(process.argv[2]);
    }
    if ((process.argv.length > 3) && (process.argv[3].match(/[01]/g) !== null)) {
        score = parseInt(process.argv[3]);
    }

    testData.score = score;

    let fileName = '';
    switch (testNo) {
        case 1:
            fileName = `${settings.dataPath}/customer.json`;
            fileData.readCustomer(fileName, customerCallback);
            break;
        case 2:
            fileName = `${settings.dataPath}/products.json`;
            fileData.readProducts(fileName,productsCallback);
            break;
        case 3:
            let filePath = settings.dataPath;
            fileData.generateOrdersReport(filePath,reportCallback);
            break;
        default:
            console.log('To run a test, enter:\nnode fileData.js n\nn=1: Process a JSON record\nn=2: Process a file with multiple records\nn=3: Process CSV data');
            break;
    }

});



