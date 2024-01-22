import React, { useState } from "react";
import "./style.scss";
import DefaultImage from "../../img/banner.png";

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
  const [firstMenuOpen, setFirstMenuOpen] = useState(false);
  const [secondMenuOpen, setSecondMenuOpen] = useState(false);
  const [thirdMenuOpen, setThirdMenuOpen] = useState(false);

  const toggleFirstMenu = () => setFirstMenuOpen(!firstMenuOpen);
  const toggleSecondMenu = () => setSecondMenuOpen(!secondMenuOpen);
  const toggleThirdMenu = () => setThirdMenuOpen(!thirdMenuOpen);

  const handleScrollToSection = (sectionId) => {
    const sectionElement = document.getElementById(sectionId);
    if (sectionElement) {
      sectionElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  // 강의 정보 데이터
  const lectureInfo = {
    category: ["Node js", "React"],
    title: "따라하며 배우는 노드, 리액트 시리즈 - 기본 강의",
    rating: 4.6,
    instructor: "John Ahn",
    price: "₩10,000",
    time: "강의 시간",
    imageSrc:
      "https://cdn.inflearn.com/public/courses/324951/course_cover/510c265a-6de2-456d-8e6a-351b9ce29608/nodeReactbasic.png",
  };

  // 커리큘럼 메뉴 데이터
  const curriculum = [
    {
      TOCID: 1,
      title: "Node.js 프로그래밍",
      links: [
        "Node.js 프로그래밍1",
        "Node.js 프로그래밍2",
        "Node.js 프로그래밍3",
        "Node.js 프로그래밍4",
      ],
    },
    {
      TOCID: 2,
      title: "React 프로그래밍",
      links: [
        "React 프로그래밍1",
        "React 프로그래밍2",
        "React 프로그래밍3",
        "React 프로그래밍4",
      ],
    },
    {
      TOCID: 3,
      title: "강의 마무리",
      links: ["마무리", "마무리2", "마무리3", "마무리4"],
    },
  ];

  const instructor = [
    {
      name: "John Ahn",
      email: "john12@gmail.com",
      description:
        "안녕하세요. 즐겁게 개발하고 있는 개발자입니다.앞으로 많은 도움을 드릴 수 있었으면 좋겠습니다.",
    },
  ];

  // 수강평 데이터
  const comments = [
    {
      CommentID: 1,
      UserID: 101,
      LectureID: 1,
      nickname: "tar9et",
      imageSrc: { DefaultImage },
      Content:
        "초보자가 처음 듣기엔 어려울 것 같지만 챗봇을 만들어볼 수 있다는 점에서 매우 재밌어요! 그리고 영어로 설명해주시는데 어렵지 않게 설명해서 자막 켜지 않고도 이해할 수 있어서 좋아요. 영어공부 & 프로그래밍까지 1석2조",
      WriteDate: "2024-01-01",
      UpdateDate: "2024-01-02",
      Rating: 4.5,
    },
    {
      CommentID: 2,
      UserID: 102,
      nickname: "tar9et",
      LectureID: 1,
      imageSrc: { DefaultImage },
      Content:
        "매우 도움이 되었습니다. 리액트와 노드 강의를 들으면서 많은 것을 배울 수 있었습니다.",
      WriteDate: "2024-01-02",
      UpdateDate: "2024-01-03",
      Rating: 4.8,
    },
    // 추가적인 수강평 데이터도 필요에 따라 추가할 수 있습니다.
  ];

  return (
    <div className="lecture">
      <div className="lecture-container">
        <div className="lecture-imformation">
          <img
            className="lecture-image"
            src={lectureInfo.imageSrc}
            alt="lecture"
          />
          <div className="lecture-imformation-details">
            <div className="lecture-category">
              {lectureInfo.category.join(", ")}
            </div>
            <div className="lecture-title">{lectureInfo.title}</div>
            <div className="lecture-rating-details">
              <div className="lecture-rating">
                <StarRatings rating={lectureInfo.rating} />
              </div>
              <div className="lecture-rating-count">
                ({lectureInfo.rating}점)
              </div>
            </div>
            <div className="lecture-instructor">{lectureInfo.instructor}</div>
            <div className="lecture-price">{lectureInfo.price}</div>
            <div className="lecture-time">{lectureInfo.time}</div>
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
            안녕하세요 ^ ^ <br />이 강의에서는 리액트와 노드로 실질적인
            어플리케이션을 만들기 위해 <br />
            필요한 기본 개념들을 다루고 있습니다.
          </div>
        </div>
        <hr className="lecture-hr" />
        <div className="lecture-details-instructor" id="instructor">
          <h3 className="lecture-details-title">강사소개</h3>
          <div className="lecture-details-instructor-content">
            <div>{instructor[0].name}</div>
            <div>{instructor[0].email}</div>
            <div>{instructor[0].description}</div>
          </div>
        </div>
        <hr className="lecture-hr" />

        <div className="curriculum-container">
          <h1 className="title" id="curriculum">
            커리큘럼
          </h1>
          <ul>
            {curriculum.map((menu) => (
              <li key={menu.TOCID} className="dropdown">
                <input
                  type="checkbox"
                  checked={
                    menu.TOCID === 1
                      ? firstMenuOpen
                      : menu.TOCID === 2
                      ? secondMenuOpen
                      : thirdMenuOpen
                  }
                  onChange={() => {
                    if (menu.TOCID === 1) toggleFirstMenu();
                    else if (menu.TOCID === 2) toggleSecondMenu();
                    else toggleThirdMenu();
                  }}
                />
                <a
                  href="#"
                  data-toggle="dropdown"
                  onClick={() => {
                    if (menu.TOCID === 1) toggleFirstMenu();
                    else if (menu.TOCID === 2) toggleSecondMenu();
                    else toggleThirdMenu();
                  }}
                >
                  {menu.title}
                </a>
                {menu.TOCID === 1 && firstMenuOpen && (
                  <ul className="dropdown-menu">
                    {menu.links.map((link, index) => (
                      <li key={index}>
                        <a href="#">{link}</a>
                      </li>
                    ))}
                  </ul>
                )}
                {menu.TOCID === 2 && secondMenuOpen && (
                  <ul className="dropdown-menu">
                    {menu.links.map((link, index) => (
                      <li key={index}>
                        <a href="#">{link}</a>
                      </li>
                    ))}
                  </ul>
                )}
                {menu.TOCID === 3 && thirdMenuOpen && (
                  <ul className="dropdown-menu">
                    {menu.links.map((link, index) => (
                      <li key={index}>
                        <a href="#">{link}</a>
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
            {comments.map((comment) => (
              <div key={comment.CommentID} className="comment-userInfo">
                <img
                  className="comment-userImage"
                  src={comment.imageSrc.DefaultImage}
                  alt=""
                />
                <div className="comment-userInfo-content">
                  <div className="comment-userNickname">{comment.nickname}</div>
                  <div className="comment-createDate">{comment.WriteDate}</div>
                </div>
                <div className="comment-content">{comment.Content}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Lecture;
