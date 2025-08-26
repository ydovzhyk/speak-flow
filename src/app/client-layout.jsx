'use client';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getLoadingAuth } from '@/redux/auth/auth-selectors';
import { getLoadingTechnical } from '@/redux/technical/technical-selectors';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LoaderSpinner from '@/components/shared/loader';
import MediaQuery from '@/utils/media-query/media-query';
import AuthProvider from '@/utils/auth-provider/auth-provider';
import SettingsHydrator from '@/utils/settings-hydrator';

const ClientLayout = ({ children }) => {
  const loadingAuth = useSelector(getLoadingAuth);
  const loadingTechnical = useSelector(getLoadingTechnical);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(loadingAuth || loadingTechnical);
  }, [loadingAuth, loadingTechnical]);

  return (
    <div className="relative min-h-screen flex flex-col justify-between">
      {loading && <LoaderSpinner />}
      <ToastContainer />
      <MediaQuery />
      <AuthProvider />
      <SettingsHydrator />
      <main className="">{children}</main>
    </div>
  );
};

export default ClientLayout;

