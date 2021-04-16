module.exports = (app) => {
    const cartController = require('../controllers/cartController');

    // Default status endPoint, just to check server status
    app.get('/', cartController.serverStatus);

    // Retrieves cart to front
    app.get('/cart', cartController.getCart);

    // Add item to cart
    app.post('/cart/product/add', cartController.addProduct);

    // Remove item from cart
    app.post('/cart/product/remove', cartController.removeProduct);

    // Update item quantity
    app.post('/cart/product/update', cartController.updateProduct);

    // Delete the hole cart Object
    app.post('/cart/remove', cartController.deleteCart);

    // Add coupon
    app.post('/cart/coupon/add', cartController.addCoupon);
}