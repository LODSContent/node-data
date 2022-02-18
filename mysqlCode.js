const mysql = require('mysql');

function getPool(host, user, password, database) {
    const connection = mysql.createPool({
        connectionLimit:100,
        host: host,
        user: user,
        password: password,
        database: database
    });
    return connection;
} 

function retrieveCustomerByNumber(pool, customerNumber, response) {
    pool.getConnection((err,connection) => {
        connection.query(`SELECT * FROM customers WHERE customerNumber = ?`,[customerNumber],(error, data,fields)=>{
            let result = {
                customerName:data[0].customerName,
                phone:data[0].phone
            }
            connection.release();
            response(result);
        });
    });
}

function retrieveCustomerByState(pool,state,response) {
    pool.getConnection((err,connection) => {
        const SQL = "SELECT customerNumber,customerName,state,postalCode FROM customers WHERE state=?";
        connection.query(SQL,[state],(err,data)=>{
            connection.release();
            response(data);
        });
    })
}


module.exports.getPool = getPool;
module.exports.retrieveCustomerByNumber = retrieveCustomerByNumber;
module.exports.retrieveCustomerByState = retrieveCustomerByState;
