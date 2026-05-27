'use client';
import './header.css'
import { FaHandsHelping, FaSun, FaMoon, } from "react-icons/fa";
import { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGlobe } from '@fortawesome/free-solid-svg-icons';
export const Header = () => {
    const [theme, setTheme] = useState<'light' | 'dark'>('light');

    return (
        <div className="header">
            <div className='header-container'>
                <FaHandsHelping className="icon-fanh" />
                <div>
                    <FontAwesomeIcon icon={faGlobe} className='icon-figlobe' />
                </div>

                <div className='header-icon'>
                    <div className={`theme-btn ${theme === "light" ? "active-sun" : ""}`}
                        onClick={() => setTheme("light")}>
                        <FaSun className="icon-fasun" />
                    </div>
                    <div className={`theme-btn ${theme === "dark" ? "active-moon" : ""}`}
                        onClick={() => setTheme("dark")}>
                        <FaMoon className="icon-fasun" />
                    </div>
                </div>
            </div>
        </div>
    )
}
