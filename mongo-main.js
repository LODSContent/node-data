const mongoCode = require('./mongoCode')
const fs = require('fs')

fs.readFile('./settings.json', 'utf8', function (_err, data) {
  let testNo = 0
  if ((process.argv.length > 2) && (process.argv[2].match(/[123456789]/g) !== null)) {
    testNo = parseInt(process.argv[2])
  }
  const score = process.argv.includes('score')
  const debug = process.argv.includes('debug')

  const settings = JSON.parse(data)
  const testData = {}
  testData.test2 = settings.relational.test2
  testData.test3 = settings.relational.test3
  testData.test4 = settings.relational.test4
  testData.score = score
  const host = settings.mongoHost
  const port = settings.mongoPort
  const user = settings.user
  const password = settings.password
  const database = settings.database
  const collectionName = settings.collection
  const ordersPath = settings.ordersPath

  const existingCustomerNumber = 103
  const newCustomerNumber = 1000000
  const productCode = 'S24_2766'

  async function getCustomerOrders (collection, customerNumber) {
    return await collection.findOne({ _id: customerNumber })
  }

  async function removeCustomerOrders (collection, customerNumber) {
    await collection.deleteOne({ _id: customerNumber })
  }

  function generateTestData () {
    const customer = {
      customerNumber: newCustomerNumber,
      orders: [
        {
          orderNumber: 1000000,
          orderDate: '2021-05-20',
          requiredDate: '2021-05-29',
          shippedDate: '2021-05-22',
          status: 'Shipped',
          comments: 'Test record',
          customerNumber: newCustomerNumber,
          details: [
            {
              orderLineNumber: 1,
              productName: '1966 Shelby Cobra 427 S/C',
              productCode: 'S24_1628',
              priceEach: 43.27,
              quantityOrdered: 50,
              lineTotal: 2163.5
            }
          ]
        }
      ]
    }
    const order = {
      orderNumber: 1000001,
      orderDate: '2021-05-20',
      requiredDate: '2021-05-29',
      shippedDate: '2021-05-22',
      status: 'Shipped',
      comments: 'Test record',
      customerNumber: newCustomerNumber,
      details: [
        {
          orderLineNumber: 1,
          productName: '1966 Shelby Cobra 427 S/C',
          productCode: 'S24_1628',
          priceEach: 43.27,
          quantityOrdered: 50,
          lineTotal: 2163.5
        },
        {
          orderLineNumber: 2,
          productName: '1965 Aston Martin DB5',
          productCode: 'S18_1589',
          priceEach: 120.71,
          quantityOrdered: 26,
          lineTotal: 3138.46
        }
      ]
    }
    return {
      customer: customer,
      order: order
    }
  }

  runTest()

  async function runTest () {
    let client = null
    const errorMessage = 'There was an error connecting to the MongoDB collection. You will need to successfully connect before continuing wiuth this Challenge Lab.'
    try {
      client = await mongoCode.getClient(user, password, host, port)
      const collection = (client) ? mongoCode.getCollection(client, database, collectionName) : null
      switch (testNo) {
        case 1:
          await testCollection(collection)
          break
        case 2:
          await testLoad(collection)
          break
        case 3:
          await testReadCustomer(collection)
          break
        case 4:
          await testReadProduct(collection)
          break
        case 5:
          await testReadTotals(collection)
          break
        case 6:
          await testInsert(collection)
          break
        case 7:
          await testUpdate(collection)
          break
        case 8:
          await testDelete(collection)
          break
        case 9:
          await testDataError(collection)
          break
        default:
          console.log('To run a test, enter:\nnode fileData.js n\nn=1: Process a JSON record\nn=2: Process a file with multiple records\nn=3: Process CSV data')
          break
      }
    } catch (ex) {
      if (testNo === 1) {
        console.log(score ? 'false' : debug ? ex : errorMessage)
      }
    } finally {
      if (client) {
        client.close()
      }
    }
  }

  async function testCollection (collection) {
    const successMessage = 'Congratulations! You have connected to the collection!'
    const failMessage = 'You still need to connect to the MongoDB collection. You will need to successfully connect before continuing wiuth this Challenge Lab.'
    if (score) {
      console.log(collection !== null)
    } else {
      console.log(collection !== null ? successMessage : failMessage)
    }
  }

  async function testLoad (collection) {
    const successMessage = 'Congratulations! You have loaded data to a MongoDB collection!'
    const failMessage = 'You still need to load data to a MongoDB collection.'
    const errorMessage = 'There was an error loading data to the MongoDB collection.'
    try {
      let customerOrders = await getCustomerOrders(collection, existingCustomerNumber)
      if (customerOrders === null) {
        await mongoCode.loadData(collection, ordersPath)
        customerOrders = await getCustomerOrders(collection, existingCustomerNumber)
      }
      if (score) {
        console.log(customerOrders !== null)
      } else {
        console.log(customerOrders !== null ? successMessage : failMessage)
      }
    } catch (ex) {
      console.log(debug ? ex : errorMessage)
    }
  }

  async function testReadCustomer (collection) {
    const successMessage = 'Congratulations! You have read a customer record!'
    const failMessage = 'You still need to read a customer record'
    const errorMessage = 'There was an error reading a customer record'
    try {
      const custOrders = await mongoCode.getCustomerOrders(collection, existingCustomerNumber)
      if (custOrders && custOrders.orders.length === 3) {
        console.log(score ? 'true' : successMessage)
      } else {
        console.log(score ? 'false' : failMessage)
      }
    } catch (ex) {
      console.log(score ? 'false' : debug ? ex : errorMessage)
    }
  }

  async function testReadProduct (collection) {
    const successMessage = 'Congratulations! You have read product records!'
    const failMessage = 'You still need to read product records.'
    const errorMessage = 'There was an error reading product records.'
    try {
      const prodOrders = await mongoCode.getProductOrders(collection, productCode)
      if (prodOrders && prodOrders.length === 18) {
        console.log(score ? 'true' : successMessage)
      } else {
        console.log(score ? 'false' : failMessage)
      }
    } catch (ex) {
      console.log(score ? 'false' : debug ? ex : errorMessage)
    }
  }

  async function testReadTotals (collection) {
    const successMessage = 'Congratulations! You have read order totals!'
    const failMessage = 'You still need to read order totals.'
    const errorMessage = 'There was an error reading order totals.'
    try {
      const custTotals = await mongoCode.getCustomerOrderTotals(collection, existingCustomerNumber)
      if (custTotals && custTotals.length === 3 && 'total' in custTotals[0]) {
        console.log(score ? 'true' : successMessage)
      } else {
        console.log(score ? 'false' : failMessage)
      }
    } catch (ex) {
      console.log(score ? 'false' : debug ? ex : errorMessage)
    }
  }

  async function testInsert (collection) {
    const successMessage = 'Congratulations! You have inserted a document!'
    const failMessage = 'You still need to insert a document.'
    const errorMessage = 'There was an error inserting a document.'
    try {
      await removeCustomerOrders(collection, newCustomerNumber)
      const testData = generateTestData()
      await mongoCode.insertCustomer(collection, testData.customer)
      const customerOrders = await getCustomerOrders(collection, newCustomerNumber)
      if (score) {
        console.log(customerOrders !== null)
      } else {
        console.log(customerOrders !== null ? successMessage : failMessage)
      }
    } catch (ex) {
      console.log(score ? 'false' : debug ? ex : errorMessage)
    }
  }

  async function testUpdate (collection) {
    const successMessage = 'Congratulations! You have updated a document!'
    const failMessage = 'You still need to update a document.'
    const errorMessage = 'There was an error updating a document.'
    try {
      const testData = generateTestData()
      await removeCustomerOrders(collection, newCustomerNumber)
      await mongoCode.insertCustomer(collection, testData.customer)
      await mongoCode.addCustomerOrder(collection, newCustomerNumber, testData.order)
      const customerOrders = await getCustomerOrders(collection, newCustomerNumber)
      if (score) {
        console.log(customerOrders !== null && customerOrders.orders.length === 2)
      } else {
        console.log(customerOrders !== null && customerOrders.orders.length === 2 ? successMessage : failMessage)
      }
    } catch (ex) {
      console.log(score ? 'false' : errorMessage)
    }
  }

  async function testDelete (collection) {
    const successMessage = 'Congratulations! You have deleted a document!'
    const failMessage = 'You still need to delete a document.'
    const errorMessage = 'There was an error deleting a document.'
    try {
      const testData = generateTestData()
      await removeCustomerOrders(collection, newCustomerNumber)
      await mongoCode.insertCustomer(collection, testData.customer)
      const insertedCustomerOrders = await getCustomerOrders(collection, newCustomerNumber)
      await mongoCode.removeCustomerOrders(collection, newCustomerNumber)
      const customerOrders = await getCustomerOrders(collection, newCustomerNumber)
      if (score) {
        console.log(insertedCustomerOrders !== null && customerOrders === null)
      } else {
        console.log(customerOrders ? failMessage : successMessage)
      }
    } catch {
      console.log(errorMessage)
    }
  }

  async function testDataError (collection) {
    const successMessage = 'Congratulations! You have correctly handled a MongoDB data exception!'
    const failMessage = 'You still need to correctly handle a MongoDB data exception.'
    const errorMessage = 'You still need to correctly handle a MongoDB data exception.'
    try {
      await removeCustomerOrders(collection, newCustomerNumber)
      const testData = generateTestData()
      const good = await mongoCode.insertCustomer(collection, testData.customer)
      const bad = await mongoCode.insertCustomer(collection, testData.customer)
      if (score) {
        console.log((good !== null) && (good.insertedId === newCustomerNumber) && (bad !== null) && (bad.name === 'MongoServerError'))
      } else {
        console.log(good !== null && good.insertedId === newCustomerNumber && bad !== null && bad.name === 'MongoServerError' ? successMessage : failMessage)
      }
    } catch (ex) {
      console.log(score ? 'false' : debug ? ex : errorMessage)
    }
  }
})
