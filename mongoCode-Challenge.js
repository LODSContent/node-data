
async function getClient (user, password, host, port) {

}

function getCollection (client, database, collection) {

}

async function loadData (collection, path) {

}

async function getCustomerOrders (collection, customerNumber) {

}

async function getProductOrders (collection, productCode) {

}

async function getCustomerOrderTotals (collection, customerNumber) {

}

async function insertCustomer (collection, customer) {

}

async function addCustomerOrder (collection, customerNumber, order) {

}
async function removeCustomerOrders (collection, customerNumber) {

}

module.exports.getClient = getClient
module.exports.getCollection = getCollection
module.exports.loadData = loadData
module.exports.getCustomerOrders = getCustomerOrders
module.exports.getProductOrders = getProductOrders
module.exports.getCustomerOrderTotals = getCustomerOrderTotals
module.exports.insertCustomer = insertCustomer
module.exports.addCustomerOrder = addCustomerOrder
module.exports.removeCustomerOrders = removeCustomerOrders
