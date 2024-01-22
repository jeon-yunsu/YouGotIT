// WatchLecture.jsx

import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css"; // Bootstrap CSS를 프로젝트에 추가해주세요
import "./style.scss"; // 스타일 파일을 import

const WatchLecture = () => {
  const [course, setCourse] = useState({
    progress: 20, // Set the initial progress value as needed
  });

  const calculateProgressBarStyle = (progress) => {
    return {
      width: `${progress}%`,
    };
  };
  

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
                따라하며 배우는 리액트 강의
              </h1>
              <div className='progress-bar-container'>
            <div className='my-course-progress' style={calculateProgressBarStyle(course.progress)}>
              {course.progress}%
            </div>
          </div>


              <ul>
                {curriculum.map((menu) => (
                  <li key={menu.TOCID} className="menu-item">
                    <div className="menu-item-title">{menu.title}</div>
                    {menu.TOCID === 1 && (
                      <ul className="submenu">
                        {menu.links.map((link, index) => (
                          <li key={index}>
                            <a href="#">{link}</a>
                          </li>
                        ))}
                      </ul>
                    )}
                    {menu.TOCID === 2 && (
                      <ul className="submenu">
                        {menu.links.map((link, index) => (
                          <li key={index}>
                            <a href="#">{link}</a>
                          </li>
                        ))}
                      </ul>
                    )}
                    {menu.TOCID === 3 && (
                      <ul className="submenu">
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
          </div>
        )}
        <div className={`content ${sidebarOpen ? "content-sidebar-open" : ""}`}>
          <div className="row toc-container">
            <div className="col-10 toc-title">Node.js 프로그래밍1</div>
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
              <button className="btn btn-outline-secondary w-100">Prev</button>
            </div>
            <div className="col-6 text-center">
              <button className="btn btn-outline-secondary w-100">Next</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WatchLecture;
