const events = require('events');

module.exports = class extends events.EventEmitter {
    constructor() {
        super();
    }
    addProduct(product) {
        this.emit('productAdded', product);
    }
    deleteProduct(product) {
        this.emit('productDeleted', product);
    }
    updateProduct(product) {
        this.emit('productUpdated', product);
    }
    createProduct(product) {
        this.emit('productCreated', product);
    }
}