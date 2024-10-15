import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv'; // Import dotenv
import Joi from 'joi'; // Import Joi for validation
import { Admin, Cart, FoodItem, Orders, Restaurant, User } from './Schema.js'; // Import your schemas

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3007; // Use environment variable or default to 3007

// CORS configuration
const corsOptions = {
    origin: 'http://localhost:3010', // Replace with your frontend URL
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
};
// Middleware
app.use(cors(corsOptions)); // Apply CORS options
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));

// Retry MongoDB connection logic
const connectWithRetry = () => {
    console.log('Attempting MongoDB connection...');
    mongoose.connect(process.env.DRIVER_LINK)
        .then(() => {
            console.log('MongoDB connected successfully.');
            // Start the server after the database connection
            app.listen(PORT, () => {
                console.log(`Server is running on port: ${PORT}`);
            });

            // Routes setup
            setupRoutes(app);
        })
        .catch((err) => {
            console.error('MongoDB connection failed, retrying in 5 seconds...', err);
             // Retry after 5 seconds
        });
};

// Start MongoDB connection
connectWithRetry();

// Function to set up routes
function setupRoutes(app) {
    // Validation schema for register request
    const registerSchema = Joi.object({
        username: Joi.string().min(3).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
        usertype: Joi.string().valid('restaurant', 'customer').required(),
        restaurantAddress: Joi.string().when('usertype', { is: 'restaurant', then: Joi.required() }),
        restaurantImage: Joi.string().when('usertype', { is: 'restaurant', then: Joi.required() }),
    });

    // Register route
    app.post('/register', async (req, res) => {
        const { error } = registerSchema.validate(req.body); // Validate incoming request data
        if (error) return res.status(400).json({ message: error.details[0].message });

        const { username, email, usertype, password, restaurantAddress, restaurantImage } = req.body;
        try {
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ message: 'User with this email already exists' });
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = new User({
                username,
                email,
                usertype,
                password: hashedPassword,
                approval: usertype === 'restaurant' ? 'pending' : 'approved',
            });

            const user = await newUser.save();

            // If user is a restaurant, create a Restaurant record
            if (usertype === 'restaurant') {
                const restaurant = new Restaurant({
                    ownerId: user._id,
                    title: username,
                    address: restaurantAddress,
                    mainImg: restaurantImage,
                    menu: [],
                });
                await restaurant.save();
            }

            return res.status(201).json({ message: 'User registered successfully', user });
        } catch (error) {
            console.error(error); // Log the actual error for debugging
            return res.status(500).json({ message: 'Internal server error during registration' });
        }
    });

    // Login route
    app.post('/login', async (req, res) => {
        const { email, password } = req.body;
        try {
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(401).json({ message: 'Invalid email or password' });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(401).json({ message: 'Invalid email or password' });
            }

            return res.json({ message: 'Login successful', user });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Internal server error during login' });
        }
    });

    // Fetch users route
    app.get('/fetch-users', async (req, res) => {
        try {
            const users = await User.find();
            res.json(users);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Error occurred' });
        }
    });

    // Fetch categories route
    app.get('/fetch-categories', (req, res) => {
        const categories = ['Pizza', 'Burger', 'Sushi', 'Salad']; // Sample categories
        res.json(categories);
    });

    // Root route
    app.get('/', (req, res) => {
        res.send('Welcome to SB Foods API!'); // Welcome message or HTML content
    });

    // Fetch restaurants route
    app.get('/restaurants', async (req, res) => {
        try {
            const restaurants = await Restaurant.find(); // Fetch all restaurants
            res.status(200).json(restaurants);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to fetch restaurants' });
        }
    });

    // Fetch promoted list route
    app.get('/fetch-promoted-list', async (req, res) => {
        try {
            const promotedRestaurants = await Restaurant.find({ isPromoted: true }); // Adjust query as necessary
            res.json(promotedRestaurants);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Error occurred' });
        }
    });
}
