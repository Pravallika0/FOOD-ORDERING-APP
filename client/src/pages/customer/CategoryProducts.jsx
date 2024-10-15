import React, { useEffect, useState, useCallback } from 'react';
import Footer from '../../components/Footer';
import '../../styles/CategoryProducts.css';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const CategoryProducts = () => {
  const navigate = useNavigate();
  const { category } = useParams();
  const [restaurants, setRestaurants] = useState([]);

  // Define fetchRestaurants using useCallback
  const fetchRestaurants = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:3007/fetch-restaurants');
      setRestaurants(response.data.filter(restaurant => restaurant.menu.includes(category)));
    } catch (error) {
      console.error('Error fetching restaurants:', error);
    }
  }, [category]);

  // useEffect to fetch restaurants
  useEffect(() => {
    fetchRestaurants();
  }, [fetchRestaurants]); // Added fetchRestaurants to dependency array

  return (
    <div className="categoryProducts-page">
      <h2>Restaurants Serving {category}</h2>

      <div className="restaurants-container">
        <div className="restaurants-body">
          <div className="restaurants">
            {restaurants.map((restaurant) => (
              <div className='restaurant-item' key={restaurant._id}>
                <div className="restaurant" onClick={() => navigate(`/restaurant/${restaurant._id}`)}>
                  <img src={restaurant.mainImg} alt={`${restaurant.title}`} />
                  <div className="restaurant-data">
                    <h6>{restaurant.title}</h6>
                    <p>{restaurant.address}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default CategoryProducts;
