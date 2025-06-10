// src/utils/numberFormatting.js

// Remove everything except digits and at most one decimal point
export const stripNonDigits = (str) => str.replace(/[^0-9.]/g, "");

// Format a raw numeric string (no commas) into English‐style commas.
// If there's a decimal, it preserves up to two decimal places.
export const formatWithCommas = (raw) => {
  if (!raw) return "";
  const num = parseFloat(raw);
  if (isNaN(num)) return "";

  const parts = raw.split(".");
  if (parts.length > 1) {
    // Integer portion with commas
    const intPart = Math.trunc(num).toLocaleString("en-US");
    // Preserve up to two digits after the decimal
    const decPart = parts[1].slice(0, 2);
    return `${intPart}.${decPart}`;
  } else {
    return num.toLocaleString("en-US");
  }
};

// Convert a comma‐formatted string into a pure JavaScript number
export const parseNumber = (str) => {
  if (!str) return 0;
  const clean = str.replace(/,/g, "");
  const num = parseFloat(clean);
  return isNaN(num) ? 0 : num;
};
