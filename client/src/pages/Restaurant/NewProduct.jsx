import React, { useEffect, useState, useCallback } from 'react';
import '../../styles/NewProducts.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const NewProduct = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');

  const [productName, setProductName] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [productMainImg, setProductMainImg] = useState('');
  const [productMenuCategory, setProductMenuCategory] = useState('');
  const [productCategory, setProductCategory] = useState('');
  const [productNewCategory, setProductNewCategory] = useState('');
  const [productPrice, setProductPrice] = useState(0);
  const [productDiscount, setProductDiscount] = useState(0);
  const [AvailableCategories, setAvailableCategories] = useState([]);
  const [restaurant, setRestaurant] = useState();

  // Fetch categories
  const fetchCategories = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:6001/fetch-categories');
      setAvailableCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  }, []);

  // Fetch restaurant details
  const fetchRestaurant = useCallback(async () => {
    try {
      const response = await axios.get(`http://localhost:6001/fetch-restaurant-details/${userId}`);
      setRestaurant(response.data);
    } catch (error) {
      console.error('Error fetching restaurant:', error);
    }
  }, [userId]);

  useEffect(() => {
    fetchCategories();
    fetchRestaurant();
  }, [fetchCategories, fetchRestaurant]); // Include dependencies

  // Handle adding a new product
  const handleNewProduct = async () => {
    if (!restaurant) {
      alert('Restaurant details not loaded. Please try again.');
      return;
    }

    try {
      await axios.post('http://localhost:6001/add-new-product', {
        restaurantId: restaurant._id,
        productName,
        productDescription,
        productMainImg,
        productCategory,
        productMenuCategory,
        productNewCategory,
        productPrice,
        productDiscount,
      });

      alert('Product added');
      // Reset form fields
      setProductName('');
      setProductDescription('');
      setProductMainImg('');
      setProductCategory('');
      setProductMenuCategory('');
      setProductNewCategory('');
      setProductPrice(0);
      setProductDiscount(0);
      navigate('/restaurant-menu');
    } catch (error) {
      console.error('Error adding product:', error);
      alert('There was an error adding the product. Please try again.');
    }
  };

  return (
    <div className="new-product-page">
      <div className="new-product-container">
        <h3>New Product</h3>
        <div className="new-product-body">
          <div className="form-floating mb-3">
            <input
              type="text"
              className="form-control"
              id="floatingNewProduct1"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
            />
            <label htmlFor="floatingNewProduct1">Product Name</label>
          </div>
          <div className="form-floating mb-3">
            <input
              type="text"
              className="form-control"
              id="floatingNewProduct2"
              value={productDescription}
              onChange={(e) => setProductDescription(e.target.value)}
            />
            <label htmlFor="floatingNewProduct2">Product Description</label>
          </div>
          <div className="form-floating mb-3">
            <input
              type="text"
              className="form-control"
              id="floatingNewProduct3"
              value={productMainImg}
              onChange={(e) => setProductMainImg(e.target.value)}
            />
            <label htmlFor="floatingNewProduct3">Thumbnail Img URL</label>
          </div>

          <section>
            <h4>Type</h4>
            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                name="productCategory"
                value="Veg"
                id="flexRadioDefault1"
                onChange={(e) => setProductCategory(e.target.value)}
              />
              <label className="form-check-label" htmlFor="flexRadioDefault1">
                Veg
              </label>
            </div>
            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                name="productCategory"
                value="Non Veg"
                id="flexRadioDefault2"
                onChange={(e) => setProductCategory(e.target.value)}
              />
              <label className="form-check-label" htmlFor="flexRadioDefault2">
                Non Veg
              </label>
            </div>
            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                name="productCategory"
                value="Beverages"
                id="flexRadioDefault3"
                onChange={(e) => setProductCategory(e.target.value)}
              />
              <label className="form-check-label" htmlFor="flexRadioDefault3">
                Beverages
              </label>
            </div>
          </section>

          <div className="form-floating mb-3">
            <select
              className="form-select"
              id="floatingNewProduct5"
              aria-label="Default select example"
              value={productMenuCategory}
              onChange={(e) => setProductMenuCategory(e.target.value)}
            >
              <option value="">Choose Product Category</option>
              {AvailableCategories.map((category, index) => (
                <option key={index} value={category}>
                  {category}
                </option>
              ))}
              <option value="new category">New Category</option>
            </select>
            <label htmlFor="floatingNewProduct5">Category</label>
          </div>
          <div className="form-floating mb-3">
            <input
              type="number"
              className="form-control"
              id="floatingNewProduct6"
              value={productPrice}
              onChange={(e) => setProductPrice(e.target.value)}
            />
            <label htmlFor="floatingNewProduct6">Price</label>
          </div>
          <div className="form-floating mb-3">
            <input
              type="number"
              className="form-control"
              id="floatingNewProduct7"
              value={productDiscount}
              onChange={(e) => setProductDiscount(e.target.value)}
            />
            <label htmlFor="floatingNewProduct7">Discount (in %)</label>
          </div>

          {productMenuCategory === 'new category' && (
            <div className="form-floating mb-3">
              <input
                type="text"
                className="form-control"
                id="floatingNewProduct8"
                value={productNewCategory}
                onChange={(e) => setProductNewCategory(e.target.value)}
              />
              <label htmlFor="floatingNewProduct8">New Category</label>
            </div>
          )}
        </div>

        <button className="btn btn-primary" onClick={handleNewProduct}>
          Add Product
        </button>
      </div>
    </div>
  );
};

export default NewProduct;
