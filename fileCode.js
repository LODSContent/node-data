const fs = require('fs').promises

async function readCustomer (fileName, response) {
  const data = await fs.readFile(fileName, 'utf8')
  const customer = JSON.parse(data)
  response(customer)
}

async function readProducts (fileName, response) {
  const data = await fs.readFile(fileName, 'utf8')
  const lines = data.split('\n')
  const products = []
  for (const lineNo in lines) {
    const line = lines[lineNo]
    if (line.trim().length > 0) {
      const productJSON = line.slice(2)
      const product = JSON.parse(productJSON)
      products.push(product)
    }
  }
  response(products)
}

async function generateOrdersReport (path, response) {
  const allFiles = await fs.readdir(path)
  const csvFiles = allFiles.filter(file => file.indexOf('.csv') > -1)
  let orders = []
  for (const fileNo in csvFiles) {
    const fileName = csvFiles[fileNo]
    const filePath = `${path}/${fileName}`
    const data = await fs.readFile(filePath, 'utf8')
    const lines = data.split('\n')
    const fileData = []
    for (const lineNo in lines) {
      const line = lines[lineNo]
      const order = line.split(',')
      fileData.push(order)
    }
    const filtered = fileData.filter(order => order[2] === 'Shipped')
    filtered.sort((a, b) => b[4] - a[4])
    const sliced = filtered.slice(0, 5)
    orders = orders.concat(sliced)
  }
  response(orders)
}

module.exports.readCustomer = readCustomer
module.exports.readProducts = readProducts
module.exports.generateOrdersReport = generateOrdersReport
