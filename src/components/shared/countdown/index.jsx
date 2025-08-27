'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

const icons = [
  { src: '/images/countdown/three.svg', alt: '3' },
  { src: '/images/countdown/two.svg', alt: '2' },
  { src: '/images/countdown/one.svg', alt: '1' },
  { src: '/images/countdown/rec.svg', alt: 'Rec' },
];

export default function Countdown({ onFinish }) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (step < icons.length) {
      const id = setTimeout(() => {
        setStep(prev => prev + 1);
      }, 2000);
      return () => clearTimeout(id);
    } else {
      if (onFinish) onFinish();
    }
  }, [step]);

  return (
    <div className="flex justify-center items-center h-40">
      <AnimatePresence mode="wait">
        {step < icons.length && (
          <motion.div
            key={step}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="flex justify-center items-center"
          >
            <Image
              src={icons[step].src}
              alt={icons[step].alt}
              width={120}
              height={120}
              priority
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
