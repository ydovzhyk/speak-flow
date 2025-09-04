'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getTypeOperationAuth } from '@/redux/technical/technical-selectors';
import { setTypeOperationAuth } from '@/redux/technical/technical-slice';
import Button from '../shared/button';
import Text from '@/components/shared/text/text';
import AuthInputForm from '@/components/shared/auth-input-form';
import { FaGoogle } from 'react-icons/fa';

const Auth = () => {
  const dispatch = useDispatch();
  const typeOperation = useSelector(getTypeOperationAuth);
  const [currentOrigin, setCurrentOrigin] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentOrigin(encodeURIComponent(window.location.origin));
    }
  }, []);

  const REACT_APP_API_URL =
    'https://test-task-backend-34db7d47d9c8.herokuapp.com';

  const googleText =
    typeOperation === 'login'
      ? 'Login quickly with Google'
      : 'Sign up quickly with Google';

  return (
    <div
      className="flex flex-col"
      style={
        typeOperation === 'login' ? { height: '100%' } : { minHeight: '100%' }
      }
    >
      {/* Таби (кнопки як текст) */}
      <div className="w-full h-[40px] flex flex-row justify-around gap-[2px]">
        <div
          className={`w-[calc(50%-2px)] rounded-t-md border border-[rgba(82,85,95,0.2)] flex justify-center items-center ${
            typeOperation === 'login' ? 'border-b-0' : ''
          }`}
        >
          <Button
            btnClass="btnPlain"
            text="Login"
            onClick={() => dispatch(setTypeOperationAuth('login'))}
            textColor="text-black"
          />
        </div>
        <div
          className={`w-[calc(50%-2px)] rounded-t-md border border-[rgba(82,85,95,0.2)] flex justify-center items-center  ${
            typeOperation === 'registration' ? 'border-b-0' : ''
          }`}
        >
          <Button
            btnClass="btnPlain"
            text="Registration"
            onClick={() => dispatch(setTypeOperationAuth('registration'))}
            textColor="text-black"
          />
        </div>
      </div>

      {/* Контент */}
      <div className="min-h-[calc(100%-40px)] w-full flex flex-col justify-start gap-5 pt-5 px-5 pb-5 border-x border-b border-[rgba(15,54,181,0.2)] rounded-b-md">
        <div className="w-full flex flex-col items-center gap-5">
          <div className="flex flex-col items-center gap-5">
            <Text type="tiny" as="p" fontWeight="light">
              {googleText}
            </Text>

            <a
              href={`${REACT_APP_API_URL}/google?origin=${currentOrigin}`}
              className="inline-flex justify-center items-center gap-[5px] mx-auto w-[170px] h-[40px] regular-border hover-transition hover:shadow-md hover:bg-[var(--accent1)] hover:border-[var(--accent1)] rounded-[5px] cursor-pointer group"
            >
              <span className="text-black group-hover:text-white transition-colors duration-300">
                <FaGoogle size={20} />
              </span>
              <Text
                type="tiny"
                as="span"
                fontWeight="normal"
                className="group-hover:text-white hover-transition"
              >
                Google
              </Text>
            </a>
          </div>
        </div>
        <div className="w-full">
          <AuthInputForm typeOperation={typeOperation} />
        </div>
      </div>
    </div>
  );
};

export default Auth;
