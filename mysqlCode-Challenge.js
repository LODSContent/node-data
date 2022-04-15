
function getPool(host, port, user, password, database) {
} 

function retrieveCustomerByNumber(pool, customerNumber, response) {
}

function retrieveCustomerByState(pool,state,response) {
}

function insertProductLine(pool, productLine, description,response) {
}

function updateProductLine(pool, productLine, html,response) {
}

function deleteProductLine(pool,productLine,response) {
}



module.exports.getPool = getPool;
module.exports.retrieveCustomerByNumber = retrieveCustomerByNumber;
module.exports.retrieveCustomerByState = retrieveCustomerByState;
module.exports.insertProductLine = insertProductLine;
module.exports.updateProductLine = updateProductLine;
module.exports.deleteProductLine = deleteProductLine;
