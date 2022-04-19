const mysql = require('mysql');

function getPool(host, port, user, password, database) {
    const pool = mysql.createPool({
        connectionLimit:100,
        host: host,
        port: port,
        user: user,
        password: password,
        database: database
    });
    return pool;
} 

function retrieveCustomerByNumber(pool, customerNumber, response) {
    pool.getConnection((err,connection) => {
        connection.query(`SELECT customerName,phone FROM customers WHERE customerNumber = ?`,[customerNumber],(error, data,fields)=>{
            connection.release();
            response(data[0]);
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

function insertProductLine(pool, productLine, description,response) {
    pool.getConnection((err,connection) => {
        const SQL = "INSERT INTO productlines(productLine,textDescription) VALUES(?,?)";
        connection.query(SQL,[productLine,description],(err,data)=>{
            connection.release();
            response(0);
        });
    })    
}

function updateProductLine(pool, productLine, html,response) {
    pool.getConnection((err,connection) => {
        const SQL = "UPDATE productlines SET htmlDescription = ? WHERE productLine = ?";
        connection.query(SQL,[html,productLine],(err,data)=>{
            connection.release();
            response(data.affectedRows);
        });
    });    
}

function deleteProductLine(pool,productLine,response) {
    pool.getConnection((err,connection) => {
        const SQL = "DELETE FROM productlines WHERE productLine = ?";
        connection.query(SQL,[productLine],(err,data)=>{
            connection.release();
            response();
        });
    });    
}



module.exports.getPool = getPool;
module.exports.retrieveCustomerByNumber = retrieveCustomerByNumber;
module.exports.retrieveCustomerByState = retrieveCustomerByState;
module.exports.insertProductLine = insertProductLine;
module.exports.updateProductLine = updateProductLine;
module.exports.deleteProductLine = deleteProductLine;
