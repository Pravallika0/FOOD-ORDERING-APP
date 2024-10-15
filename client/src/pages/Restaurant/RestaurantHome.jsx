import React, { useEffect, useState, useCallback } from 'react';
import '../../styles/RestaurantHome.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const RestaurantHome = () => {
    const navigate = useNavigate();
    const userId = localStorage.getItem('userId');

    const [restaurant, setRestaurant] = useState('pending');
    const [ItemsCount, setItemsCount] = useState(0);
    const [ordersCount, setOrdersCount] = useState(0);
    const [restaurantData, setRestaurantData] = useState();

    const fetchUserData = useCallback(async () => {
        try {
            const response = await axios.get(`http://localhost:6001/fetch-user-details/${userId}`);
            setRestaurant(response.data);
            console.log(response.data._id);
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    }, [userId]);

    const fetchRestaurantData = useCallback(async () => {
        try {
            const response = await axios.get(`http://localhost:6001/fetch-restaurant-details/${userId}`);
            setRestaurantData(response.data);
            console.log(response.data);
        } catch (error) {
            console.error("Error fetching restaurant data:", error);
        }
    }, [userId]);

    const fetchItems = useCallback(async () => {
        try {
            const response = await axios.get('http://localhost:6001/fetch-items');
            setItemsCount(response.data.filter(item => item.restaurantId === restaurantData?._id).length);
        } catch (error) {
            console.error("Error fetching items:", error);
        }
    }, [restaurantData]);

    const fetchOrders = useCallback(async () => {
        try {
            const response = await axios.get('http://localhost:6001/fetch-orders');
            setOrdersCount(response.data.filter(item => item.restaurantId === restaurantData?._id).length);
        } catch (error) {
            console.error("Error fetching orders:", error);
        }
    }, [restaurantData]);

    // Corrected useEffect to include fetchRestaurantData
    useEffect(() => {
        fetchUserData();
    }, [fetchUserData]);

    useEffect(() => {
        fetchRestaurantData();
    }, [fetchRestaurantData]); // Change made here to include fetchRestaurantData

    useEffect(() => {
        if (restaurantData) {
            fetchItems();
            fetchOrders();
        }
    }, [restaurantData, fetchItems, fetchOrders]);

    return (
        <div className="restaurantHome-page">
            {restaurant.approval === 'pending' ? (
                <div className="restaurant-approval-required">
                    <h3>Approval required!!</h3>
                    <p>You need to get approval from the admin to make this work. Please be patient!!!</p>
                </div>
            ) : (
                <>
                    <div>
                        <div className="admin-home-card">
                            <h5>All Items</h5>
                            <p>{ItemsCount}</p>
                            <button onClick={() => navigate('/restaurant-menu')}>View all</button>
                        </div>
                    </div>
                    <div>
                        <div className="admin-home-card">
                            <h5>All Orders</h5>
                            <p>{ordersCount}</p>
                            <button onClick={() => navigate('/restaurant-orders')}>View all</button>
                        </div>
                    </div>
                    <div>
                        <div className="admin-home-card">
                            <h5>Add Item</h5>
                            <p>(new)</p>
                            <button onClick={() => navigate('/new-product')}>Add now</button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

export default RestaurantHome;
