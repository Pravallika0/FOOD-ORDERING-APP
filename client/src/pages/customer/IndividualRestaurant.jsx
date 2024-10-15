import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Import useNavigate
import axios from "axios";

const IndividualRestaurant = () => {
  const { id } = useParams();
  const navigate = useNavigate(); // Initialize navigate
  const [restaurant, setRestaurant] = useState(null);
  const [foodItems, setFoodItems] = useState([]);
  const [availableCategories, setAvailableCategories] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState([]);
  const [quantity, setQuantity] = useState(0);

  const fetchCategories = useCallback(async () => {
    try {
      const response = await axios.get(`/api/categories/${id}`);
      setAvailableCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  }, [id]);

  const fetchItems = useCallback(async () => {
    try {
      const response = await axios.get(`/api/restaurant/${id}/items`);
      setFoodItems(response.data);
    } catch (error) {
      console.error("Error fetching food items:", error);
    }
  }, [id]);

  useEffect(() => {
    const fetchRestaurantDetails = async () => {
      try {
        const response = await axios.get(`/api/restaurants/${id}`);
        setRestaurant(response.data);
      } catch (error) {
        console.error("Error fetching restaurant details:", error);
      }
    };

    fetchRestaurantDetails();
    fetchCategories();
    fetchItems();
  }, [fetchCategories, fetchItems, id]);

  const handleCategoryCheckBox = (e) => {
    const { value, checked } = e.target;
    setCategoryFilter((prev) =>
      checked ? [...prev, value] : prev.filter((cat) => cat !== value)
    );
  };

  const handleAddToCart = (foodItemId, foodItemName, restaurantId, imgUrl, price, discount) => {
    // Add your cart logic here, e.g., updating the state or calling a context function
    console.log("Adding to cart:", { foodItemId, foodItemName, restaurantId, imgUrl, price, discount });
    
    // Navigate to the cart page after adding the item
    navigate("/cart"); // Adjust this path as necessary for your app's routing
  };

  const visibleItems = categoryFilter.length > 0 
    ? foodItems.filter(item => categoryFilter.includes(item.category)) 
    : foodItems;

  return (
    <div className="individual-restaurant">
      {restaurant ? (
        <>
          <h2>{restaurant.name}</h2>
          <div className="filter-menu">
            <div className="filter-menu-category">
              <h6>Menu Category</h6>
              <div className="filter-menu-category-body">
                {availableCategories.map((category) => (
                  <div key={category.id} className="form-check">
                    <input 
                      className="form-check-input" 
                      type="checkbox" 
                      value={category.category} 
                      id={`filter-category-check-${category.id}`} 
                      checked={categoryFilter.includes(category.category)} 
                      onChange={handleCategoryCheckBox} 
                    />
                    <label className="form-check-label" htmlFor={`filter-category-check-${category.id}`}>
                      {category.category}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="restaurant-food-items">
            <h4>Food Items</h4>
            <div className="restaurant-food-items-body">
              {visibleItems.map((foodItem) => (
                <div className="restaurant-food-item" key={foodItem.id}>
                  <img src={foodItem.imgUrl} alt={foodItem.name} />
                  <div className="restaurant-food-item-info">
                    <h5>{foodItem.name}</h5>
                    <p>Price: {foodItem.price}₹</p>
                    <p>Discount: {foodItem.discount}%</p>
                    <p>Rating: {foodItem.rating}⭐</p>
                    <div className="restaurant-food-item-quantity">
                      <button onClick={() => setQuantity(quantity > 0 ? quantity - 1 : 0)}>-</button>
                      <span>{quantity}</span>
                      <button onClick={() => setQuantity(quantity + 1)}>+</button>
                    </div>
                    <button className="add-to-cart" onClick={() => handleAddToCart(foodItem.id, foodItem.name, restaurant.id, foodItem.imgUrl, foodItem.price, foodItem.discount)}>Add to Cart</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <h3>Loading...</h3>
      )}
    </div>
  );
};

export default IndividualRestaurant;
