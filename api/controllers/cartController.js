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

        let queryAction = {};
        if (!!cartObject.items[itemObjectIndex]) {
            console.log("Item already added to cart, increasing quantity");
            // Adds req quantity to persisted quantity
            cartObject.items[itemObjectIndex].quantity += req.body.itemQuantity;
            // Updates persisted object
            queryAction = {
                items: cartObject.items
            }
        } else {
            itemObject.quantity = req.body.itemQuantity;
            // Pushes a new object to items array
            queryAction = {
                $push: {
                    items: itemObject
                }
            };
        }
        const query = {cartId: cartObject.cartId};

        const callback = (err, success) => {
            if (success) {
                res.send(`Success, ${req.body.itemId} added to cart`);
            } else {
                res.status(500).send({
                    message: err.message || "Some error occurred while adding new item to cart."
                });
            }
        };

        cartModel.findOneAndUpdate(query, queryAction, callback);
    } else {
        // Adds item quantity
        itemObject.quantity = req.body.itemQuantity;
        // Creates a new cart object
        const cart = new cartModel({
            cartId: uuid.v4(),
            customer: {
                customerId: req.body.customerId,
                email: req.body.customerEmail
            },
            items: [itemObject]
        });

        // Saves new cartModel in the database
        cart.save()
            .then(data => {
                res.send(`Success, ${req.body.itemId} added to cart`);
            }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while adding new cart."
            });
        });
    }
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

    return itemInfo[itemId-1]
}

const getCartByCustomer = (customerId) => {
    return cartModel.findOne({ 'customer.customerId': customerId }).exec();
}

const checksCoupon = (couponCode) => {
    return couponCode === "valido" ? {couponId: "23941", couponName: "crazy promotion", couponValue: 0.90} : null;
}