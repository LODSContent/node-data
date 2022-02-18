const rdbCode = require("./mysqlCode");
const fs = require("fs");
const { Console } = require("console");
var testData = {};
//Test Code


fs.readFile('./settings.json', 'utf8', function (err, data) {
    const settings = JSON.parse(data);
    testData.test2 = settings.relational.test2;
    testData.test3 = settings.relational.test3;
    testData.test4 = settings.relational.test4;
    const host = settings.sqlHost;
    const user = settings.user;
    const password = settings.password;
    const database = settings.database;
    const customerNumber = testData.test2.customerNumber;
    const state = testData.test2.state;
    let cywNumber = 0;
    let pool = null;

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
            testConnection();
            break;
        case 2:
            pool = rdbCode.getPool(host, user, password, database);
            try {
            pool.on('release', processTest2);
            processTest2();
            } catch {
                pool.end();
            }
            break;
        case 3:
            let filePath = settings.dataPath;
            rdbCode.generateOrdersReport(filePath, reportCallback);
            break;
        default:
            console.log('To run a test, enter:\nnode fileData.js n\nn=1: Process a JSON record\nn=2: Process a file with multiple records\nn=3: Process CSV data');
            break;
    }

    function testConnection() {
        const successMessage = "Congratulations! You have connected to the database!";
        const failMessage = "You still need to connect to the relational database. You will need to successfully connect before continuing wiuth this Challenge Lab.";
        const errorMessage = "There was an error connecting to the relational database. You will need to successfully connect before continuing wiuth this Challenge Lab.";
        try {
            pool = rdbCode.getPool(host, user, password, database);
            pool.getConnection((err, connection) => {
                if (err) {
                    console.log(failMessage);
                } else {
                    console.log(successMessage);
                }
                pool.end();
            })
        } catch { console.log(errorMessage); }
    }


    function processTest2() {
        cywNumber++;
        switch (cywNumber) {
            case 1:
                rdbCode.retrieveCustomerByNumber(pool, customerNumber, customerByNumberCallback);
                break;
            case 2:
                rdbCode.retrieveCustomerByState(pool, state, customerByStateCallback);
                break;
            default:
                pool.end();
                break;
        }

    }
    function customerByNumberCallback(data) {
        const successMessage = "Congratulations! You have retrieved a customer by the customer number.";
        const failMessage = "You still need to retrieve a customer by the customer number.";
        const errorMessage = failMessage;
        try {
            if (data && (data.customerName == testData.test2.customerName) && (data.phone == testData.test2.phone)) {
                console.log(successMessage);
                console.log(`Here is the full customer record:\n${JSON.stringify(data)}\n\n`);
            } else {
                console.log(failMessage);
            }

        } catch {
            console.log(errorMessage);
        }
    }

    function customerByStateCallback(data) {
        const successMessage = "Congratulations! You have retrieved the correct customers by state.";
        const failMessage = `You still need to retrieve customers by state. You should retrieve ${testData.test2.stateLength} customers with the correct fields.`;
        const errorMessage = failMessage;
        if (data && data.length == testData.test2.stateLength && Object.keys(data[0]).length == 4) {
            console.log(successMessage);
            console.log(`Here is a sample result:\n${JSON.stringify(data[0])}\n\n`);
        } else {
            console.log(`${failMessage}`);
        }
    }

});



