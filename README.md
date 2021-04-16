# Ecommerce Cart API

This project goal is to create a ecommerce cart api for a dev challenge

- [Context](#context)
- [EndPoints](#endpoints)
    - [`GET /`](#/)
    - [`GET /cart`](#/cart)
    - [`POST /cart/product/add`](#/cart/product/add)
    - [`POST /cart/product/remove`](#/cart/product/remove)
    - [`POST /cart/product/update`](#/cart/product/update)
    - [`POST /cart/remove`](#/cart/remove)
    - [`POST /cart/coupon/add`](#/cart/coupon/add)
- [Running project](#running-project)
- [Running tests](#running-tests)
    

## Context

This API must at least add a product, remove a product, update the product quantity,
persist a cart, delete the cart persisted, calculate the totals and subtotals and retrieve
the cart.

## EndPoints

### `GET`
### `/`


Checks the server status.

### `GET`
### `/cart`


Given **an customerId** via param, return an object.

**Example input:**

```curl
 http://<domain>/cart?customerId=0864
```

**Example output:**

```json
{
  "customer": {
    "customerId": "0864",
            "email": "dev@email.com"
  },
  "_id": "6079f40e2cc2a35663ffcd23",
          "cartId": "07cedcbe-4d92-4cd1-a611-9300ef6d337b",
          "items": [
    {
      "_id": "6079f40e2cc2a35663ffcd24",
      "itemId": "3",
      "price": 409.9,
      "imageUrl": "/images/backpack.png",
      "uri": "/backpack",
      "productName": "Backpack",
      "productCode": "9752",
      "quantity": 5,
      "totalPrice": 2049.5
    }
  ],
          "total": 2048.6,
          "coupon": [
    {
      "_id": "6079f4b8ea680a57edc4334d",
      "couponId": "23941",
      "couponName": "crazy promotion",
      "couponValue": 0.9
    }
  ],
          "createdAt": "2021-04-16T20:31:10.145Z",
          "updatedAt": "2021-04-16T20:34:00.830Z"
}
```


### `POST`
### `/cart/product/add`
Adds a item to the cart
Given an **itemId**, a **customerId** and an **itemQuantity**, return a String confirming the request success, or an Object with the error message.

**Example input:**

```json
{
  "itemId": "3",
  "itemQuantity": 5,
  "customerId": "0864"
}
```

**Example output:**

```js
Success, item 3 added to cart
```


### `POST`
### `/cart/product/remove`
Removes a item from the cart completely
Given an **itemId**, a **customerId** , return a String confirming the request success, or an Object with the error message.

**Example input:**

```json
{
  "itemId": "2",
  "customerId": "0864"
}
```

**Example output:**

```js
Success, item 3 removed from cart
```


### `POST`
### `/cart/product/update`
Updates item quantity
Given an **itemId**, a **customerId** and an **itemQuantity**, return a String confirming the request success, or an Object with the error message.

**Example input:**

```json
{
  "itemId": "3",
  "itemQuantity": 4,
  "customerId": "0864"
}
```

**Example output:**

```js
Updated item 3 successfully
```


### `POST`
### `/cart/remove`
Deletes the cart entirely
Given an **customerId**, return a String confirming the request success, or an Object with the error message.

**Example input:**

```json
{
  "customerId": "0864"
}
```

**Example output:**

```js
Cart from client 0864 deleted successfully
```


### `POST`
### `/cart/coupon/add`
Adds a coupon to cart
Given an **couponCode** and a **customerId**, return a String confirming the request success, or an Object with the error message.

**Example input:**

```json
{
  "couponCode": "valido",
  "customerId": "0864"
}
```

**Example output:**

```js
Coupon 23941 added successfully
```

## Running project

By executing the _package.json_ `run` script we can run this project for development

```sh
# With npm
$ npm  run
```
this project also have a `docker-compose.yml` file that can be used
```sh
# With docker
$ docker-compose up
```

the default port is 5000, so the endpoints can be accessed on `localhost:5000`

## Running tests

By executing the _package.json_ `test` script, a `jest` process will start and re-run the test suite after every file change you made.

```sh
# With npm
$ npm  test
```

## TO-DO

Some things were left to latter development:
  * Tests
  * Performance improvement
  * Portuguese translation
  * Add clear and translated comments

Thinking about code and performance improvement as well as new features
we can talk about some thoughts.

The customerId could be obtained via some JWT or something similar.

When we add a product via ```/cart/product/add```, what would happen to the
productObject if this product had received some update?

What should happen if we try to delete an empty cart?

All the objects inside the cartModel (`items, coupon and customer`) can receive different keys and values

In summary, all the decisions were made focusing the 'must have' context to make this challenge easier.

Some functions, like 
```js
calculatesCartTotals
```
could be splitted into minor functions, improving performance once it returns and handles to many
objects.