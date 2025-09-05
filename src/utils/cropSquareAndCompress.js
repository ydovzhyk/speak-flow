// Центр-кроп у квадрат + компресія з гарантією ліміту data:URL (враховуючи base64 header + JSON overhead)

function headerLenFor(type) {
  return `data:${type};base64,`.length;
}
function estimateDataUrlBytes(blobBytes, type, overheadBytes) {
  const base64Body = 4 * Math.ceil(blobBytes / 3);
  return base64Body + headerLenFor(type) + (overheadBytes || 0);
}
function canvasToBlob(canvas, type, quality) {
  return new Promise(res => canvas.toBlob(b => res(b), type, quality));
}
function fileToImage(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = e => {
      URL.revokeObjectURL(url);
      reject(e);
    };
    img.src = url;
  });
}
function blobToDataURL(blob) {
  return new Promise((resolve, reject) => {
    const fr = new FileReader();
    fr.onload = () => resolve(fr.result);
    fr.onerror = reject;
    fr.readAsDataURL(blob);
  });
}

// biasY: -1 = ближче до верху, 0 = центр, +1 = ближче до низу
function drawSquareCrop(img, outSize, { biasY = 0, upscale = false } = {}) {
  const iw = img.naturalWidth || img.width;
  const ih = img.naturalHeight || img.height;
  const cropSize = Math.min(iw, ih);

  const maxOffsetY = ih - cropSize; // зазвичай 0, але формула уніфікована
  const baseY = (ih - cropSize) / 2;
  const offsetY = Math.max(0, Math.min(maxOffsetY, baseY + biasY * baseY));

  const sx = (iw - cropSize) / 2; // центр по X
  const sy = offsetY;

  let size = outSize;
  if (!upscale) size = Math.min(outSize, cropSize); // не роздувати маленькі аватарки

  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d', { alpha: true });
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.clearRect(0, 0, size, size);
  ctx.drawImage(img, sx, sy, cropSize, cropSize, 0, 0, size, size);
  return canvas;
}

/**
 * Центр-кроп у квадрат + компресія (quality) + гарантія ліміту data:URL
 * Якщо не влазить, пробує менші розміри (sizesFallback).
 */
export async function cropSquareAndCompressToBase64(
  file,
  {
    size = 300,
    sizesFallback = [256, 192, 128], // якщо 300px не влазить
    biasY = 0, // -1..+1
    upscale = false,
    base64MaxKB = 360, // жорсткий ліміт для всього data:URL
    overheadBytes = 256, // запас під JSON-обгортку
    initialQuality = 0.9,
    minQuality = 0.5,
    mimeTypePrimary = 'image/webp',
    mimeTypeFallback = 'image/jpeg',
  } = {}
) {
  const MAX_TOTAL = base64MaxKB * 1024;
  const img = await fileToImage(file);

  const tryOnce = async (canvas, type) => {
    let lo = minQuality,
      hi = Math.min(1, Math.max(minQuality, initialQuality));
    let best = null,
      bestTotal = Infinity;

    for (let i = 0; i < 8; i++) {
      const q = (lo + hi) / 2;
      const blob = await canvasToBlob(canvas, type, q);
      const total = estimateDataUrlBytes(blob.size, type, overheadBytes);
      if (total <= MAX_TOTAL) {
        best = blob;
        bestTotal = total;
        lo = q;
      } else {
        hi = q;
      }
    }
    if (!best) {
      const blob = await canvasToBlob(canvas, type, minQuality);
      const total = estimateDataUrlBytes(blob.size, type, overheadBytes);
      return { blob, total };
    }
    return { blob: best, total: bestTotal };
  };

  const sizes = [size, ...sizesFallback];
  for (const s of sizes) {
    const canvas = drawSquareCrop(img, s, { biasY, upscale });

    // WEBP → JPEG fallback
    let type = mimeTypePrimary;
    let probe = await tryOnce(canvas, type);
    if (probe.total > MAX_TOTAL) {
      type = mimeTypeFallback;
      probe = await tryOnce(canvas, type);
    }

    if (probe.total <= MAX_TOTAL) {
      const dataUrl = await blobToDataURL(probe.blob);
      return {
        dataUrl,
        blob: probe.blob,
        finalBytes: dataUrl.length,
        outSize: s,
        type,
      };
    }
  }

  // Якщо навіть 128px не вліз — повернемо найменший варіант із мінімальною якістю (JPEG)
  const smallest = drawSquareCrop(img, sizes[sizes.length - 1], {
    biasY,
    upscale,
  });
  const blob = await canvasToBlob(smallest, mimeTypeFallback, minQuality);
  const dataUrl = await blobToDataURL(blob);
  return {
    dataUrl,
    blob,
    finalBytes: dataUrl.length,
    outSize: sizes[sizes.length - 1],
    type: mimeTypeFallback,
  };
}

// Якщо просто стиснути до потрыбного розміру

// Використання:
// const file = data?.avatarFile?.[0];
// if (file) {
//   const { dataUrl } = await cropSquareAndCompressToBase64(file, {
//     size: 300, // цільовий квадрат
//     sizesFallback: [256, 192], // якщо 300 не влазить
//     biasY: 0, // 0 = строго центр
//     upscale: false, // не збільшувати маленькі
//     base64MaxKB: 360, // під твій серверний ліміт
//     overheadBytes: 256,
//     initialQuality: 0.9,
//     minQuality: 0.5,
//   });
//   nextAvatar = dataUrl;
// }

// ----Сама функція----
// function headerLenFor(type) {
//   // довжина "data:image/webp;base64," у байтах (ASCII → байт = символ)
//   return `data:${type};base64,`.length;
// }

// function estimateDataUrlBytes(blobBytes, type, overheadBytes) {
//   // base64 має довжину 4 * ceil(n/3) + header + JSON overhead
//   const base64Body = 4 * Math.ceil(blobBytes / 3);
//   return base64Body + headerLenFor(type) + (overheadBytes || 0);
// }

// function canvasToBlob(canvas, type, quality) {
//   return new Promise(resolve => {
//     canvas.toBlob(b => resolve(b), type, quality);
//   });
// }

// function fileToImage(file) {
//   return new Promise((resolve, reject) => {
//     const url = URL.createObjectURL(file);
//     const img = new Image();
//     img.onload = () => {
//       URL.revokeObjectURL(url);
//       resolve(img);
//     };
//     img.onerror = err => {
//       URL.revokeObjectURL(url);
//       reject(err);
//     };
//     img.src = url;
//   });
// }

// function drawScaled(img, maxW, maxH) {
//   const iw = img.naturalWidth || img.width;
//   const ih = img.naturalHeight || img.height;
//   const scale = Math.min(1, maxW / iw || 1, maxH / ih || 1);
//   const w = Math.max(1, Math.round(iw * scale));
//   const h = Math.max(1, Math.round(ih * scale));
//   const canvas = document.createElement('canvas');
//   canvas.width = w;
//   canvas.height = h;
//   const ctx = canvas.getContext('2d', { alpha: true });
//   ctx.imageSmoothingEnabled = true;
//   ctx.imageSmoothingQuality = 'high';
//   ctx.clearRect(0, 0, w, h);
//   ctx.drawImage(img, 0, 0, w, h);
//   return { canvas, w, h };
// }

// function blobToDataURL(blob) {
//   return new Promise((resolve, reject) => {
//     const fr = new FileReader();
//     fr.onload = () => resolve(fr.result);
//     fr.onerror = reject;
//     fr.readAsDataURL(blob);
//   });
// }

// /**
//  * @param {File} file
//  * @param {Object} opts
//  * @param {number} [opts.base64MaxKB=360]          // ЖОРСТКИЙ ліміт для всього data:URL у КБ
//  * @param {number} [opts.maxWidth=192]
//  * @param {number} [opts.maxHeight=192]
//  * @param {number} [opts.initialQuality=0.9]
//  * @param {number} [opts.minQuality=0.5]
//  * @param {number} [opts.overheadBytes=256]        // запас під JSON-обгортку та інші поля
//  * @param {string} [opts.mimeTypePrimary='image/webp']
//  * @param {string} [opts.mimeTypeFallback='image/jpeg']
//  * @returns {Promise<{ dataUrl: string, blob: Blob, finalBytes: number }>}
//  */
// export async function compressToBase64(file, opts = {}) {
//   const {
//     base64MaxKB = 360, // ↓ знизив за замовчуванням, щоб точно влізти у ~500KB серверного ліміту
//     maxWidth = 192,
//     maxHeight = 192,
//     initialQuality = 0.9,
//     minQuality = 0.5,
//     overheadBytes = 256,
//     mimeTypePrimary = 'image/webp',
//     mimeTypeFallback = 'image/jpeg',
//   } = opts;

//   const MAX_TOTAL = base64MaxKB * 1024;

//   // 0) Якщо оригінал у форматі file.type і так влізає як dataURL — можна віддати без ресемплу
//   //    (Дуже безпечна перевірка з урахуванням хедера та JSON overhead)
//   if (file && file.type) {
//     const est = estimateDataUrlBytes(file.size, file.type, overheadBytes);
//     if (est <= MAX_TOTAL) {
//       const dataUrl = await blobToDataURL(file);
//       return { dataUrl, blob: file, finalBytes: dataUrl.length }; // length ~ bytes для ASCII
//     }
//   }

//   // 1) Завантаження зображення та початкове масштабування
//   const img = await fileToImage(file);
//   let { canvas, w, h } = drawScaled(img, maxWidth, maxHeight);

//   async function tryFormat(type) {
//     let lo = minQuality;
//     let hi = Math.min(1, Math.max(minQuality, initialQuality));
//     let bestBlob = null;

//     // Бінарний пошук якості з перевіркою САМЕ total dataURL bytes
//     for (let i = 0; i < 8; i++) {
//       const q = (lo + hi) / 2;
//       const blob = await canvasToBlob(canvas, type, q);
//       const total = estimateDataUrlBytes(blob.size, type, overheadBytes);
//       if (total <= MAX_TOTAL) {
//         bestBlob = blob;
//         lo = q; // ще вище якість спробуємо
//       } else {
//         hi = q;
//       }
//     }

//     // Якщо навіть на minQuality не влізло — візьмемо minQuality як «найкраще з гіршого»
//     if (!bestBlob) {
//       const blob = await canvasToBlob(canvas, type, minQuality);
//       const total = estimateDataUrlBytes(blob.size, type, overheadBytes);
//       return { blob, total };
//     }

//     const total = estimateDataUrlBytes(bestBlob.size, type, overheadBytes);
//     return { blob: bestBlob, total };
//   }

//   // 2) WEBP, потім JPEG fallback (для фото інколи краще)
//   let chosenType = mimeTypePrimary;
//   let probe = await tryFormat(chosenType);

//   if (probe.total > MAX_TOTAL) {
//     chosenType = mimeTypeFallback;
//     probe = await tryFormat(chosenType);
//   }

//   // 3) Якщо ще завелике — зменшуємо габарити та повторюємо
//   while (probe.total > MAX_TOTAL && w > 96 && h > 96) {
//     w = Math.max(96, Math.round(w * 0.85));
//     h = Math.max(96, Math.round(h * 0.85));
//     ({ canvas } = drawScaled(img, w, h));
//     chosenType = mimeTypePrimary;
//     probe = await tryFormat(chosenType);
//     if (probe.total > MAX_TOTAL) {
//       chosenType = mimeTypeFallback;
//       probe = await tryFormat(chosenType);
//     }
//   }

//   // 4) Фінальний dataURL
//   const dataUrl = await blobToDataURL(probe.blob);
//   return { dataUrl, blob: probe.blob, finalBytes: dataUrl.length };
// }
