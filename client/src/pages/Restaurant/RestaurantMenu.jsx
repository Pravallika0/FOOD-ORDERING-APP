import axios from 'axios';
import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const RestaurantMenu = () => {
    const navigate = useNavigate();
    const userId = localStorage.getItem('userId');

    const [availableCategories, setAvailableCategories] = useState([]);
    const [restaurant, setRestaurant] = useState(null);
    const [items, setItems] = useState([]);
    const [visibleItems, setVisibleItems] = useState([]);

    // Fetch categories, restaurant details, and items
    const fetchCategories = useCallback(async () => {
        const response = await axios.get('http://localhost:6001/fetch-categories');
        setAvailableCategories(response.data);
    }, []);

    const fetchRestaurant = useCallback(async () => {
        const response = await axios.get(`http://localhost:6001/fetch-restaurant-details/${userId}`);
        setRestaurant(response.data);
    }, [userId]);

    const fetchItems = useCallback(async () => {
        const response = await axios.get('http://localhost:6001/fetch-items');
        setItems(response.data);
        setVisibleItems(response.data); // Initialize visible items
    }, []);

    useEffect(() => {
        fetchCategories();
        fetchRestaurant();
        fetchItems();
    }, [fetchCategories, fetchRestaurant, fetchItems]);

    const [sortFilter, setSortFilter] = useState('popularity');
    const [categoryFilter, setCategoryFilter] = useState([]);
    const [typeFilter, setTypeFilter] = useState([]);

    const handleCategoryCheckBox = (e) => {
        const value = e.target.value;
        setCategoryFilter((prev) =>
            e.target.checked ? [...prev, value] : prev.filter((category) => category !== value)
        );
    };

    const handleTypeCheckBox = (e) => {
        const value = e.target.value;
        setTypeFilter((prev) =>
            e.target.checked ? [...prev, value] : prev.filter((type) => type !== value)
        );
    };

    const handleSortFilterChange = (e) => {
        const value = e.target.value;
        setSortFilter(value);
        let sortedItems = [...visibleItems];

        switch (value) {
            case 'low-price':
                sortedItems.sort((a, b) => a.price - b.price);
                break;
            case 'high-price':
                sortedItems.sort((a, b) => b.price - a.price);
                break;
            case 'discount':
                sortedItems.sort((a, b) => b.discount - a.discount);
                break;
            case 'rating':
                sortedItems.sort((a, b) => b.rating - a.rating);
                break;
            default:
                break;
        }
        setVisibleItems(sortedItems);
    };

    useEffect(() => {
        const filteredItems = items.filter((product) => {
            const inCategory = categoryFilter.length === 0 || categoryFilter.includes(product.menuCategory);
            const inType = typeFilter.length === 0 || typeFilter.includes(product.category);
            return inCategory && inType;
        });
        setVisibleItems(filteredItems);
    }, [categoryFilter, typeFilter, items]);

    return (
        <div className="AllRestaurantsPage" style={{ marginTop: '14vh' }}>
            <div className="restaurants-container">
                <div className="restaurants-filter">
                    <h4>Filters</h4>
                    <div className="restaurant-filters-body">
                        <div className="filter-sort">
                            <h6>Sort By</h6>
                            <div className="filter-sort-body sub-filter-body">
                                {['popularity', 'low-price', 'high-price', 'discount', 'rating'].map((filter) => (
                                    <div className="form-check" key={filter}>
                                        <input
                                            className="form-check-input"
                                            type="radio"
                                            name="flexRadioDefault"
                                            id={`filter-sort-radio-${filter}`}
                                            value={filter}
                                            checked={sortFilter === filter}
                                            onChange={handleSortFilterChange}
                                        />
                                        <label className="form-check-label" htmlFor={`filter-sort-radio-${filter}`}>
                                            {filter.charAt(0).toUpperCase() + filter.slice(1).replace('-', ' ')}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="filter-categories">
                            <h6>Food Type</h6>
                            <div className="filter-categories-body sub-filter-body">
                                {['Veg', 'Non Veg', 'Beverages'].map((type) => (
                                    <div className="form-check" key={type}>
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            value={type}
                                            id={`filter-category-check-${type}`}
                                            checked={typeFilter.includes(type)}
                                            onChange={handleTypeCheckBox}
                                        />
                                        <label className="form-check-label" htmlFor={`filter-category-check-${type}`}>
                                            {type}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="filter-categories">
                            <h6>Categories</h6>
                            <div className="filter-categories-body sub-filter-body">
                                {availableCategories.map((category) => (
                                    <div className="form-check" key={category}>
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            value={category}
                                            id={`filter-category-check-${category}`}
                                            checked={categoryFilter.includes(category)}
                                            onChange={handleCategoryCheckBox}
                                        />
                                        <label className="form-check-label" htmlFor={`filter-category-check-${category}`}>
                                            {category}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="restaurants-body">
                    <h3>All Items</h3>
                    <div className="restaurants">
                        {visibleItems
                            .filter((item) => restaurant && item.restaurantId === restaurant._id)
                            .map((item) => (
                                <div className='restaurant-item' key={item._id}>
                                    <div className="restaurant">
                                        <img src={item.itemImg} alt="" />
                                        <div className="restaurant-data">
                                            <h6>{item.title}</h6>
                                            <p>{item.description.slice(0, 25) + '...'}</p>
                                            <h6>&#8377; {item.price}</h6>
                                            <button className='btn btn-outline-primary' onClick={() => navigate(`/update-product/${item._id}`)}>Update</button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RestaurantMenu;
