import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./style.scss";
import ProfileUpdate from "./profileUpdate/ProfileUpdate";
import axios from "axios";
import { baseUrl } from "../../../config/baseUrl";
import jsCookie from "js-cookie";

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileInfo, setProfileInfo] = useState({
    UserName: "",
    phoneNumber: "",
    Introduction: "",
    ProfileImage: "", // 프로필 이미지 URL
    UserNickname: "",
    UserEmail: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = jsCookie.get("userToken");
  
        const response = await axios.get(`${baseUrl}/api/userInfo/mypage`, {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        // console.log("response.data:  " + response.data[0].UserEmail);
        setProfileInfo(response.data[0]);
      } catch (error) {
        console.error("프로필 정보를 불러오는 중 오류 발생:", error);
      }
    };
  
    fetchData();
    // console.log("profileInfo.email  :"+ profileInfo.UserEmail);
  }, []);

  
  

  const handleEditClick = () => {
    setIsEditing(true);
  };

  return (
    <div className="profile-info">
      {isEditing ? (
        <ProfileUpdate
          initialName={profileInfo.UserName}
          initialPhoneNumber={profileInfo.phoneNumber}
          initialIntroduction={profileInfo.Introduction}
        />
      ) : (
        <div className="person">
          <figure className="person__photo">
            <img src={profileInfo.ProfileImage} alt="프로필 이미지" />
          </figure>
          <header className="person__header">
            <h3 className="person__name">{profileInfo.UserName}</h3>
            <div className="person__nickname">{profileInfo.UserNickname}</div>
            <div className="person__email">{profileInfo.UserEmail}</div>
          </header>
          <div className="darken"></div>
          <main className="person__main">
            <p className="person__bio">{profileInfo.Introduction}</p>
          </main>
        </div>
      )}
      <div className="button-container">
        {isEditing ? null : (
          <button type="button" className="update" onClick={handleEditClick}>
            수정
          </button>
        )}
      </div>
    </div>
  );
};

export default Profile;
