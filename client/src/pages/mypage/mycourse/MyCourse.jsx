import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useParams, useNavigate } from "react-router-dom";
import "./style.scss";
import axios from "axios";
import { baseUrl } from "../../../config/baseUrl";
import jsCookie from "js-cookie";
import lectureDefaultImage from "../../../img/lectureDefaultImage.png";

const MyCourse = () => {
  const calculateProgressBarStyle = (attendanceRate) => {
    return {
      width: `${attendanceRate}%`,
    };
  };
  const navigate = useNavigate();
  const [mycourses, setMycourses] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = jsCookie.get("userToken");

        const response = await axios.get(`${baseUrl}/api/userInfo/cours`, {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setMycourses(response.data);
      } catch (error) {
        console.error("프로필 정보를 불러오는 중 오류 발생:", error);
      }
    };

    fetchData();
  }, []);

  console.log(mycourses, "mycourses");

  const watchLectureHandler = async (lectureID, TOCID) => {
    try {
      // 강의 TOC 정보를 가져오는 API 호출
      const tocResponse = await axios.get(`${baseUrl}/api/lecture/${lectureID}/toc`);
      const tocData = tocResponse.data;
      
      if (tocData) {
        navigate(`/watchlecture/${lectureID}/${tocData[1].TOCID}`);
      } else {
        console.error("TOC 정보를 불러오는 데 실패했습니다.");
      }
    } catch (error) {
      console.error("TOC 정보를 불러오는 중 오류 발생:", error);
    }
  };
  

  return (
    <div className="my-course">
      <div className="list-title">수강중인 강의</div>
      {mycourses.map((course, index) => (
        <div key={index} className="my-course-card">
          <img
            className="my-course-image"
            src={course.LectureImageURL || lectureDefaultImage}
            alt=""
          />
          <div className="my-course-title">{course.LectureTitle}</div>
          <div className="progress-bar-container">
            <div
              className="my-course-progress"
              style={calculateProgressBarStyle(course.AttendanceRate)}
            >
              {course.AttendanceRate}%
            </div>
          </div>
          <button
            className="btn btn-primary my-course-continue"
            onClick={(e) => watchLectureHandler(course.LectureID, course.TOCID)} // 이벤트 객체 전달
          >
            강의보기
          </button>
        </div>
      ))}
      {mycourses.forEach((course) => console.log(course.LectureID))}
    </div>
  );
};

export default MyCourse;
