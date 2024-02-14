import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import Banner from "../../img/banner.png";
import "./style.scss";
import { baseUrl } from "../../config/baseUrl";

const StarRatings = ({ rating }) => {
  const ratingToPercent = () => {
    const score = +rating * 20;
    return score + 1.5;
  };

  return (
    <div className="star-ratings">
      <div
        className="star-ratings-fill space-x-2 text-lg"
        style={{ width: ratingToPercent() + "%" }}
      >
        <span>★</span>
        <span>★</span>
        <span>★</span>
        <span>★</span>
        <span>★</span>
      </div>
      <div className="star-ratings-base space-x-2 text-lg">
        <span>★</span>
        <span>★</span>
        <span>★</span>
        <span>★</span>
        <span>★</span>
      </div>
    </div>
  );
};

const Search = () => {
  const location = useLocation();
  const searchWord = location.state?.searchWord;
  const [searchData, setSearchData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${baseUrl}/api/search-list/${searchWord}`,
          {
            withCredentials: true,
            params: {
              searchWord: searchWord,
            },
          }
        );
        console.log(searchWord);
        setSearchData(response.data);
        console.log('response.data123:  ', response.data);
      } catch (error) {
        console.error('검색 중 오류:', error);
      }
    };

    fetchData();
  }, [searchWord]);

  console.log("searchData:", searchData);

  return (
    <div className="search">
      <img className="banner-image" src={Banner} alt="banner" />
      <h3 className="search-word">{searchWord} 검색 결과</h3>
      <div className="card-container">
        {searchData && searchData.length > 0 ? (
          searchData.map((course) => (
            <div className="card" key={course.LectureID}>
              <img
                className="card-image"
                src={course.LectureImageURL}
                alt="Course"
              />
              <div className="card-content">
                <h2 className="card-title">{course.LectureTitle}</h2>
                <p className="card-instructor">{course.InstructorName}</p>
                <p className="card-price">{`₩${course.LecturePrice}`}</p>
                <StarRatings rating={course.AverageRating} />
              </div>
            </div>
          ))
        ) : (
          <div></div>
        )}
      </div>
    </div>
  );
};

export default Search;