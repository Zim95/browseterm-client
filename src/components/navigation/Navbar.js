import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './navbar.css'; // Import your CSS file
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faDocker} from "@fortawesome/free-brands-svg-icons";
import { faBars, faHouse, faUser, faCartShopping, faRightToBracket } from '@fortawesome/free-solid-svg-icons'

function Navbar() {
  const [isExpanded, setIsExpanded] = useState(true);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <nav className={isExpanded ? "navbar retracted" : "navbar"}>
      <div className="menu-btn" onClick={toggleExpand}>
          <span className="burger"><FontAwesomeIcon icon={faBars} className="fas"/></span>
      </div>
      <h1 className="logo-area">BrowseTerm</h1>
      <ul className="nav-list">
          <li className="nav-item">
            <Link to="/" className="nav-a">
              <FontAwesomeIcon icon={faHouse} className="fas"/><span className="nav-span">Home</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/create" className="nav-a">
              <FontAwesomeIcon icon={faUser} className="fas"/><span className="nav-span">Profile</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/list" className="nav-a">
              <FontAwesomeIcon icon={faDocker} className="fas"/><span className="nav-span">Containers</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/" className="nav-a">
              <FontAwesomeIcon icon={faCartShopping} className="fas"/><span className="nav-span">Subscribe</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/" className="nav-a">
              <FontAwesomeIcon icon={faRightToBracket} className="fas"/><span className="nav-span">SignIn</span>
            </Link>
          </li>
      </ul>
    </nav>
  );
}

export default Navbar;
