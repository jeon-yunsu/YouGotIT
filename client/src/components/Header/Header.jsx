import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import YouGotITLogo from "../../img/YouGotITLogo2.png";
import "./style.scss";
import SignIn from "../../pages/auth/signIn/SignIn";
import Cookies from "js-cookie";
import UserIcon from "../../img/defaultProfileImage.png";
import { AuthContext } from "../../context/authContext.js";
import axios from "axios";
import { baseUrl } from "../../config/baseUrl.js";



const Header = () => {
  const { currentUser, logout } = useContext(AuthContext);

  const navigate = useNavigate();
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isProfileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [searchWord, setSearchWord] = useState(null);
  const [categoryData, setCategoryData] = useState(null);

  useEffect(() => {
    const token = Cookies.get("userToken");
    setIsLoggedIn(!!token);

    const fetchData = async () => {
        try {
          const response = await axios.get(
            `${baseUrl}/api/categories/all`,
            {
              withCredentials: true,
            }
          );
          setCategoryData(response.data);
        } catch (error) {
          console.error("강의 정보를 불러오는 중 오류 발생:", error);
        }
    }
    fetchData();
  }, [isLoggedIn]);

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  const toggleProfileDropdown = () => {
    setProfileDropdownOpen(!isProfileDropdownOpen);
  };

  const closeProfileDropdown = () => {
    setProfileDropdownOpen(false);
  };

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const handleLogout = async () => {
    try {
      await logout();
      console.log("로그아웃");
      setIsLoggedIn(false);
    } catch (error) {
      console.error("로그아웃 중 오류:", error);
    }
  };
  const onInputChange = (e) => {
    const newSearchWord = e.target.value;
    setSearchWord(newSearchWord);
  };

  const onSearchHandler = async (e) => {
    e.preventDefault();
    navigate("/search", { state: { searchWord: searchWord } });
  };

  const onCategoryHandler = async (categoryId, categoryName) => {
    navigate("/lectureList", { state: { categoryID: categoryId, categoryName: categoryName } });
  };
  
  const onLogoClick = () => {
    setSearchWord(""); 
  };

  return (
    <div className="header">
      <div className="container">
        <div className="links">
          <Link to="/" onClick={onLogoClick}>
            <div className="logo">
              <img src={YouGotITLogo} alt="YouGotIT 로고" />
            </div>
          </Link>
        </div>
        <div></div>

        <div className="drop-down">
          <button className="dropdown-toggle" onClick={toggleDropdown}>
            {isDropdownOpen ? "강의목록" : "강의목록"}
          </button>

          {isDropdownOpen && (
            <div className="dropdown-content">
            {categoryData.map((category) => (
              <div
                className="dropdown-title"
                onClick={() => onCategoryHandler(category.CategoryID, category.CategoryName)}
              >
                {category.CategoryName}
              </div>
            ))}
          </div>
          )}
        </div>
        <form className="search">
          <input
            type="text"
            placeholder="검색어 입력"
            value={searchWord || ""}
            onChange={onInputChange}
          />
          <button type="submit" onClick={onSearchHandler}>
            <img
              src="https://cdn-icons-png.flaticon.com/512/71/71403.png"
              alt=""
            />
          </button>
        </form>

        <div className="links">
          {isLoggedIn ? (
            <>
              <button
                className="profile"
                onMouseEnter={toggleProfileDropdown}
                onMouseLeave={closeProfileDropdown}
              >
                <img src={UserIcon} alt="프로필 이미지" className="usericon" />
                {isProfileDropdownOpen && (
                  <div className="profile-dropdown">
                    <div className="user-info">
                      <div className="dropdown-profile-container">
                        {currentUser && currentUser.ProfileImage !== null ? (
                          <img
                            src={currentUser.ProfileImage}
                            alt="프로필 이미지"
                            className="user-profile-image"
                          />
                        ) : (
                          <img
                            src={UserIcon}
                            alt="프로필 이미지"
                            className="user-profile-image"
                          />
                        )}
                        {currentUser && (
                          <div className="dropdown-profile-info">
                            <p className="dropdown-profile-nickname">
                              {currentUser.UserName}
                            </p>
                            <p className="dropdown-profile-email">
                              {currentUser.UserEmail}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                    <Link to="/mypage" className="dropdown-item">
                      프로필 설정
                    </Link>
                    <Link to="/mycourse" className="dropdown-item">
                      수강중인 강의
                    </Link>
                    <Link to="/cart" className="dropdown-item">
                      장바구니
                    </Link>
                    <Link to="/payment" className="dropdown-item">
                      결제내역
                    </Link>
                    <hr className="dropdown-hr" />
                    <button className="dropdown-item" onClick={handleLogout}>
                      로그아웃
                    </button>
                  </div>
                )}
              </button>
            </>
          ) : (
            <>
              <button className="link" onClick={openModal}>
                <h6>로그인</h6>
              </button>
              <button className="link" onClick={() => navigate("/signUp")}>
                <h6>회원가입</h6>
              </button>
            </>
          )}
        </div>
      </div>
      <hr />
      {isModalOpen && <div className="modal-overlay" onClick={closeModal} />}
      {isModalOpen && <SignIn closeModal={closeModal} />}
    </div>
  );
};

export default Header;
