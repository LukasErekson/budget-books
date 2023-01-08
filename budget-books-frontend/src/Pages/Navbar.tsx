import React from 'react';
import { GiWhiteBook } from 'react-icons/gi';

function Navbar(): JSX.Element {
  return (
    <nav>
      <ul className='nav-list'>
        <li className='nav-list-item'>
          <a href='/'>
            <GiWhiteBook style={{ width: '1.5rem', height: '1.5rem' }} /> Budget
            Books
          </a>
        </li>
        <li className='nav-list-item'>
          <a href='/'>Categorize Transactions</a>
        </li>
        <li className='nav-list-item'>
          <a href='/'>Balance Sheet</a>
        </li>
        <li className='nav-list-item'>
          <a href='/'>Expense Report</a>
        </li>
        <li className='nav-list-item'>
          <a href='/'>Account Settings</a>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
