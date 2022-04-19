const mysql = require('mysql')

function getPool (host, port, user, password, database) {
  const pool = mysql.createPool({
    connectionLimit: 100,
    host: host,
    port: port,
    user: user,
    password: password,
    database: database
  })
  return pool
}

function retrieveCustomerByNumber (pool, customerNumber, response) {
  pool.getConnection((_err, connection) => {
    connection.query('SELECT customerName,phone FROM customers WHERE customerNumber = ?', [customerNumber], (_error, data, _fields) => {
      connection.release()
      response(data[0])
    })
  })
}

function retrieveCustomerByState (pool, state, response) {
  pool.getConnection((_err, connection) => {
    const SQL = 'SELECT customerNumber,customerName,state,postalCode FROM customers WHERE state=?'
    connection.query(SQL, [state], (_err, data) => {
      connection.release()
      response(data)
    })
  })
}

function insertProductLine (pool, productLine, description, response) {
  pool.getConnection((_err, connection) => {
    const SQL = 'INSERT INTO productlines(productLine,textDescription) VALUES(?,?)'
    connection.query(SQL, [productLine, description], (_err, data) => {
      connection.release()
      response(0)
    })
  })
}

function updateProductLine (pool, productLine, html, response) {
  pool.getConnection((_err, connection) => {
    const SQL = 'UPDATE productlines SET htmlDescription = ? WHERE productLine = ?'
    connection.query(SQL, [html, productLine], (_err, data) => {
      connection.release()
      response(data.affectedRows)
    })
  })
}

function deleteProductLine (pool, productLine, response) {
  pool.getConnection((_err, connection) => {
    const SQL = 'DELETE FROM productlines WHERE productLine = ?'
    connection.query(SQL, [productLine], (_err, data) => {
      connection.release()
      response(data.affectedRows)
    })
  })
}

module.exports.getPool = getPool
module.exports.retrieveCustomerByNumber = retrieveCustomerByNumber
module.exports.retrieveCustomerByState = retrieveCustomerByState
module.exports.insertProductLine = insertProductLine
module.exports.updateProductLine = updateProductLine
module.exports.deleteProductLine = deleteProductLine
