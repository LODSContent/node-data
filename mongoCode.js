const fs = require('fs').promises
const { MongoClient } = require('mongodb')

async function getClient (user, password, host, port) {
  const connectionString = `mongodb://${user}:${password}@${host}:${port}`
  let client = new MongoClient(connectionString)
  try {
    await client.connect()
  } catch {
    client = null
  }
  return client
}

function getCollection (client, database, collection) {
  const db = client.db(database)
  const coll = db.collection(collection)
  return coll
}

async function loadData (collection, path) {
  const allFiles = await fs.readdir(path)
  const orderFiles = allFiles.filter(file => file.indexOf('.json') > -1)
  const orders = []
  for (const lcv in orderFiles) {
    const fileName = orderFiles[lcv]
    const filePath = `${path}/${fileName}`
    const fileData = await fs.readFile(filePath)
    const order = JSON.parse(fileData)
    order._id = order.customerNumber
    orders.push(order)
  }
  const result = await collection.insertMany(orders)
  return result
}

async function getCustomerOrders (collection, customerNumber) {
  return await collection.findOne({ _id: customerNumber })
}

async function getProductOrders (collection, productCode) {
  const csr = await collection.find({ 'orders.details.productCode': productCode })
  const result = await csr.toArray()
  return result
}

async function getCustomerOrderTotals (collection, customerNumber) {
  const totals = await collection.aggregate([
    { $match: { _id: customerNumber } },
    { $unwind: { path: '$orders' } },
    { $unwind: { path: '$orders.details' } },
    { $group: { _id: '$orders.orderNumber', total: { $sum: '$orders.details.lineTotal' } } }
  ])
  const result = await totals.toArray()
  return result
}

async function insertCustomer (collection, customer) {
  customer._id = customer.customerNumber
  try {
    const result = await collection.insertOne(customer)
    return result
  } catch (ex) {
    return ex
  }
}

async function addCustomerOrder (collection, customerNumber, order) {
  const customer = await collection.findOne({ _id: customerNumber })
  customer.orders.push(order)
  await collection.replaceOne({ _id: customerNumber }, customer)
}
async function removeCustomerOrders (collection, customerNumber) {
  await collection.deleteOne({ _id: customerNumber })
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
