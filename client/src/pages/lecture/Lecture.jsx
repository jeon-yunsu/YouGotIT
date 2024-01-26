import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./style.scss";
import DefaultImage from "../../img/banner.png";
import axios from "axios";
import { baseUrl } from "../../config/baseUrl.js";
import { AuthContext } from "../../context/authContext.js";
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

const Lecture = () => {
  const [lectureData, setLectureData] = useState({});
  const [tocData, setTocData] = useState([]);
  const [categoryData, setCategoryData] = useState({});
  const [commentData, setCommentData] = useState({});
  const [menuStates, setMenuStates] = useState({});
  const { lectureID } = useParams();
  const { currentUser, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const topLevelMenus = tocData.filter((menu) => menu.ParentTOCID === null);

    // 동적으로 상태 생성
    const initialState = {};
    topLevelMenus.forEach((menu, index) => {
      initialState[`menu${index + 1}Open`] = index === 0;
    });

    setMenuStates(initialState);
  }, [tocData]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${baseUrl}/api/lecture/${lectureID}`,
          {
            withCredentials: true,
          }
        );

        setLectureData(response.data.lecture);
        setTocData(response.data.toc);
        setCategoryData(response.data.categories);
        setCommentData(response.data.comments);
      } catch (error) {
        console.error("강의 정보를 불러오는 중 오류 발생:", error);
      }
    };

    fetchData();
  }, []);

  const createToggleFunction = (menuIndex) => {
    return () => {
      setMenuStates((prevStates) => {
        const updatedStates = { ...prevStates };
        updatedStates[`menu${menuIndex + 1}Open`] =
          !prevStates[`menu${menuIndex + 1}Open`];
        return updatedStates;
      });
    };
  };

  const handleScrollToSection = (sectionId) => {
    const sectionElement = document.getElementById(sectionId);
    if (sectionElement) {
      sectionElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  

  // console.log("lectureData:", lectureData);
  // console.log("tocData:", tocData);
  // console.log("categoryData:", categoryData);
  // console.log("commentData:", commentData);

  const calculateAverageRating = () => {
    if (commentData.length === 0) {
      return 0; // 댓글이 없는 경우 0을 반환하거나 다른 기본값을 사용할 수 있습니다.
    }

    const totalRating = commentData.reduce((sum, comment) => {
      return sum + comment.Rating;
    }, 0);

    const averageRating = totalRating / commentData.length;
    return averageRating;
  };
  const watchLectureHandler = (lectureID) => {
    navigate(`/watchlecture/${lectureID}`);
  };
  

  return (
    <div className="lecture">
      <div className="lecture-container">
        <div className="lecture-information">
          {lectureData && lectureData.length > 0 && (
            <img
              className="lecture-image"
              src={lectureData[0].LectureImageURL || DefaultImage}
              alt="lecture"
            />
          )}

          <div className="lecture-information-details">
            <div className="lecture-information-details">
              <div className="lecture-category">
                {categoryData && Array.isArray(categoryData)
                  ? categoryData.map((cat) => cat.CategoryName).join("/")
                  : "카테고리 정보 없음"}
              </div>

              <div className="lecture-title">
                {lectureData.length > 0
                  ? lectureData[0].LectureTitle
                  : "강의 제목 없음"}
              </div>
            </div>

            <div className="lecture-rating-details">
              <div className="lecture-rating">
                <StarRatings
                  rating={
                    lectureData &&
                    lectureData.lecture &&
                    lectureData.lecture.Rating
                  }
                />
              </div>
              <div className="lecture-rating-count">
                {commentData.length > 0
                  ? `(${calculateAverageRating().toFixed(1)}점)`
                  : "(평점 정보 없음)"}
              </div>
            </div>
            <div className="lecture-instructor">
              {lectureData && lectureData[0] && lectureData[0].InstructorName}
            </div>
            <div className="lecture-price">
              ₩
              {lectureData &&
                lectureData[0] &&
                lectureData[0].LecturePrice.toLocaleString()}
            </div>

            <div className="lecture-time">
              {lectureData && lectureData[0] && lectureData[0].LectureTime}분
            </div>

            <div className="lecture-button">
              <button className="lecture-paid">수강하기</button>
              <button className="lecture-add-cart">장바구니 담기</button>
            </div>
          </div>
        </div>
      </div>

      <div className="lecture-card">
        <div className="lecture-card-button">
          <button
            onClick={() => handleScrollToSection("introduction")}
            className="lecture-card-introduction"
          >
            강의소개
          </button>
          <button
            onClick={() => handleScrollToSection("instructor")}
            className="lecture-card-instructor"
          >
            강사소개
          </button>
          <button
            onClick={() => handleScrollToSection("curriculum")}
            className="lecture-card-curriculum"
          >
            커리큘럼
          </button>
          <button
            onClick={() => handleScrollToSection("comment")}
            className="lecture-card-comment"
          >
            수강평
          </button>
        </div>
      </div>
      <hr className="lecture-hr" />

      <div className="lecture-details-container">
        <div className="lecture-details-introcuction" id="introduction">
          <h3 className="lecture-details-title">강의소개</h3>
          <div className="lecture-details-introcuction-content">
            {lectureData &&
              lectureData[0] &&
              lectureData[0].Description &&
              lectureData[0].Description.split(".").map((sentence, index) => (
                <div key={index}>{sentence.trim()}</div>
              ))}
          </div>
        </div>
        <hr className="lecture-hr" />
        <div className="lecture-details-instructor" id="instructor">
          <h3 className="lecture-details-title">강사소개</h3>
          <div className="lecture-details-instructor-content">
            <div>
              {lectureData && lectureData[0] && lectureData[0].InstructorName}{" "}
              강사님
            </div>
            <div>
              {lectureData && lectureData[0] && lectureData[0].InstructorEmail}
            </div>
            <div>
              {lectureData &&
                lectureData[0] &&
                lectureData[0].InstructorDescription &&
                lectureData[0].InstructorDescription.split(".").map(
                  (sentence, index) => <div key={index}>{sentence.trim()}</div>
                )}
            </div>
          </div>
        </div>
        <hr className="lecture-hr" />

        <div className="curriculum-container">
          <h1 className="title" id="curriculum">
            커리큘럼
          </h1>
          <ul>
            {Array.isArray(tocData) &&
              tocData
                .filter((menu) => menu.ParentTOCID === null)
                .map((menu, index) => (
                  <li key={menu.TOCID} className="dropdown">
                    <input
                      type="checkbox"
                      checked={menuStates[`menu${index + 1}Open`]}
                      onChange={createToggleFunction(index)}
                    />
                    <a
                      href="#"
                      data-toggle="dropdown"
                      onClick={createToggleFunction(index)}
                    >
                      {menu.Title}
                    </a>
                    {menuStates[`menu${index + 1}Open`] && (
                      <ul className="dropdown-menu">
                        {tocData
                          .filter(
                            (subMenu) => subMenu.ParentTOCID === menu.TOCID
                          )
                          .map((subMenu, subIndex) => (
                            <li key={subIndex}>
                              <a
                                href="#"
                                onClick={() => watchLectureHandler(lectureID)}
                              >
                                {subMenu.Title}
                              </a>
                            </li>
                          ))}
                      </ul>
                    )}
                  </li>
                ))}
          </ul>
        </div>

        <hr className="lecture-hr" />
        <div className="lecture-details-comment" id="comment">
          <h3 className="lecture-details-title">수강평</h3>
          <div className="lecture-details-comment-content">
            {commentData && Array.isArray(commentData)
              ? commentData.map((comment) => (
                  <div key={comment.CommentID} className="comment-userInfo">
                    <img
                      className="comment-userImage"
                      src={comment.ProfileImage || DefaultImage}
                      alt=""
                    />
                    <div className="comment-userInfo-content">
                      <div className="comment-userNickname">
                        {comment.UserNickname}
                      </div>
                      <div className="comment-createDate">
                        {comment.WriteDate && (
                          <>
                            {
                              new Date(comment.WriteDate)
                                .toISOString()
                                .split("T")[0]
                            }
                          </>
                        )}
                      </div>
                    </div>
                    <div className="comment-content">{comment.Content}</div>
                  </div>
                ))
              : "수강평이 없습니다."}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Lecture;
