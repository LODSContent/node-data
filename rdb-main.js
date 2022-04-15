const mysql = require('mysql');
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
    let pool = null;
    let done = false;

    let testNo = 0;
    let score = 0;
    if ((process.argv.length > 2) && (process.argv[2].match(/[1234]/g) !== null)) {
        testNo = parseInt(process.argv[2]);
    }
    if ((process.argv.length > 4) && (process.argv[3].match(/[01]/g) !== null)) {
        score = parseInt(process.argv[3]);
    }

    testData.score = score;

    let fileName = '';
    switch (testNo) {
        case 1:
            testConnection();
            break;
        case 2:
            testReadData();
            break;
        case 3:
            testWriteData();
            break;
        case 4:
            testExceptionHandling();
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

    function testReadData() {
        pool = rdbCode.getPool(host, user, password, database);
        const status = {
            byNumberRun: false,
            byStateRun: false,
            byNumberSuccess: false,
            byStateSuccess: false,
            byNumberOutput: "",
            byStateOutput: "",
            intervalID: 0,
            intervalCount: 0
        }
        status.intervalID = setInterval(timeOutExit, 500);
        rdbCode.retrieveCustomerByNumber(pool, customerNumber, customerByNumberCallback);
        rdbCode.retrieveCustomerByState(pool, state, customerByStateCallback);


        function customerByNumberCallback(data) {
            const successMessage = "Congratulations! You have retrieved a customer by the customer number.";
            const failMessage = "You still need to retrieve a customer by the customer number.";
            const errorMessage = failMessage;
            try {
                if (data && (data.customerName == testData.test2.customerName) && (data.phone == testData.test2.phone)) {
                    status.byNumberOutput = `${successMessage}\nHere is the full customer record:\n${JSON.stringify(data)}\n\n`;
                    status.byNumberSuccess = true;
                } else {
                    status.byNumberOutput = failMessage;
                }

            } catch {
                status.byNumberOutput = errorMessage;
            }
            status.byNumberRun = true;
        }
        function customerByStateCallback(data) {
            const successMessage = "Congratulations! You have retrieved the correct customers by state.";
            const failMessage = `You still need to retrieve customers by state. You should retrieve ${testData.test2.stateLength} customers with the correct fields.`;
            const errorMessage = failMessage;
            try {
                if (data && data.length == testData.test2.stateLength && Object.keys(data[0]).length == 4) {
                    status.byStateOutput = `${successMessage}\nHere is a sample result:\n${JSON.stringify(data[0])}\n\n`;
                } else {
                    status.byStateOutput = failMessage;
                }
            } catch {
                status.byStateOutput = errorMessage;

            }
            status.byStateRun = true;
        }
        function timeOutExit() {
            try {
                status.intervalCount++;
                if (status.intervalCount > 10 || (status.byNumberRun && status.byStateRun)) {
                    console.log(status.byNumberOutput);
                    console.log(status.byStateOutput);
                    clearInterval(status.intervalID);
                    pool.end();
                }
            } catch { }

        }
    }



    function testWriteData() {
        testProductLine = {
            "productlineName": "Graphene Cars",
            "productlineDescription": "Graphene Cars are literally made of the strongest material we can get our hands on.",
            "productlineHtmlDescription": "<div class'productline'>Graphene Cars are literally <b>made of the strongest material we can get our hands on</b>.</div>"
        }
        const status = {
            insertRun: false,
            insertSuccess: false,
            insertResult: "",
            updateRun: false,
            updateSuccess: false,
            updateResult: "",
            deleteRun: false,
            deleteSuccess: false,
            deleteResult: "",
            intervalID: 0,
            intervalCount: 0,
            testNo: 0
        }
        pool = rdbCode.getPool(host, user, password, database);
        const testPool = mysql.createPool({
            connectionLimit: 100,
            host: host,
            user: user,
            password: password,
            database: database
        });
        status.intervalID = setInterval(timeOutExit, 500);
        clearProductLine();

        function clearProductLine() {

            pool.getConnection((err, connection) => {
                connection.query('DELETE FROM productlines WHERE productLine = ?', [testProductLine.productlineName], (error, data, fields) => {
                    connection.release();
                    rdbCode.insertProductLine(pool, testProductLine.productlineName, testProductLine.productlineDescription, testInsert);
                });
            });
        }

        function testInsert() {
            testPool.getConnection((err, connection) => {
                connection.query('SELECT * from productlines WHERE productLine = ?', [testProductLine.productlineName], (error, data, fields) => {
                    if (err) {
                        console.log(err);
                    }
                    const successMessage = "Congratulations! You have inserted a product line record.";
                    const failMessage = "You still need to insert a product line record.";
                    const errorMessage = failMessage;
                    try {
                        if (data && data[0] && (data[0].textDescription == testProductLine.productlineDescription)) {
                            status.insertResult = successMessage;
                            status.insertSuccess = true;
                        } else {
                            status.insertResult = failMessage;
                        }

                    } catch {
                        status.insertResult = errorMessage;
                    }
                    status.insertRun = true;
                    connection.release();
                    rdbCode.updateProductLine(pool, testProductLine.productlineName, testProductLine.productlineHtmlDescription, testUpdate);
                });
            });

        }
        function testUpdate() {
            testPool.getConnection((err, connection) => {
                connection.query(`SELECT * from productlines WHERE productLine = ?`, [testProductLine.productlineName], (error, data, fields) => {
                    const successMessage = "Congratulations! You have updated a product line record.";
                    const failMessage = "You still need to update a product line record.";
                    const errorMessage = failMessage;
                    try {
                        if (data && data[0] && (data[0].htmlDescription == testProductLine.productlineHtmlDescription)) {
                            status.updateResult = successMessage;
                            status.updateSuccess = true;
                        } else {
                            status.updateResult = failMessage;
                        }

                    } catch {
                        status.updateResult = errorMessage;
                    }
                    status.updateRun = true;
                    connection.release();
                    rdbCode.deleteProductLine(pool, testProductLine.productlineName, testDelete);
                });
            });

        }
        function testDelete() {
            testPool.getConnection((err, connection) => {
                connection.query(`SELECT * from productlines WHERE productLine = ?`, [testProductLine.productlineName], (error, data, fields) => {
                    const successMessage = "Congratulations! You have deleted a product line record.";
                    const failMessage = "You still need to delete a product line record.";
                    const errorMessage = failMessage;
                    try {
                        if (data[0]) {
                            status.deleteResult = failMessage;
                        } else {
                            status.deleteResult = successMessage;
                            status.deleteSuccess = true;
                        }

                    } catch {
                        status.deleteResult = errorMessage;
                    }
                    status.deleteRun = true;
                    connection.release();
                });
            });

        }

        function timeOutExit() {
            try {
                status.intervalCount++;
                if (status.intervalCount > 10 || (status.insertRun && status.updateRun && status.deleteRun)) {
                    console.log(status.insertResult);
                    console.log(status.updateResult);
                    console.log(status.deleteResult)
                    clearInterval(status.intervalID);
                    pool.end();
                    testPool.end();
                }
            } catch { }

        }

    }

    function testExceptionHandling() {
        testProductLine = {
            "productlineName": "Graphene Cars",
            "productlineDescription": "Graphene Cars are literally made of the strongest material we can get our hands on.",
            "productlineHtmlDescription": "<div class'productline'>Graphene Cars are literally <b>made of the strongest material we can get our hands on</b>.</div>"
        }
        const status = {
            successRun: false,
            successSuccess: false,
            successResult: "",
            errorRun: false,
            errorSuccess: false,
            errorResult: "",
            intervalID: 0,
            intervalCount: 0,
            testNo: 0
        }
        pool = rdbCode.getPool(host, user, password, database);
        const testPool = mysql.createPool({
            connectionLimit: 100,
            host: host,
            user: user,
            password: password,
            database: database
        });
        status.intervalID = setInterval(timeOutExit, 500);
        successTest();

        function successTest() {
            pool.getConnection((err, connection) => {
                connection.query('DELETE FROM productlines WHERE productLine = ?', [testProductLine.productlineName], (error, data, fields) => {
                    connection.release();
                    rdbCode.insertProductLine(pool, testProductLine.productlineName, testProductLine.productlineDescription, successCallback);
                });
            });

        }
        function successCallback(code) {
            if (code === 0) {
                status.successSuccess = true;
                status.successResult = "Congratulations! You returned the correct result code for normal operations.";
            } else {
                status.successResult = "You still need to return the correct result code for normal operations.";
            }
            status.successRun = true;
            rdbCode.insertProductLine(pool, testProductLine.productlineName, testProductLine.productlineDescription, errorCallback);
        }
        function errorCallback(code) {
            if (code === 1) {
                status.errorSuccess = true;
                status.errorResult = "Congratulations! You returned the correct result code for a data exception.";
            } else {
                status.errorResult = "You still need to return the correct result code for a data exception.";
            }
            status.errorRun = true;
        }


        function timeOutExit() {
            try {
                status.intervalCount++;
                if (status.intervalCount > 10 || (status.successRun && status.errorRun)) {
                    console.log(status.successResult);
                    console.log(status.errorResult);
                    clearInterval(status.intervalID);
                    pool.end();
                    testPool.end();
                }
            } catch { }

        }
    }

});




