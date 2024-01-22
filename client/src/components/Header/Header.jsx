import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import YouGotITLogo from '../../img/YouGotITLogo2.png';
import './style.scss';
import SignIn from '../../pages/auth/signIn/SignIn';

const Header = () => {
    const navigate = useNavigate();
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const [isModalOpen, setModalOpen] = useState(false);


    const toggleDropdown = () => {
        setDropdownOpen(!isDropdownOpen);
    };
    
    const openModal = () => {
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
    };
    return (
        <div className="header">
            <div className="container">
                <div className='links'>
                    <Link to="/">
                        <div className="logo">
                            <img src={YouGotITLogo} alt="YouGotIT 로고" />
                        </div>
                    </Link>
                </div>

                <div className='drop-down'>
                    {/* 드랍다운 토글 버튼 */}
                    <button className="dropdown-toggle" onClick={toggleDropdown}>
                        {isDropdownOpen ? '강의목록' : '강의목록'}
                    </button>

                    {/* 드랍다운 컨텐츠 */}
                    {isDropdownOpen && (
                        <div className="dropdown-content">
                        <Link to="/page1">Page 1</Link>
                        <Link to="/page2">Page 2</Link>
                        <Link to="/page2">Page 3</Link>
                        <Link to="/page2">Page 4</Link>
                        <Link to="/page2">Page 5</Link>
                        <Link to="/page2">Page 6</Link>
                        <Link to="/page2">Page 7</Link>
                        
                        </div>
                    )}
                </div>
                <form action="" className='search'>
                    <input type="text" placeholder="검색어 입력"/>
                    <button type='submit'>
                        <img src="https://cdn-icons-png.flaticon.com/512/71/71403.png" alt="" />
                    </button>
                </form>
                
                <div className="links">
                    <button className="link" onClick={openModal}>
                        <h6>로그인</h6>
                    </button>
                    <button className="link" onClick={()=>{
                        navigate("/signUp");
                    }}>
                        <h6>회원가입</h6>
                    </button>
                </div>
            </div>
            <hr />
            {isModalOpen && <div className="modal-overlay" onClick={closeModal} />}
            {isModalOpen && <SignIn closeModal={closeModal} />}
        </div>
    );
}

export default Header;
