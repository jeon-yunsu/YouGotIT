import React, { useContext, useEffect, useRef, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./VideoPlayer.css";
import ProgressBar from "../ProgressBar";
import axios from "axios";
import { AuthContext } from "../../context/authContext.js";
import jsCookie from "js-cookie";
import { baseUrl } from "../../config/baseUrl.js";

function VideoPlayer({ src, tocId, lectureID }) {
  const videoRef = useRef(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1); // 기본 소리는 최대치로 설정
  const { currentUser } = useContext(AuthContext);

  const playVideo = () => {
    videoRef.current.play();
  };

  const pauseVideo = () => {
    videoRef.current.pause();
  };

  const fastForward = () => {
    videoRef.current.currentTime += 10;
  };

  const rewind = () => {
    videoRef.current.currentTime -= 10;
  };

  const restartVideo = () => {
    videoRef.current.currentTime = 0;
    setCurrentTime(0);
  };

  const adjustVolume = (value) => {
    // value는 0에서 1 사이의 값이어야 함
    videoRef.current.volume = value;
    setVolume(value);
  };

  useEffect(() => {
    const video = videoRef.current;
    let playIntervalId;
    setCurrentTime(0);

    const timeUpdateHandler = () => {
      setCurrentTime(video.currentTime);
    };

    const loadedMetadataHandler = () => {
      setDuration(video.duration);
    };

    const sendProgressToServer = async () => {
      const currentTime = videoRef.current.currentTime;
      // console.log(`Sending progress to server: ${currentTime}`);
      const token = jsCookie.get("userToken");
      const res = await axios.post(
        `${baseUrl}/api/lecture/tocInfoSet`,
        {
          TOCID: tocId,
          Progress: currentTime,
          LectureID: lectureID
        },
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("강의 정보", res.data);
      if (res.data.success) {
        console.log(res.data.message);
      } else {
        console.log("Error occurred while sending progress to server:",res.data.message);
      }
    };

    const handleVideoEnd = () => {
      // 비디오가 끝났을 때
      setCurrentTime(video.duration);
      console.log("영상 끝!", video.duration);

      clearInterval(playIntervalId);
      video.removeEventListener("timeupdate", timeUpdateHandler);

      if (currentTime < video.duration) {
        sendProgressToServer();
      }
    };

    const handlePlayButtonClick = () => {
      playIntervalId = setInterval(() => {
        sendProgressToServer();
      }, 20000);
      video.addEventListener("timeupdate", timeUpdateHandler);
      video.addEventListener("ended", handleVideoEnd);
    };
    video.addEventListener("play", handlePlayButtonClick);
    video.addEventListener("loadedmetadata", loadedMetadataHandler);

    return () => {
      clearInterval(playIntervalId);
      video.removeEventListener("timeupdate", timeUpdateHandler);
      video.removeEventListener("ended", handleVideoEnd);
      video.removeEventListener("play", handlePlayButtonClick);
      video.removeEventListener("loadedmetadata", loadedMetadataHandler);
    };
  }, [tocId]);

  return (
    <div className="video-container">
      <video className="video-player" ref={videoRef} src={src}></video>

      <div className="controls">
        <button className="btn btn-outline-secondary w-100" onClick={playVideo}>
          Play
        </button>

        <button
          className="btn btn-outline-secondary w-100"
          onClick={pauseVideo}
        >
          Pause
        </button>

        <button className="btn btn-outline-secondary w-100" onClick={rewind}>
          Rewind
        </button>

        <button
          className="btn btn-outline-secondary w-100"
          onClick={fastForward}
        >
          Fast Forward
        </button>

        <button
          className="btn btn-outline-secondary w-100"
          onClick={restartVideo}
        >
          ReStart
        </button>

        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={volume}
          onChange={(e) => adjustVolume(parseFloat(e.target.value))}
          style={{ padding:0 }}
        />
      </div>

      <div>
        <div
          className="progress-bar"
          style={{ display: "flex", flexDirection: "column", height:"100px"}}
        >
          <ProgressBar
            progress={Number(((currentTime / duration) * 100).toFixed(0))}
          />

          <div
            className="time-indicator"
            style={{ display: "flex", flexDirection: "row" }}
          >
            {/* <span className="current-time">{currentTime.toFixed(1)}</span>
            <span className="duration"  style={{marginLeft:'auto'}}>{duration.toFixed(1)}</span> */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default VideoPlayer;
