import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './navbar.css'; // Import your CSS file
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faChevronLeft, faHome, faEdit, faList } from '@fortawesome/free-solid-svg-icons';

function Navbar() {
  const [isExpanded, setIsExpanded] = useState(true);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <nav className={`navbar ${isExpanded ? 'expanded' : 'retracted'}`}>
      <button className="toggle-button" onClick={toggleExpand}>
        {isExpanded ? (
          <FontAwesomeIcon icon={faChevronLeft} />
        ) : (
          <FontAwesomeIcon icon={faBars} />
        )}
      </button>
      <ul className="nav-list">
        <li className="nav-item">
          <Link to="/">
            <FontAwesomeIcon icon={faHome} />
            {isExpanded && <span> Home</span>}
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/create">
            <FontAwesomeIcon icon={faEdit} /> 
            {isExpanded && <span> Create</span>}
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/list">
            <FontAwesomeIcon icon={faList} />
            {isExpanded && <span> List</span>}
          </Link>
        </li>
        {/* Add more navigation items here */}
      </ul>
    </nav>
  );
}

export default Navbar;
