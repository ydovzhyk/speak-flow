import React from 'react';
import Logo from '@/components/shared/logo/logo';
import MainApp from '@/components/main-app';

export default function Home() {
  return (
    <div
      className="relative min-h-screen w-full bg-cover bg-center bg-no-repeat font-[family-name:var(--font-geist-sans)] flex items-center justify-center"
      style={{ backgroundImage: "url('/images/bg.webp')" }}
    >
      {/* Логотип у верхньому лівому куті */}
      <div className="absolute top-[50px] left-[50px]">
        <Logo width={250} variant="color" />
      </div>

      {/* Центрований MainApp */}
      <MainApp />
    </div>
  );
}
