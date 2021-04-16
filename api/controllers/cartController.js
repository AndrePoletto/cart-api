const uuid = require('uuid');
const cartModel = require('../models/cartModel');

exports.serverStatus = (req, res) => {
    res.send('Server is up and Running!')
}

exports.addProduct = async (req, res) => {
    // Gets customer's current cart
    let cartObject = await getCartByCustomer(req.body.customerId);
    // Gets item info
    let itemObject = await getItemInfo(req.body.itemId);

    if (!!cartObject) {
        console.log("Client cart already in use, adding product");
        // Buscar pelo Id do produto no carrinho em memoria, se achar adiciona a quantidade, se não adiciona o item
        const itemObjectIndex = cartObject.items.findIndex(item => item.itemId === (req.body.itemId).toString());

        if (!!cartObject.items[itemObjectIndex]) {
            console.log("Item already added to cart, increasing quantity");
            // Adds req quantity to persisted quantity
            cartObject.items[itemObjectIndex].quantity += req.body.itemQuantity;
        } else {
            itemObject.quantity = req.body.itemQuantity;
            cartObject.items.push(itemObject)
        }
        // Calculates new total values
        const totalResult = calculatesCartTotals(cartObject.items);
        // Creates items Array
        const itemsArray = totalResult.itemsArray;

        // Preparing mongo update
        const query = {cartId: cartObject.cartId};
        const queryAction = {items: itemsArray, total: totalResult.cartTotalPrice};

        const callback = (err, success) => {
            if (success) {
                res.send(`Success, item ${req.body.itemId} added to cart`);
            } else {
                res.status(500).send({
                    message: err.message || "Some error occurred while adding new item to cart."
                });
            }
        };

        cartModel.findOneAndUpdate(query, queryAction, callback);
    } else {
        console.log("No cart found for given client, creating one now");
        // Adds item quantity
        itemObject.quantity = req.body.itemQuantity;
        // Calculates new total values
        const totalResult = calculatesCartTotals([itemObject]);
        // Creates items Array
        const itemsArray = totalResult.itemsArray;

        // Creates a new cart object
        const cart = new cartModel({
            cartId: uuid.v4(),
            customer: {
                customerId: req.body.customerId,
                // Fixing email for dev, usually would get this info from another API or even from the request
                email: "dev@email.com"
            },
            items: itemsArray,
            total: totalResult.cartTotalPrice
        });

        // Saves new cartModel in the database
        cart.save()
            .then(data => {
                res.send(`Success, item ${req.body.itemId} added to cart`);
            }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while adding new cart."
            });
        });
    }
}

exports.removeProduct = async (req, res) => {
    // Gets customer's current cart
    let cartObject = await getCartByCustomer(req.body.customerId);
    // Gets item info
    let itemObject = await getItemInfo(req.body.itemId);

    if (!!cartObject) {
        console.log(`Cart found with id ${cartObject.cartId}...`);
        // Searching product n items array
        const itemObjectIndex = cartObject.items.findIndex(item => item.itemId === (req.body.itemId).toString());
        if (!!cartObject.items[itemObjectIndex]) {
            console.log("Item found, removing it");
            // Removes product from object on memory
            cartObject.items.splice(itemObjectIndex, 1);
            // Calculates new total values
            const totalResult = calculatesCartTotals(cartObject.items);
            // Creates items Array
            const itemsArray = totalResult.itemsArray;

            // Preparing Mongo query
            const query = {cartId: cartObject.cartId};
            const queryAction = {items: itemsArray, total: totalResult.cartTotalPrice};

            const callback = (err, success) => {
                if (success) {
                    res.send(`Success, item ${req.body.itemId} removed from cart`);
                } else {
                    res.status(500).send({
                        message: err.message || "Some error occurred while removing item from cart."
                    });
                }
            };

            cartModel.findOneAndUpdate(query, queryAction, callback);
        } else {
            res.status(404).send({
                message: "Product not found on client's cart"
            });
        }
    } else {
        res.status(404).send({
            message: `Cart not found for client with id: ${req.body.customerId}`
        });
    }
}

exports.updateProduct = async (req, res) => {
    // Gets customer's current cart
    let cartObject = await getCartByCustomer(req.body.customerId);
    // Gets item info
    let itemObject = await getItemInfo(req.body.itemId);

    if (!!cartObject) {
        console.log(`Cart found with id ${cartObject.cartId}...`);
        // Searching product n items array
        const itemObjectIndex = cartObject.items.findIndex(item => item.itemId === (req.body.itemId).toString());
        if (!!cartObject.items[itemObjectIndex]) {
            console.log("Item found, updating quantity");

            // Changing object  memory quantity
            cartObject.items[itemObjectIndex].quantity = req.body.itemQuantity;

            // Calculates new total values
            const totalResult = calculatesCartTotals(cartObject.items);
            // Creates items Array
            const itemsArray = totalResult.itemsArray;

            // Preparing mongo query
            const query = {cartId: cartObject.cartId};
            const queryAction = {items: itemsArray, total: totalResult.cartTotalPrice};

            const callback = (err, success) => {
                if (success) {
                    res.send(`Updated item ${req.body.itemId} successfully`);
                } else {
                    res.status(500).send({
                        message: err.message || "Some error occurred while updating product quantity."
                    });
                }
            };

            cartModel.findOneAndUpdate(query, queryAction, callback);
        } else {
            res.status(404).send({
                message: "Product not found on client's cart"
            });
        }
    } else {
        res.status(404).send({
            message: `Cart not found for client with id: ${req.body.customerId}`
        });
    }
}

exports.deleteCart = async (req, res) => {
    // Gets customer's current cart
    let cartObject = await getCartByCustomer(req.body.customerId);

    if (!!cartObject) {
        const query = {cartId: cartObject.cartId};

        const callback = (err, success) => {
            if (success) {
                res.send(`Cart from client ${req.body.customerId} deleted successfully`);
            } else {
                res.status(500).send({
                    message: err.message || "Some error occurred while deleting cart."
                });
            }
        };

        cartModel.findOneAndDelete(query, callback);
    } else {
        res.status(404).send({
            message: `Cart not found for client with id: ${req.body.customerId}`
        });
    }
}

exports.addCoupon = async (req, res) => {
    // Gets coupon code
    const couponCode = req.body.couponCode;
    const couponObject = checksCoupon(couponCode);

    // Validates coupon
    if (!!couponObject) {
        // Gets customer's current cart
        let cartObject = await getCartByCustomer(req.body.customerId);

        if (!!cartObject) {
            console.log(`Cart found with id ${cartObject.cartId}...`);

            const query = {cartId: cartObject.cartId};
            // Updates persisted object
            queryAction = {
                coupon: couponObject
            };

            const callback = (err, success) => {
                if (success) {
                    res.send(`Coupon ${couponObject.couponId} added successfully`);
                } else {
                    res.status(500).send({
                        message: err.message || "Some error occurred while adding coupon."
                    });
                }
            };

            cartModel.findOneAndUpdate(query, queryAction, callback);
        } else {
            res.status(404).send({
                message: `Cart not found for client with id: ${req.body.customerId}`
            });
        }

    } else {
        res.status(403).send({
            message: `Coupon ${couponCode} is not valid`
        });
    }
}


// Internal API use only, with no endPoints
const calculatesCartTotals = (itemsArray = [], couponValue= null ) => {
    let cartTotalPrice = 0

    itemsArray.forEach((item, index) => {
        item.totalPrice = item.price * item.quantity;

        cartTotalPrice += item.totalPrice;
    });

    if (!!couponValue && couponValue > 0) {
        cartTotalPrice -= couponValue;
    }

    return {
        cartTotalPrice,
        itemsArray: itemsArray
    };
}


// Usually this would be obtained trough other APIs, here I'll use just constants
const getItemInfo = (itemId) => {
    let itemInfo = [
        {
            itemId: 1,
            price: 203.90,
            imageUrl: "/images/joystick.png",
            uri: "/joystick",
            productName: "Joystick",
            productCode: "1308"
        },
        {
            itemId: 2,
            price: 143.00,
            imageUrl: "/images/smart-switch.png",
            uri: "/smart-switch",
            productName: "Smart Switch",
            productCode: "2468"
        },
        {
            itemId: 3,
            price: 409.90,
            imageUrl: "/images/backpack.png",
            uri: "/backpack",
            productName: "Backpack",
            productCode: "9752"
        }
    ]

    return !!itemInfo[itemId-1] ? itemInfo[itemId-1] : null
}

const getCartByCustomer = (customerId) => {
    return cartModel.findOne({ 'customer.customerId': customerId }).exec();
}

const checksCoupon = (couponCode) => {
    return couponCode === "valido" ? {couponId: "23941", couponName: "crazy promotion", couponValue: 0.90} : null;
}