'use client';

import Cookies from 'js-cookie';
import { redirect, usePathname } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react';
import { decodeToken, isExpired } from 'react-jwt';
import Skeleton from 'react-loading-skeleton';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../stores';
import { setAuthentication } from '../stores/reducers/auth';

const AuthProvider = ({ children }: React.PropsWithChildren) => {
  const { isAuthenticate } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(!isAuthenticate);
  const pathname = usePathname();

  const getAuthentication = useCallback(() => {
    if (isAuthenticate) return;

    const token = Cookies.get('todoToken');
    if (!token) {
      if (!pathname.includes('/login')) {
        return redirect('/login');
      } else {
        return;
      }
    }

    const isExpire = isExpired(token);
    if (isExpire) {
      if (!pathname.includes('/login')) {
        return redirect('/login');
      } else {
        return;
      }
    }

    const decode = decodeToken(token);
    dispatch(
      setAuthentication({
        token: token,
        isAuthenticate: true,
        user: decode,
      }),
    );

    if (pathname.includes('/login')) {
      return redirect('/');
    } else {
      return;
    }
  }, [dispatch, isAuthenticate, pathname]);

  useEffect(() => {
    getAuthentication();
    setTimeout(() => setIsLoading(false), 300);
  }, [getAuthentication]);

  if (isLoading) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <div className="flex flex-col gap-2 justify-center items-center">
          <Skeleton height={100} width={100} circle />
          <p className="text-xl font-semibold">Loading....</p>
        </div>
      </div>
    );
  }

  return <div>{children}</div>;
};

export default AuthProvider;
