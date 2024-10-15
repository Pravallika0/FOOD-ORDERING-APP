import { MongoClient, ServerApiVersion } from 'mongodb';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// MongoDB connection URI from environment variable
const uri = process.env.DRIVER_LINK;

const client = new MongoClient(uri, {
    serverApi: ServerApiVersion.v1,
});

async function connectToDatabase() {
    try {
        await client.connect();
        console.log('Connected to MongoDB Atlas');
    } catch (err) {
        console.error('Error connecting to MongoDB:', err);
    }
}

// Function to fetch all restaurants
async function fetchRestaurants() {
    const dbName = "SBFOODS"; // Your database name
    const db = client.db(dbName); // Reference to the database

    try {
        const restaurants = await db.collection("restaurants").find().toArray();
        return restaurants;
    } catch (error) {
        console.error('Error fetching restaurants:', error);
        throw error; // Rethrow the error for further handling
    }
}

// Call the connection function
connectToDatabase();

// Export the connection function, client, and fetchRestaurants function
export { connectToDatabase, client, fetchRestaurants };
