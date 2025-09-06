'use client';

import React from 'react';
import Button from './ui/Button';
import { useDispatch } from 'react-redux';
import Cookies from 'js-cookie';
import { logout } from '../stores/reducers/auth';
import { redirect } from 'next/navigation';

const Header = () => {
  const dispatch = useDispatch();

  const logoutHandler = () => {
    Cookies.remove('todoToken');
    dispatch(logout());
    redirect('/login');
  };

  return (
    <div className="card bg-base-300">
      <div className="card-body">
        <details className="dropdown dropdown-end ml-auto">
          <summary className="btn btn-ghost">
            <div className="avatar avatar-placeholder ml-auto">
              <div className="bg-neutral text-neutral-content w-6 rounded-full">
                <span className="text-lg">D</span>
              </div>
            </div>
          </summary>
          <ul className="menu dropdown-content bg-base-100 z-1 w-48 p-2 shadow-sm">
            <li>
              <Button className="btn-error btn-sm" onClick={logoutHandler}>
                Logout
              </Button>
            </li>
          </ul>
        </details>
      </div>
    </div>
  );
};

export default Header;
