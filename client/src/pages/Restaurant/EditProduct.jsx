import React, { useEffect, useState, useCallback } from 'react';
import '../../styles/NewProducts.css';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const EditProduct = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');
  const { id } = useParams();

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

  const fetchCategories = useCallback(async () => {
    const response = await axios.get('http://localhost:6001/fetch-categories');
    setAvailableCategories(response.data);
  }, []);

  const fetchRestaurant = useCallback(async () => {
    const response = await axios.get(`http://localhost:6001/fetch-restaurant-details/${userId}`);
    setRestaurant(response.data);
  }, [userId]);

  const fetchItem = useCallback(async () => {
    const response = await axios.get(`http://localhost:6001/fetch-item-details/${id}`);
    setProductName(response.data.title);
    setProductDescription(response.data.description);
    setProductMainImg(response.data.itemImg);
    setProductCategory(response.data.category);
    setProductMenuCategory(response.data.menuCategory);
    setProductPrice(response.data.price);
    setProductDiscount(response.data.discount);
  }, [id]);

  useEffect(() => {
    fetchCategories();
    fetchRestaurant();
    fetchItem();
  }, [fetchCategories, fetchRestaurant, fetchItem]); // Include the functions in the dependency array

  const handleUpdateItem = async () => {
    await axios.put(`http://localhost:6001/update-product/${id}`, {
      restaurantId: restaurant._id,
      productName,
      productDescription,
      productMainImg,
      productCategory,
      productMenuCategory,
      productNewCategory,
      productPrice,
      productDiscount
    });
    alert("Product updated");
    // Reset the fields
    setProductName('');
    setProductDescription('');
    setProductMainImg('');
    setProductCategory('');
    setProductMenuCategory('');
    setProductNewCategory('');
    setProductPrice(0);
    setProductDiscount(0);

    navigate('/restaurant-menu');
  };

  return (
    <div className="new-product-page">
      <div className="new-product-container">
        <h3>Update Item</h3>
        <div className="new-product-body">
          <span>
            <div className="form-floating mb-3 span-21">
              <input type="text" className="form-control" id="floatingNewProduct1" value={productName} onChange={(e) => setProductName(e.target.value)} />
              <label htmlFor="floatingNewProduct1">Product name</label>
            </div>
            <div className="form-floating mb-3 span-22">
              <input type="text" className="form-control" id="floatingNewProduct2" value={productDescription} onChange={(e) => setProductDescription(e.target.value)} />
              <label htmlFor="floatingNewProduct2">Product Description</label>
            </div>
          </span>

          <div className="form-floating mb-3">
            <input type="text" className="form-control" id="floatingNewProduct3" value={productMainImg} onChange={(e) => setProductMainImg(e.target.value)} />
            <label htmlFor="floatingNewProduct3">Thumbnail Img URL</label>
          </div>

          <section>
            <h4>Type</h4>
            <span>
              <div className="form-check">
                <input className="form-check-input" type="radio" name="productCategory" value="Veg" id="flexRadioDefault1" checked={productCategory === 'Veg'} onChange={(e) => setProductCategory(e.target.value)} />
                <label className="form-check-label" htmlFor="flexRadioDefault1">Veg</label>
              </div>
              <div className="form-check">
                <input className="form-check-input" type="radio" name="productCategory" value="Non Veg" id="flexRadioDefault2" checked={productCategory === 'Non Veg'} onChange={(e) => setProductCategory(e.target.value)} />
                <label className="form-check-label" htmlFor="flexRadioDefault2">Non Veg</label>
              </div>
              <div className="form-check">
                <input className="form-check-input" type="radio" name="productCategory" value="Beverages" id="flexRadioDefault3" checked={productCategory === 'Beverages'} onChange={(e) => setProductCategory(e.target.value)} />
                <label className="form-check-label" htmlFor="flexRadioDefault3">Beverages</label>
              </div>
            </span>
          </section>

          <span>
            <div className="form-floating mb-3 span-3">
              <select className="form-select" id='floatingNewProduct5' aria-label="Default select example" value={productMenuCategory} onChange={(e) => setProductMenuCategory(e.target.value)}>
                <option value="">Choose Product category</option>
                {AvailableCategories.map((category, index) => (
                  <option key={index} value={category}>{category}</option>
                ))}
                <option value="new category">New category</option>
              </select>
              <label htmlFor="floatingNewProduct5">Category</label>
            </div>
            <div className="form-floating mb-3 span-3">
              <input type="number" className="form-control" id="floatingNewProduct6" value={productPrice} onChange={(e) => setProductPrice(Number(e.target.value))} />
              <label htmlFor="floatingNewProduct6">Price</label>
            </div>
            <div className="form-floating mb-3 span-3">
              <input type="number" className="form-control" id="floatingNewProduct7" value={productDiscount} onChange={(e) => setProductDiscount(Number(e.target.value))} />
              <label htmlFor="floatingNewProduct7">Discount (in %)</label>
            </div>
          </span>

          {productMenuCategory === 'new category' ? (
            <div className="form-floating mb-3">
              <input type="text" className="form-control" id="floatingNewProduct8" value={productNewCategory} onChange={(e) => setProductNewCategory(e.target.value)} />
              <label htmlFor="floatingNewProduct8">New Category</label>
            </div>
          ) : null}
        </div>

        <button className='btn btn-primary' onClick={handleUpdateItem}>Update</button>
      </div>
    </div>
  );
}

export default EditProduct;
