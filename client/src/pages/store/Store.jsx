import React, { useEffect, useState } from "react";
import "./style.scss";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { baseUrl } from "../../config/baseUrl.js";
const Store = () => {
  const nav = useNavigate();
  const [productData, setProductData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${baseUrl}/api/store`,
          {
            withCredentials: true,
          }
        );
        setProductData(response.data.data);
      } catch (error) {
        console.error('검색 중 오류:', error);
      }
    };
  
    fetchData();
  }, []);
  

  const handleSubmit = (ProductID) => {
    nav(`/store/${ProductID}`);
  };

  return (
    <div className="store">
      <div className="card-container">
        <div className="product-card">
          {productData &&
            productData.map((product) => (
              <div
                className="card"
                key={product.ProductID}
                onClick={() => handleSubmit(product.ProductID)}
              >
                <img
                  className="card-image"
                  src={product.ProductImage}
                  alt="Course"
                />
                <div className="card-content">
                  <h2 className="card-title">{product.ProductName}</h2>
                  <p className="card-price">{`₩${product.ProductPrice}`}</p>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Store;
