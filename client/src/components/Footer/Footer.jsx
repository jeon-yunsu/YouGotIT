import React from 'react';
import Logo from "../../img/YouGotITLogo2.png";
import './style.scss';

const Footer = () => {
    return (
        <footer>
            <hr />
            <img src={Logo} alt="" />
            <span>Made with ❤️ and <b>React.js</b>.</span>
        </footer>
    );
}

export default Footer;
