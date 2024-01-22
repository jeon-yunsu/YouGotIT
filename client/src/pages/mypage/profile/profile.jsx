import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css"; // Bootstrap CSS 추가
import "./style.scss";
import ProfileUpdate from "./profileUpdate/ProfileUpdate";

const Profile = ({ profileInfo }) => {

  const [isEditing, setIsEditing] = useState(false);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  return (
    <div className="profile-info">
      {isEditing ? (
        <ProfileUpdate
          initialName={profileInfo.name}
          initialPhoneNumber={profileInfo.phoneNumber}
          initialIntroduction={profileInfo.introduction}
        />
      ) : (
        <div class="person">
          <figure class="person__photo">
            <img src={profileInfo.imageSrc} />
          </figure>
          <header class="person__header">
            <h3 class="person__name">{profileInfo.name}</h3>
            <div class="person__nickname">{profileInfo.nickname}</div>
            <div class="person__email">{profileInfo.email}</div>
          </header>
          <div class="darken"></div>
          <main class="person__main">
            <p class="person__bio">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sunt,
              accusamus maxime ipsa iusto facilis illum autem officia quidem
              enim earum, quo necessitatibus? Nobis saepe sint dicta distinctio
              quos repellat.
            </p>
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