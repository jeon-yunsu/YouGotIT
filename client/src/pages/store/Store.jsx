import React, { useEffect, useState } from "react";
import "./style.scss";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { baseUrl } from "../../config/baseUrl.js";

const Store = () => {
  const nav = useNavigate();
  const [productData, setProductData] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true); // 추가 - 더 이상 데이터를 불러올 필요가 없는지 여부

  useEffect(() => {
    fetchData();
    console.log("productData11?", productData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!hasMore || loading) return; // 추가 - 더 이상 데이터를 불러올 필요가 없거나 이미 로딩 중이라면 더 이상 진행하지 않음

    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop !==
          document.documentElement.offsetHeight ||
        loading
      ) {
        return;
      }
      fetchData();
      console.log("productData22?", productData);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading, hasMore]);

  const fetchData = async () => {
    if (!hasMore || loading) return; // 더 이상 데이터를 불러올 필요가 없거나 이미 로딩 중인 경우

    setLoading(true);

    try {
      const response = await axios.get(`${baseUrl}/api/store`, {
        withCredentials: true,
        params: {
          page: page,
          perPage: 20, // 페이지당 아이템 수
        },
      });

      // 추가 - 더 이상 데이터를 불러올 필요가 없다면 스크롤 이벤트 리스너를 제거함
      if (response.data.data.length === 0) {
        setHasMore(false);
        return;
      }

      // 새로운 상태 계산
      const newData = [...productData, ...response.data.data];
      setProductData(newData);

      setPage(page + 1); // 이 부분을 수정합니다.
    } catch (error) {
      console.error("검색 중 오류:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (ProductID) => {
    nav(`/store/${ProductID}`);
  };

  return (
    <div className="store">
      <div>
        <div class="app-product-sub__title">
          <div class="app-product-sub__word">
            <div class="app-product-sub__selected-wrapper">
              <button
                class="app-product-sub__selected-filter"
                data-type="category"
                data-key="cate_lists"
                data-id="9"
              >
                전체
              </button>
            </div>
          </div>

          <div class="app-product-sub__word">
            <span class="dmf-fmf">를</span>
          </div>
          <br />
          <div class="app-product-sub__word">
            <div class="app-product-sub__selected-wrapper">
              <button
                class="app-product-sub__selected-filter app-product-sub__selected-filter--sort"
                data-type="sort"
              >
                인기순
              </button>
              <div class="app-product-sub__sort-selector">
                <select>
                  <option value="popular" selected="">
                    인기순
                  </option>
                  <option value="recent">신규 등록 순</option>
                </select>
                <div class="app-product-sub__sort-list">
                  <div
                    class="app-product-sub__sort-item app-product-sub__sort-item--selected"
                    data-value="popular"
                  >
                    <button type="button">인기순</button>
                  </div>
                  <div class="app-product-sub__sort-item" data-value="recent">
                    <button type="button">신규 등록 순</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="app-product-sub__word">으로 보여줘.</div>
        </div>
      </div>
      <div className="card-container">
        <div className="product-card">
          {productData.map((product) => (
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
                <p className="card-price">{`₩${product.ProductPrice.toLocaleString()}`}</p>
              </div>
            </div>
          ))}
          {loading && <p>Loading...</p>}
        </div>
      </div>
    </div>
  );
};

export default Store;
