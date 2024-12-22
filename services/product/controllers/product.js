const products = require('../modules/products');

let productEmitter = new products();

//Emitting events
productEmitter.emit('productAdded')
productEmitter.emit('productDeleted', { id: 2, name: 'Product 2' })
productEmitter.emit('productUpdated', { id: 3, name: 'Product 3' })
productEmitter.emit('productCreated', { id: 4, name: 'Product 4' })


//Listening to events
productEmitter.on('productAdded', (data) => {})
productEmitter.on('productDeleted', (data) => {})
productEmitter.on('productUpdated', (data) => {})
productEmitter.on('productCreated', (data) => {})