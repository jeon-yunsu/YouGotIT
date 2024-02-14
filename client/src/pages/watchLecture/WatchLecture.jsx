import "bootstrap/dist/css/bootstrap.min.css";
import "./style.scss";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { baseUrl } from "../../config/baseUrl.js";
import jsCookie from "js-cookie";
import VideoPlayer from "../../components/VideoPlayer/VideoPlayer.jsx";

const WatchLecture = () => {
  const [tocData, setTocData] = useState([]);
  const { lectureID, TOCID } = useParams();
  const [selectedMenuTitle, setSelectedMenuTitle] = useState("");
  const [currentTOCID, setCurrentTOCID] = useState("");
  const [course, setCourse] = useState({
    progress: tocData.length > 0 ? tocData[0].AttendanceRate : 0,
  });
  // console.log(typeof TOCID); // 이 코드는 TOCID의 타입을 콘솔에 출력합니다.
  // console.log("id확인", lectureID, TOCID);
  // console.log("currentTOCID?", currentTOCID);
  // console.log("tocdata", tocData);

  useEffect(() => {
    setCurrentTOCID(TOCID);
    const fetchData = async () => {
      try {
        const token = jsCookie.get("userToken");
        const response = await axios.get(
          `${baseUrl}/api/lecture/${lectureID}/watch`,
          {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setTocData(response.data);
        if (response.data.length > 0) {
          setCourse({
            progress: response.data[0].AttendanceRate || 0,
          });
        }
      } catch (error) {
        console.error("강의 정보를 불러오는 중 오류 발생:", error);
      }
    };

    fetchData();
  }, [TOCID]);

  // console.log("tocData", tocData);
  // console.log(course)

  const calculateProgressBarStyle = (progress) => {
    return {
      width: `${progress}%`,
    };
  };

  const handleMenuItemClick = (TOCID) => {
    setCurrentTOCID(TOCID);
    // console.log("currentTOCID: ", currentTOCID);
  };

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
                {course.progress !== 0 && (
                  <div
                    className="my-course-progress"
                    style={calculateProgressBarStyle(course.progress)}
                  >
                    {course.progress}%
                  </div>
                )}
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
                tocData.find((item) => item.TOCID == currentTOCID)?.Title}
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              {tocData.length > 0 && (
                <VideoPlayer
                  src={
                    tocData.find((item) => item.TOCID == currentTOCID)
                      ?.MaterialURL || ""
                  }
                  tocId={currentTOCID}
                  lectureID={tocData[0].LectureID}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WatchLecture;
