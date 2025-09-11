'use client';

import { useSelector } from 'react-redux';
import Logo from '@/components/shared/logo/logo';
import MainApp from '@/components/main-app';
import { SocketProvider } from '@/utils/socket-provider/socket-provider';
import { getScreenType } from '@/redux/technical/technical-selectors';

export default function Home() {
  const screenType = useSelector(getScreenType);

  return (
    <div
      className="relative min-h-screen w-full bg-cover bg-center bg-no-repeat font-[family-name:var(--font-geist-sans)] flex items-center justify-center"
      style={{ backgroundImage: "url('/images/bg.webp')" }}
    >
      {screenType === 'isDesktop' && (
        <div className="absolute top-[20px] left-[50px]">
          <Logo width={250} variant="color" />
        </div>
      )}

      <SocketProvider>
        <MainApp />
      </SocketProvider>
    </div>
  );
}
