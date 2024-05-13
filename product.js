const express = require('express');
const router = express.Router();
const Product = require('../models/Product');


const User = require("../models/User")

// GET /products - Get all products
router.get('/', async (req, res) => {
    try {
        const products = await Product.find({});
        res.json(products);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


router.get('/new', async (req, res) => {
    try {
        const latestProduct = await Product.find({})
        .sort({ createdAt: -1 }) // Sort by createdAt field in descending order
        .limit(1); // Limit the result to 1 document    
        res.json(latestProduct);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET /products/:id - Get a single product by ID
router.get('/:id', async (req, res) => {
    try {
        const products = await Product.find();
        let foundProduct;
    
        products.forEach(product => {
    
            if (product._id.toString() == req.params.id) {
                foundProduct = product;
            }
        });
    
        if (foundProduct) {
            res.json(foundProduct);
        } else {
            // Handle case when product with given ID is not found
            res.status(404).json({ error: "Product not found" });
        }
    } catch (err) {
        // Handle errors
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
});

// GET /products/category/:category - Get products by category
router.get('/category/:category', async (req, res) => {
    try {
        const products = await Product.find({ category: req.params.category });
        res.json(products);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


router.post('/add-to-cart', async (req, res) => {
    const { userId, productId } = req.body;

    try {
        // Check if the user exists
        const user = await User.findById(userId.toString());
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }
        // Update user's cart with the new product
        user.cart.items.push({ productId: productId, quantity: 1 });
        await user.save();
        res.json({ success: true, message: 'Product added to cart successfully.', user });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, message: 'Internal server error.' });
    }
});





router.post("/cart-items", async (req, res) => {
    try {
        const { userId, productIds } = req.body;

        // Find the user based on the provided userId
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Extract productIds from the user's cart
        const cartProductIds = user.cart.items.map(item => item.productId);


        // Find all products whose IDs are in the cartProductIds array
        const products = await Product.find({ _id: { $in: cartProductIds } });

        // Send the products array as the response
        res.json(products);
    } catch (error) {
        console.error('Error finding products:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});



router.get("/remove-from-cart/:userId/:productId", async (req, res) => {
    try {
        const { userId, productId } = req.params;

        // Check if user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Find the index of the item in the cart array
        const itemIndex = user.cart.items.findIndex(item => item.productId === productId);
        // If item not found, return error
        if (itemIndex == -1) {
            return res.status(404).json({ error: `Product ${productId} not found in cart of user ${userId}` });
        }

        // Remove the item from the cart array
        user.cart.items.splice(itemIndex, 1);

        // Save the updated user document
        await user.save();

        // Send a response indicating success
        res.status(200).json({ message: `Product ${productId} removed from cart of user ${userId}`, user });
    } catch (error) {
        console.error('Error removing product from cart:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


module.exports = router;