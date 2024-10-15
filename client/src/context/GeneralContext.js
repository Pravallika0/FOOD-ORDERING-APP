// src/context/GeneralContext.js

import React, { createContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const GeneralContext = createContext();

const GeneralContextProvider = ({ children }) => {
    const navigate = useNavigate();

    // State variables
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [usertype, setUsertype] = useState('');
    const [restaurantAddress, setRestaurantAddress] = useState('');
    const [restaurantImage, setRestaurantImage] = useState('');
    const [productSearch, setProductSearch] = useState('');
    const [cartCount, setCartCount] = useState(0);

    // Fetch cart count when the component mounts
    useEffect(() => {
        fetchCartCount();
    }, []);

    const fetchCartCount = async () => {
        const userId = localStorage.getItem('userId');
        if (userId) {
            try {
                const response = await axios.get('http://localhost:3007/fetch-cart');
                // Filter items in the cart based on userId
                const userCartItems = response.data.filter(item => item.userId === userId);
                setCartCount(userCartItems.length);
            } catch (error) {
                console.error('Failed to fetch cart count:', error);
            }
        }
    };

    const handleSearch = () => {
        navigate('#products-body'); // Navigate to the product section
    };

    const apiCall = async (url, method, data) => {
        try {
            const response = await axios({ method, url, data });
            return response.data;
        } catch (error) {
            console.error(`API call failed: ${error}`);
            alert(error.response?.data?.message || 'Something went wrong! Please try again.');
            throw error; // Rethrow error for further handling if needed
        }
    };

    const login = async () => {
        try {
            const loginInputs = { email, password };
            const res = await apiCall('http://localhost:3007/login', 'POST', loginInputs);
            handleUserResponse(res);
        } catch (err) {
            console.error('Login error:', err);
        }
    };

    const register = async () => {
        const inputs = { username, email, usertype, password, restaurantAddress, restaurantImage };
        try {
            const res = await apiCall('http://localhost:3007/register', 'POST', inputs);
            handleUserResponse(res);
        } catch (err) {
            console.error('Registration error:', err);
        }
    };

    const handleUserResponse = (res) => {
        // Store user information in local storage
        localStorage.setItem('userId', res._id);
        localStorage.setItem('userType', res.usertype);
        localStorage.setItem('username', res.username);
        localStorage.setItem('email', res.email);

        // Define routing based on user type
        const routes = {
            customer: '/',
            admin: '/admin',
            restaurant: '/restaurant',
        };

        // Navigate to the appropriate route
        navigate(routes[res.usertype] || '/');
    };

    const logout = () => {
        localStorage.clear(); // Clear all local storage
        navigate('/'); // Redirect to home page
    };

    return (
        <GeneralContext.Provider value={{
            login,
            register,
            logout,
            username,
            setUsername,
            email,
            setEmail,
            password,
            setPassword,
            usertype,
            setUsertype,
            setRestaurantAddress,
            setRestaurantImage,
            productSearch,
            setProductSearch,
            handleSearch,
            cartCount,
            fetchCartCount,
        }}>
            {children}
        </GeneralContext.Provider>
    );
};

export default GeneralContextProvider;
