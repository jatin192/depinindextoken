import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
const Navbar = () => {
  return (
    <nav>
      <ul>
        <li><Link to="/">Mint</Link></li>
        <li><Link to="/burn">Burn</Link></li>
        <li><Link to="/stake">Stake</Link></li>
        <li><Link to="/withdraw">Withdraw</Link></li>
        
      </ul>
    </nav>
  );
};

export default Navbar;
