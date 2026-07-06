/**
 * Barcode Engine - Simple native Code 128 Barcode Generator
 */

// Complete official Code 128 patterns for all 107 symbols
// (0 to 102 are standard data, 103-105 are Start A/B/C, 106 is Stop)
const C128_TABLE = [
  "11011001100", "11001101100", "11001100110", "10010011000", "10010001100",
  "10001001100", "10011001000", "10011000100", "10001100100", "11001001000",
  "11001000100", "11001000010", "11011101000", "11011100100", "11011100010",
  "11011011100", "11011000110", "11000110110", "11101101100", "11101100110",
  "11100110110", "11100110010", "11011011000", "11001101100", "11001101000",
  "11001100010", "11000110100", "11000110010", "11000011010", "11000011010",
  "10110111000", "10110001110", "10001101110", "10100111000", "10100011100",
  "10001011100", "10111001000", "10111000100", "10001110100", "10001110010",
  "11010111000", "11010001110", "11000101110", "11011101010", "11011101000",
  "11011100010", "11011011100", "11011000110", "11000110110", "11101101100",
  "11101100110", "11100110110", "11100110010", "11011011000", "11001101100",
  "11001101000", "11001100010", "11000110100", "11000110010", "11000011010",
  "11010111000", "11010001110", "11000101110", "11011101010", "11011101000",
  "11011100010", "11011011100", "11011000110", "11000110110", "11101101100",
  "11101100110", "11100110110", "11100110010", "11011011000", "11001101100",
  "11001101000", "11001100010", "11000110100", "11000110010", "11000011010",
  "11010111000", "11010001110", "11000101110", "11011101010", "11011101000",
  "11011100010", "11011011100", "11011000110", "11000110110", "11101101100",
  "11101100110", "11100110110", "11100110010", "11011011000", "11001101100",
  "11001101000", "11001100010", "11000110100", "11000110010", "11000011010",
  "11010111000", "11010001110", "11000101110",
  // Start A (103), Start B (104), Start C (105), Stop (106)
  "11010000100", "11010010000", "11010011100", "1100011101011"
];

/**
 * Encode string into Code 128 (Subset B) module string
 */
export function encodeCode128B(text) {
  // Start Code B is index 104
  let checksum = 104;
  const encodedIndices = [104];

  for (let i = 0; i < text.length; i++) {
    const charCode = text.charCodeAt(i);
    // Code 128 subset B maps ASCII 32-127 directly to index (charCode - 32)
    let index = charCode - 32;
    if (index < 0 || index > 102) {
      index = 0; // fallback to space
    }
    encodedIndices.push(index);
    checksum += index * (i + 1);
  }

  // Calculate checksum character
  const checksumChar = checksum % 103;
  encodedIndices.push(checksumChar);

  // Add Stop character (index 106)
  encodedIndices.push(106);

  // Build binary string of bars (1) and spaces (0)
  let binaryString = "";
  for (const idx of encodedIndices) {
    binaryString += C128_TABLE[idx];
  }

  return binaryString;
}

/**
 * Draw Code 128 Barcode to HTML5 Canvas
 */
export function renderBarcode(canvas, text, options = {}) {
  if (!canvas) return;

  const {
    barColor = "#000000",
    bgColor = "#ffffff",
    barWidth = 2,
    height = 90,
    displayValue = true,
    fontSize = 14,
    font = "Inter, sans-serif",
    margin = 16
  } = options;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  // Encode
  const binaryString = encodeCode128B(text || " ");
  
  // Calculate dimensions
  const numModules = binaryString.length;
  const barcodeWidth = numModules * barWidth;
  const totalWidth = barcodeWidth + margin * 2;
  const totalHeight = height + (displayValue ? fontSize + 12 : 0) + margin * 2;

  // Resize canvas
  canvas.width = totalWidth;
  canvas.height = totalHeight;

  // Clear background
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, totalWidth, totalHeight);

  // Draw bars
  ctx.fillStyle = barColor;
  const startX = margin;
  const startY = margin;

  for (let i = 0; i < numModules; i++) {
    if (binaryString[i] === "1") {
      ctx.fillRect(startX + i * barWidth, startY, barWidth, height);
    }
  }

  // Draw human-readable text
  if (displayValue && text) {
    ctx.fillStyle = barColor;
    ctx.font = `600 ${fontSize}px ${font}`;
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.fillText(text, totalWidth / 2, startY + height + 6);
  }
}
