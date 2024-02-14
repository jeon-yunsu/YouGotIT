import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
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

const LectureList = () => {
  const [lectureListData, setLectureListData] = useState(null);
  const location = useLocation();
  const categoryID = location.state?.categoryID;
  const categoryName = location.state?.categoryName;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${baseUrl}/api/categories/lectures/${categoryID}`,
          {
            withCredentials: true,
          }
        );
        setLectureListData(response.data);
      } catch (error) {
        console.error('강의 리스트 가져오는 중 오류 발생:', error);
      }
    };

    fetchData();
  }, [categoryID]);
  console.log("lectureListData:", lectureListData)

  return (
    <div className="search">
      <img className="banner-image" src={Banner} alt="banner" />
      <h3 className="search-word">선택한 카테고리: {categoryName}</h3>
      <div className="card-container">
        {lectureListData && lectureListData.length > 0 ? (
          lectureListData.map((course) => (
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

export default LectureList;
