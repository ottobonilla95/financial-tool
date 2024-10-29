export const darkenHexColor = (hex: string, amount = 0.1) => {
  // Convert hex to RGB
  let r = parseInt(hex.slice(1, 3), 16);
  let g = parseInt(hex.slice(3, 5), 16);
  let b = parseInt(hex.slice(5, 7), 16);

  // Darken each color channel by the specified amount
  r = Math.max(0, r - Math.round(r * amount));
  g = Math.max(0, g - Math.round(g * amount));
  b = Math.max(0, b - Math.round(b * amount));

  // Convert RGB back to hex
  const newHex = `#${r.toString(16).padStart(2, "0")}${g
    .toString(16)
    .padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;

  return newHex;
};

export const lightenHexColor = (hex: string, amount = 0.1) => {
  // Convert hex to RGB
  let r = parseInt(hex.slice(1, 3), 16);
  let g = parseInt(hex.slice(3, 5), 16);
  let b = parseInt(hex.slice(5, 7), 16);

  // Lighten each color channel by the specified amount
  r = Math.min(255, r + Math.round((255 - r) * amount));
  g = Math.min(255, g + Math.round((255 - g) * amount));
  b = Math.min(255, b + Math.round((255 - b) * amount));

  // Convert RGB back to hex
  const newHex = `#${r.toString(16).padStart(2, "0")}${g
    .toString(16)
    .padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;

  return newHex;
};
