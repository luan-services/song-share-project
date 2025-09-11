function rgbToHsl(r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0; // acromático (cinza)
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return [h, s, l];
}

export function filterColorPalette(rgbPalette, { minSaturation = 0, minLightness = 0, maxLightness = 1 }) {
  if (!rgbPalette) return [];
  
  return rgbPalette.filter(color => {
    const [r, g, b] = color;
    const [h, s, l] = rgbToHsl(r, g, b);
    
    const isSaturatedEnough = s >= minSaturation;
    const isNotTooDark = l >= minLightness;
    const isNotTooLight = l <= maxLightness;
    
    return isSaturatedEnough && isNotTooDark && isNotTooLight;
  });
}