module.exports = (app) => {
    const cartController = require('../controllers/cartController');

    // Default status endPoint, just to check server status
    app.get('/', cartController.serverStatus);

    // Add item to cart
    app.post('/cart/product/add', cartController.addProduct);
}