import React from "react";
import "./style.scss";
import Banner from "../../img/banner.png";
import { Link, useNavigate } from "react-router-dom";

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

const Home = () => {
  const nav = useNavigate();

  const handleSubmit = (lecturID) => {
    nav(`/lecture/${lecturID}`);
  };

  const popularCourses = [
    {
      id: 1,
      title: "[코드캠프] 부트캠프에서 만든 고농축 프론트엔드 코스",
      instructor: "코드캠프",
      price: "396,000",
      rating: 4.6,
      image:
        "https://cdn.inflearn.com/public/courses/329963/cover/26550c58-624a-41c8-86dc-fea75b6c3b22/thumbnail-frontnew.png",
    },
    {
      id: 2,
      title:
        "[코드팩토리] [초급] NestJS REST API 백엔드 완전 정복 마스터 클래스 - Part 1 NestJS Core",
      instructor: "코드팩토리",
      price: "66,000",
      rating: 5.0,
      image:
        "https://cdn.inflearn.com/public/courses/331985/cover/f0501069-2139-4112-aafa-a9b3a2932860/331985-eng.png",
    },
    {
      id: 3,
      title: "[리액트 1부] 만들고 비교하며 학습하는 리액트 (React)",
      instructor: "김정환",
      price: "55,000",
      rating: 4.8,
      image:
        "https://cdn.inflearn.com/public/courses/326905/cover/739f7b4b-1a9f-478f-a6a8-1a13bf58cae3/326905-eng.png",
    },
    {
      id: 4,
      title: "처음 만난 리덕스(Redux)",
      instructor: "Inje Lee (소플)",
      price: "74,250",
      rating: 5.0,
      image:
        "https://cdn.inflearn.com/public/courses/330981/cover/902f03c3-a5f3-4d4b-a24f-9608edc6d17c/330981-eng.png",
    },
  ];

  const newCourses = [
    {
      id: 6,
      title: "mongoDB 기초부터 실무까지(feat. Node.js)",
      instructor: "김시훈",
      price: "57,750",
      rating: 4.7,
      image:
        "https://cdn.inflearn.com/public/courses/326368/cover/7b26110e-1eab-4ab6-8d9c-82381a5afd3d/KakaoTalk_Photo_2021-05-26-22-29-45.jpeg",
    },
    {
      id: 7,
      title: "딥러닝 이론 + PyTorch 실무 완전 정복",
      instructor: "변정현",
      price: "199,750",
      rating: 4.3,
      image:
        "https://cdn.inflearn.com/public/courses/332857/cover/0a28850c-f109-492a-baac-43277dc58ebd/332857.png",
    },
    {
      id: 8,
      title:
        "따라하며 배우는 노드, 리액트 시리즈 - 쇼핑몰 사이트 만들기[전체 리뉴얼]",
      instructor: "John Ahn",
      price: "33,000",
      rating: 4.7,
      image:
        "https://cdn.inflearn.com/public/courses/325240/course_cover/d5d7e9a9-2d6f-4a81-84da-5e9cde3f39a4/nodereactecommerce-eng.png",
    },
    {
      id: 9,
      title: "따라하며 배우는 노드, 리액트 시리즈 - 기본 강의",
      instructor: "John Ahn",
      price: "0",
      rating: 4.9,
      image:
        "https://cdn.inflearn.com/public/courses/324951/course_cover/510c265a-6de2-456d-8e6a-351b9ce29608/nodeReactbasic.png",
    },
  ];

  return (
    <div className="home">
      <img className="banner-image" src={Banner} alt="banner" />
      <div className="card-container">
        <div className="list-title-container">
          <h3 className="list-title">강력 추천하는 베스트 강의 ⎝㋡⎠</h3>
          <span className="popular">Popular!!</span>
        </div>

        <div className="popular-courses">
          {popularCourses.map((course) => (
            <div
              className="card"
              key={course.id}
              onClick={() => handleSubmit(course.id)}
            >
              <img className="card-image" src={course.image} alt="Course" />
              <div className="card-content">
                <h2 className="card-title">{course.title}</h2>
                <p className="card-instructor">{course.instructor}</p>
                <p className="card-price">₩{course.price}</p>
                <StarRatings rating={course.rating} />
              </div>
            </div>
          ))}
        </div>

        <div className="new-courses">
          {newCourses.map((course) => (
            <div
              className="card"
              key={course.id}
              onClick={() => handleSubmit(course.id)}
            >
              <img className="card-image" src={course.image} alt="Course" />
              <div className="card-content">
                <h2 className="card-title">{course.title}</h2>
                <p className="card-instructor">{course.instructor}</p>
                <p className="card-price">₩{course.price}</p>
                <StarRatings rating={course.rating} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
