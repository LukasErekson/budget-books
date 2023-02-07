import React from 'react';
import { GiWhiteBook } from 'react-icons/gi';
import { Link } from 'react-router-dom';

function Navbar(): JSX.Element {
  return (
    <nav>
      <ul className='nav-list'>
        <li className='nav-list-item'>
          <Link to='/'>
            <GiWhiteBook style={{ width: '1.5rem', height: '1.5rem' }} /> Budget
            Books
          </Link>
        </li>
        <li className='nav-list-item'>
          <Link to='/categorize-transactions'>Categorize Transactions</Link>
        </li>
        <li className='nav-list-item'>
          <Link to='/balance-sheet'>Balance Sheet</Link>
        </li>
        <li className='nav-list-item'>
          <Link to='/expense-report'>Expense Report</Link>
        </li>
        <li className='nav-list-item'>
          <Link to='/account/settings'>Account Settings</Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
