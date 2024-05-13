const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const passport = require('passport');
const bodyParser = require('body-parser');
const session = require('express-session');
const localStrategy = require('./strategies/local-strategy');
const Product = require('./models/Product');

// Import the routes
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/product');
const emailRoutes = require('./routes/emailRoutes');

// Create an Express app
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  session({
    secret: 'to punish and enslave',
    saveUninitialized: true,
    resave: false,
    cookie: { maxAge: 60000 * 60 },
  })
);
app.use(passport.initialize());
app.use(passport.session());
passport.use(localStrategy);


const products_ = [
    { 
        name: 'Virtual Reality Glasses',
        description: "Track your fitness journey effortlessly with the Smart Ring, a sleek wearable that combines style and health monitoring right on your fingertip.",
        category: 'Electronics',
        price: 299.00,
        image: 'img/product-1.jpg',
        inventory: 100,
    },
    { 
        name: 'Wireless Headphones',
        description: "Track your fitness journey effortlessly with the Smart Ring, a sleek wearable that combines style and health monitoring right on your fingertip.",
        category: 'Electronics',
        price: 19.00,
        image: 'img/product-2.jpg',
        inventory: 150,
    },
    { 
        name: 'Smartwatch',
        description: "Track your fitness journey effortlessly with the Smart Ring, a sleek wearable that combines style and health monitoring right on your fingertip.",
        category: 'Electronics',
        price: 199.00,
        image: 'img/product-3.jpg',
        inventory: 200,
    },
];


// MongoDB connection
const mongoURI = 'mongodb://localhost:27017/shop';
mongoose
  .connect(mongoURI, {})
  .then(async () => {
    console.log('MongoDB connected');
    // Insert products into the Product collection
    await Product.deleteMany({});
    await Product.insertMany(products_);
    console.log('Products inserted into the database');
  })
  .catch((err) => console.log('MongoDB connection error:', err));



// Apply the routes
app.post(
  '/api/auth/login',
  passport.authenticate('local', { failureRedirect: '/login' }),
  (req, res) => {
    res.json({ message: 'Authenticated successfully', user: req.user });
  }
);
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/email', emailRoutes);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});