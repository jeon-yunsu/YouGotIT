// WatchLecture.jsx

import "bootstrap/dist/css/bootstrap.min.css"; // Bootstrap CSS를 프로젝트에 추가해주세요
import "./style.scss"; // 스타일 파일을 import
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import DefaultImage from "../../img/banner.png";
import axios from "axios";
import { baseUrl } from "../../config/baseUrl.js";
import jsCookie from "js-cookie";

const WatchLecture = () => {
  const [tocData, setTocData] = useState([]);
  const { lectureID } = useParams();
  console.log(lectureID);
  const [selectedMenuTitle, setSelectedMenuTitle] = useState("");
  const [currentTOCID, setCurrentTOCID] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = jsCookie.get("userToken");
        const response = await axios.get(
          `${baseUrl}/api/lecture/${lectureID}/watch/`,
          {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setTocData(response.data);
        setCourse({
          progress: tocData.length > 0 ? tocData[0].AttendanceRate : 0,
        });
        if (response.data.length > 0) {
          setSelectedMenuTitle(response.data[1].Title);
          setCurrentTOCID(response.data[1].TOCID);
        }
      } catch (error) {
        console.error("강의 정보를 불러오는 중 오류 발생:", error);
      }
    };

    fetchData();
  }, []);

  console.log(tocData);

  const [course, setCourse] = useState({
    progress: tocData.length > 0 ? tocData[0].AttendanceRate : 0,
  });

  const calculateProgressBarStyle = (progress) => {
    return {
      width: `${progress}%`,
    };
  };

  const handleMenuItemClick = (TOCID) => {
    setCurrentTOCID(TOCID);
    console.log("currentTOCID: ", currentTOCID);
  };

  const prevButtonClick = () => {
    setCurrentTOCID(currentTOCID-1);
  }

  const nextButtonClick = () => {
    setCurrentTOCID(currentTOCID+1);
  }

  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="watch-lecture">
      <div
        className={`container-fluid watch-lecture ${
          sidebarOpen ? "sidebar-open" : ""
        }`}
      >
        <div className="sidebar-toggle">
          {/* 사이드바 열기 전에 메뉴를 보여주는 버튼 */}
          <div className="menu-item">
            <div
              className="menu-item-container"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <img
                className="menu-item-image"
                src="https://cdn2.iconfinder.com/data/icons/audio-file-extension-line/64/AUDIO_FILE_EXTENSION_TOC-512.png"
                alt=""
              />
              <div className="menu-item-title">커리큘럼</div>
            </div>
          </div>
        </div>
        {sidebarOpen && (
          <div className="sidebar fixed-sidebar">
            <div className="curriculum-container">
              <h1 className="title" id="curriculum">
                {tocData[0].LectureTitle}
              </h1>
              <div className="progress-bar-container">
                <div
                  className="my-course-progress"
                  style={calculateProgressBarStyle(course.progress)}
                >
                  {course.progress}%
                </div>
              </div>

              <ul>
                {Array.isArray(tocData) &&
                  tocData
                    .filter((menu) => menu.ParentTOCID === null)
                    .map((menu) => (
                      <li key={menu.TOCID} className="menu-item">
                        <div className="menu-item-title">{menu.Title}</div>
                        {tocData
                          .filter(
                            (subMenu) => subMenu.ParentTOCID === menu.TOCID
                          )
                          .map((subMenu) => (
                            <ul key={subMenu.TOCID} className="submenu">
                              <li>
                                <a
                                  href="#"
                                  onClick={() =>
                                    handleMenuItemClick(subMenu.TOCID)
                                  }
                                >
                                  {subMenu.Title}
                                </a>
                              </li>
                            </ul>
                          ))}
                      </li>
                    ))}
              </ul>
            </div>
          </div>
        )}

        <div className={`content ${sidebarOpen ? "content-sidebar-open" : ""}`}>
          <div className="row toc-container">
            <div className="col-10 toc-title">
              {tocData.length > 0 &&
                tocData.find((item) => item.TOCID === currentTOCID)?.Title}
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <video
                id="my-video"
                className="video-js w-100"
                controls
                preload="auto"
                poster="https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-HD.jpg"
                data-setup=""
                loop
              >
                <source
                  src="https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-1080p.mp4"
                  type="video/mp4"
                />
              </video>
            </div>
          </div>
          <div className="row my-4">
            <div className="col-6 text-center">
              <button className="btn btn-outline-secondary w-100" onClick={prevButtonClick}>Prev</button>
            </div>
            <div className="col-6 text-center">
              <button className="btn btn-outline-secondary w-100" onClick={nextButtonClick}>Next</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WatchLecture;
