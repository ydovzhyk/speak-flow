'use client';

import { useEffect, useRef } from 'react';

const AudioBarsVisualizer = ({
  audioContext,
  sourceNode,
  height = 35, // видима висота (px) — CSS
  barWidth = 5, // ширина стовпчика (px, у канвасі)
  gap = 2, // проміжок між стовпчиками (px)
  minDecibels = -90,
  maxDecibels = -10,
  smoothing = 0.8, // 0..1 (чим більше, тим плавніше)
  fftSize = 2048, // 512..32768 (степінь двійки)
  useLowFreqSpan = true,
  lowFreqSpan = 0.35, // частина спектра, яку беремо (0.35 = 35%)
  amplification = 1.7, // вище чи нижче стовпчик
}) => {
  const canvasRef = useRef(null);
  const analyserRef = useRef(null);
  const dataArrayRef = useRef(null);
  const rafRef = useRef(null);
  const resizeObsRef = useRef(null);

  // 1) Підготовка аналайзера (під’єднання/від’єднання)
  useEffect(() => {
    if (!audioContext || !sourceNode) return;

    const analyser = audioContext.createAnalyser();
    analyser.fftSize = fftSize;
    analyser.minDecibels = minDecibels;
    analyser.maxDecibels = maxDecibels;
    analyser.smoothingTimeConstant = smoothing;

    try {
      sourceNode.connect(analyser);
    } catch {}

    analyserRef.current = analyser;
    dataArrayRef.current = new Uint8Array(analyser.frequencyBinCount);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      try {
        sourceNode.disconnect(analyser);
      } catch {}
      analyser.disconnect();
      analyserRef.current = null;
      dataArrayRef.current = null;
    };
  }, [audioContext, sourceNode, fftSize, minDecibels, maxDecibels, smoothing]);

  // 2) Малювання (перезапускається і при зміні source/audioContext)
  useEffect(() => {
    const canvas = canvasRef.current;
    const analyser = analyserRef.current;
    const data = dataArrayRef.current;
    if (!canvas || !analyser || !data) return;

    const ctx = canvas.getContext('2d');

    const resize = () => {
      const dpr = Math.max(window.devicePixelRatio || 1, 1);
      const cssWidth = canvas.clientWidth;
      const cssHeight = canvas.clientHeight;
      canvas.width = Math.floor(cssWidth * dpr);
      canvas.height = Math.floor(cssHeight * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    resizeObsRef.current = new ResizeObserver(resize);
    resizeObsRef.current.observe(canvas);

    const draw = () => {
      analyser.getByteFrequencyData(data);

      ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
      const W = canvas.clientWidth;
      const H = canvas.clientHeight;

      const totalBarWidth = barWidth + gap;
      const barCount = Math.max(1, Math.floor((W + gap) / totalBarWidth));

      // беремо тільки «низ» спектра й розтягуємо на всю ширину
      let spanBins = data.length;
      if (useLowFreqSpan) {
        spanBins = Math.max(1, Math.floor(data.length * lowFreqSpan));
      }
      const binsPerBar = Math.max(1, Math.floor(spanBins / barCount));

      const grad = ctx.createLinearGradient(0, 0, 0, H);
      grad.addColorStop(0.0, '#017683');
      grad.addColorStop(0.5, '#017683b1');
      grad.addColorStop(1.0, '#0176837e');
      ctx.fillStyle = grad;

      let x = 0;
      for (let b = 0; b < barCount; b++) {
        const start = b * binsPerBar;
        const end = Math.min(start + binsPerBar, spanBins);
        let sum = 0;
        for (let i = start; i < end; i++) sum += data[i];
        const avg = sum / (end - start || 1);

        const barH = Math.min(H, (avg / 255) * H * amplification);
        const y = H - barH;

        ctx.fillRect(x, y, barWidth, barH);
        x += totalBarWidth;
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      resizeObsRef.current?.disconnect();
    };
  }, [
    barWidth,
    gap,
    useLowFreqSpan,
    lowFreqSpan,
    amplification,
    audioContext,
    sourceNode,
  ]);

  return (
    <div style={{ width: '100%', height }}>
      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          height: '100%',
          display: 'block',
          background: '#ffffff00',
          borderRadius: 8,
        }}
      />
    </div>
  );
};

export default AudioBarsVisualizer;


