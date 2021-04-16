const cartController = require('../api/controllers/cartController');

test('Adds a product to a empty/null cart', () => {
    const requestBody = {
        body: {
            "itemId": "1",
            "itemQuantity": 1,
            "customerId": "123",
            "customerEmail": "polettoandre@gmail.com"
        }
    };

    const result = cartController.addProduct(requestBody);

    expect(result.message).toBe("Success, 1 added to cart");
});