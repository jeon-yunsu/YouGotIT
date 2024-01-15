import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import YouGotITLogo from '../../img/YouGotITLogo2.png';
import './style.scss';

const Navbar = () => {
    const [isDropdownOpen, setDropdownOpen] = useState(false);

    const toggleDropdown = () => {
        setDropdownOpen(!isDropdownOpen);
    };

    return (
        <div className="navbar">
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
                        {isDropdownOpen ? '강의' : '강의'}
                    </button>

                    {/* 드랍다운 컨텐츠 */}
                    {isDropdownOpen && (
                        <div className="dropdown-content">
                        <Link to="/page1">Page 1</Link>
                        <Link to="/page2">Page 2</Link>
                        
                        </div>
                    )}
                </div>
                <div class="search">
                    <input type="text" placeholder="검색어 입력"/>
                </div>
                <div className="links">
                    <Link className="link" to="/signIn">
                        <h6>로그인</h6>
                    </Link>
                    <Link className="link" to="/signUp">
                        <h6>회원가입</h6>
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Navbar;
