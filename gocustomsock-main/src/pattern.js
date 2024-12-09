export const applyPattern = (
  ctx,
  canvasWidth,
  canvasHeight,
  pattern,
  logo,
  dotColor,
  checkBoard,
  illusionistic_color,
  csts1,
  csts2,
  csts3,
  csts4
) => {
  const patternCanvas = document.createElement("canvas");
  const patternCtx = patternCanvas.getContext("2d");
  console.log(canvasHeight, canvasWidth);
  patternCanvas.width = canvasWidth; // Pattern width
  patternCanvas.height = canvasHeight; // Pattern height
  patternCtx.globalCompositeOperation = "multiply";
  let patternImg;

  switch (pattern) {
    // -------------------------------------------------dots------------------------------------------------
    case "dots":
      const dotColors = dotColor // Red, Green, Blue dots
      const dotRadius = 20; // Increase dot size
      const spacing = 50; // Increase spacing between dots
      patternCanvas.width = 100;
      patternCanvas.height = 100;
      patternCtx.fillStyle = dotColor[3]; // Red color
      patternCtx.fillRect(0, 0, patternCanvas.width, patternCanvas.height); // Top stripe
      // patternCtx.globalCompositeOperation = 'source-over'; // Ensure pattern is applied correctly

      for (let y = dotRadius; y < 200; y += spacing) {
        for (let x = dotRadius; x < 200; x += spacing) {
          const colorIndex = (x + y) % 3; // Alternate colors based on position
          patternCtx.fillStyle = dotColors[colorIndex];
          patternCtx.beginPath();
          patternCtx.arc(x, y, dotRadius, 0, Math.PI * 2); // Dots
          patternCtx.fill();
        }
      }

      // if (y > 150 && y < 200) {
      // if (logo === 'footbed') {
      //   patternCtx.fillStyle = '#006868'; // Blue color
      //   patternCtx.fillRect(0,0, 300, 530); // Bottom stripe
      //   patternCtx.fillRect(900,0, 500, 530); // Bottom stripe

      // }
      // }

      patternImg = ctx.createPattern(patternCanvas, "repeat");
      ctx.globalCompositeOperation = "source-over"; // Ensure pattern is applied correctly
      ctx.fillStyle = patternImg;
      break;
    // -----------------------------------------------checkerboard----------------------------------------------------
    case "checkerboard":
      // Define your colors array
      patternCanvas.width = 100;
      patternCanvas.height = 100;
      const ccolors = checkBoard // Example colors: Red, Green, Blue
      const tileSize = 50; // Size of each tile
      const patternWidth = 100; // Width of the pattern
      const patternHeight = 100; // Height of the pattern

      // Loop through the pattern area
      for (let y = 0; y < patternHeight; y += tileSize) {
        for (let x = 0; x < patternWidth; x += tileSize) {
          // Determine the color to use based on the position
          const colorIndex = (x / tileSize + y / tileSize) % ccolors.length;
          patternCtx.fillStyle = ccolors[colorIndex];
          patternCtx.fillRect(x, y, tileSize, tileSize);
        }
      }
      // if (logo === 'footbed') {
      //   patternCtx.fillStyle = '#E56E46'; // Blue color
      //   patternCtx.fillRect(0,0, 300, 530); // Bottom stripe
      //   patternCtx.fillRect(900,0, 500, 530); // Bottom stripe

      // }
      patternImg = ctx.createPattern(patternCanvas, "repeat");
      ctx.globalCompositeOperation = "source-over"; // Ensure pattern is applied correctly
      ctx.fillStyle = patternImg;
      break;
    // case 'customWave': // New custom pattern based on the uploaded image
    // --------------------------------------------------illutionistic-----------------------------------------------------
    case "illusionistic": // New custom pattern based on the uploaded image
      const illusionistic_colors = illusionistic_color
      patternCanvas.width = 100;
      patternCanvas.height = 100;
      const drawWaveSegment = (ctx, startX, startY, color, width, height) => {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.quadraticCurveTo(
          startX + width / 4,
          startY - height,
          startX + width / 2,
          startY
        );
        ctx.quadraticCurveTo(
          startX + (3 * width) / 4,
          startY + height,
          startX + width,
          startY
        );
        ctx.lineTo(startX + width, startY + height);
        ctx.lineTo(startX, startY + height);
        ctx.closePath();
        ctx.fill();
      };

      const waveHeight = 50;
      const waveWidth = 100;

      for (let y = 0; y < patternCanvas.height; y += waveHeight) {
        if (y % 40 === 0) {
          drawWaveSegment(patternCtx, 0, y, illusionistic_colors[0], waveWidth, waveHeight);
        } else {
          drawWaveSegment(patternCtx, 0, y, illusionistic_colors[1], waveWidth, waveHeight);
        }

        patternCtx.strokeStyle = illusionistic_colors[2];
        patternCtx.lineWidth = 1;
        for (let x = 0; x < patternCanvas.width; x += 2) {
          patternCtx.beginPath();
          patternCtx.moveTo(x, y);
          patternCtx.lineTo(x, y + waveHeight);
          patternCtx.stroke();
        }
      }
      // if (logo === 'footbed') {
      //   patternCtx.fillStyle = black; // Blue color
      //   patternCtx.fillRect(0,0, 300, 530); // Bottom stripe
      //   patternCtx.fillRect(900,0, 500, 530); // Bottom stripe

      // }
      patternImg = ctx.createPattern(patternCanvas, "repeat");
      ctx.globalCompositeOperation = "source-over"; // Ensure pattern is applied correctly
      ctx.fillStyle = patternImg;
      break;
    // ------------------------------------------------nopattern----------------------------------------------------------
    case "custom_1":
      const cst1 = csts1;
      patternCtx.fillStyle = cst1[0]; // Red color
      patternCtx.fillRect(0, 0, patternCanvas.width, patternCanvas.height); // Top stripe
      patternCtx.globalCompositeOperation = "source-over"; // Ensure pattern is applied correctly

      // Draw red stripe at the top
      patternCtx.fillStyle = cst1[1]; // Red color
      patternCtx.fillRect(0, 930, patternCanvas.width, 25); // Top stripe

      // Draw blue stripe at the bottom
      patternCtx.fillStyle = cst1[2]; // Blue color
      patternCtx.fillRect(0, 970, patternCanvas.width, 25); // Bottom stripe

      patternCtx.fillStyle = cst1[3]; // Red color
      patternCtx.fillRect(0, 800, patternCanvas.width, 25); // Top stripe

      // Draw blue stripe at the bottom
      patternCtx.fillStyle = cst1[4]; // Blue color
      patternCtx.fillRect(0, 840, patternCanvas.width, 25); // Bottom stripe

      patternImg = ctx.createPattern(patternCanvas, "repeat-x");
      ctx.globalCompositeOperation = "source-over"; // Ensure pattern is applied correctly
      ctx.fillStyle = patternImg;
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);
      break;
    case "custom_2":
      const cst2 = csts2;
      patternCtx.fillStyle = cst2[0]; // Red color
      patternCtx.fillRect(0, 0, patternCanvas.width, 800); // Top stripe
      patternCtx.globalCompositeOperation = "source-over"; // Ensure pattern is applied correctly

      patternCtx.fillStyle = cst2[1]; // Red color
      patternCtx.fillRect(0, 800, patternCanvas.width, 400); // Top stripe
      patternCtx.globalCompositeOperation = "source-over"; // Ensure pattern is applied correctly

      // Draw red stripe at the top
      patternCtx.fillStyle = cst2[2]; // Red color
      patternCtx.fillRect(0, 810, patternCanvas.width, 30); // Top stripe

      // Draw blue stripe at the bottom
      patternCtx.fillStyle = cst2[3]; // Blue color
      patternCtx.fillRect(0, 850, patternCanvas.width, 30); // Bottom stripe

      patternCtx.fillStyle = cst2[4]; // Red color
      patternCtx.fillRect(0, 890, patternCanvas.width, 30); // Top stripe

      patternImg = ctx.createPattern(patternCanvas, "repeat-x");
      ctx.globalCompositeOperation = "source-over"; // Ensure pattern is applied correctly
      ctx.fillStyle = patternImg;
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);
      break;
    case "custom_3":
      const cst3 = csts3;
      patternCtx.fillStyle = cst3[0]; // Red color
      patternCtx.fillRect(0, 0, patternCanvas.width, patternCanvas.height); // Top stripe
      patternCtx.globalCompositeOperation = "source-over"; // Ensure pattern is applied correctly

     
      // Draw red stripe at the top
      patternCtx.fillStyle = cst3[1]; // Red color
      patternCtx.fillRect(0, 1070, patternCanvas.width, 20); // Top stripe

      // Draw blue stripe at the bottom
      patternCtx.fillStyle = cst3[2]; // Blue color
      patternCtx.fillRect(0, 1100, patternCanvas.width, 20); // Bottom stripe

      patternCtx.fillStyle = cst3[3]; // Red color
      patternCtx.fillRect(0, 1130, patternCanvas.width, 20); // Top stripe

      patternCtx.fillStyle = cst3[4]; // Red color
      patternCtx.fillRect(0, 1160, patternCanvas.width, 20); // Top stripe

      patternCtx.fillStyle = cst3[5]; // Red color
      patternCtx.fillRect(0, 0, patternCanvas.width, 10); // Top stripe

      // Draw blue stripe at the bottom
      patternCtx.fillStyle = cst3[6]; // Blue color
      patternCtx.fillRect(0, 20, patternCanvas.width, 10); // Bottom stripe

      patternCtx.fillStyle = cst3[7]; // Red color
      patternCtx.fillRect(0, 40, patternCanvas.width, 10); // Top stripe

      patternCtx.fillStyle = cst3[8]; // Red color
      patternCtx.fillRect(0, 60, patternCanvas.width, 10); // Top stripe

      patternImg = ctx.createPattern(patternCanvas, "repeat-x");
      ctx.globalCompositeOperation = "source-over"; // Ensure pattern is applied correctly
      ctx.fillStyle = patternImg;
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);
      break;
    case "custom_4":
      const cst4 = csts4;
      patternCtx.fillStyle = cst4[0]; // Red color
      patternCtx.fillRect(0, 0, patternCanvas.width, patternCanvas.height); // Top stripe
      patternCtx.globalCompositeOperation = "source-over"; // Ensure pattern is applied correctly

      patternCtx.fillStyle = cst4[1]; // Red color
      patternCtx.fillRect(0, 60, patternCanvas.width, 10); // Top stripe

      // Draw blue stripe at the bottom
      patternCtx.fillStyle = cst4[2]; // Blue color
      patternCtx.fillRect(0, 80, patternCanvas.width, 10); // Bottom stripe

      patternCtx.fillStyle = cst4[3]; // Red color
      patternCtx.fillRect(0, 100, patternCanvas.width, 10); // Top stripe

      patternCtx.fillStyle = cst4[4]; // Red color
      patternCtx.fillRect(0, 120, patternCanvas.width, 10); // Top stripe

      // Draw blue stripe at the bottom
      patternCtx.fillStyle = cst4[5]; // Blue color
      patternCtx.fillRect(0, 200, patternCanvas.width, 30); // Bottom stripe

      patternCtx.fillStyle = cst4[6]; // Red color
      patternCtx.fillRect(0, 320, patternCanvas.width, 10); // Top stripe

      // Draw blue stripe at the bottom
      patternCtx.fillStyle = cst4[7]; // Blue color
      patternCtx.fillRect(0, 340, patternCanvas.width, 10); // Bottom stripe

      patternCtx.fillStyle = cst4[8]; // Red color
      patternCtx.fillRect(0, 360, patternCanvas.width, 10); // Top stripe

      patternCtx.fillStyle = cst4[9]; // Red color
      patternCtx.fillRect(0, 380, patternCanvas.width, 10); // Top stripe

      patternCtx.fillStyle = cst4[10]; // Blue color
      patternCtx.fillRect(0, 530, patternCanvas.width, 30); // Bottom stripe

      patternCtx.fillStyle = cst4[11]; // Red color
      patternCtx.fillRect(0, 670, patternCanvas.width, 10); // Top stripe

      // Draw blue stripe at the bottom
      patternCtx.fillStyle = cst4[12]; // Blue color
      patternCtx.fillRect(0, 690, patternCanvas.width, 10); // Bottom stripe

      patternCtx.fillStyle = cst4[13]; // Red color
      patternCtx.fillRect(0, 710, patternCanvas.width, 10); // Top stripe

      patternCtx.fillStyle = cst4[14]; // Red color
      patternCtx.fillRect(0, 730, patternCanvas.width, 10); // Top stripe

      patternCtx.fillStyle = cst4[15]; // Blue color
      patternCtx.fillRect(0, 830, patternCanvas.width, 30); // Bottom stripe

      patternCtx.fillStyle = cst4[16]; // Blue color
      patternCtx.fillRect(0, 1150, patternCanvas.width, 30); // Bottom stripe

      if (logo === "footbed") {
        patternCtx.fillStyle = cst4[1]; // Blue color
        patternCtx.fillRect(0, 0, 300, 530); // Bottom stripe
        patternCtx.fillRect(900, 0, 500, 530); // Bottom stripe
      }

      patternImg = ctx.createPattern(patternCanvas, "repeat-x");
      ctx.globalCompositeOperation = "source-over"; // Ensure pattern is applied correctly
      ctx.fillStyle = patternImg;
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);
      break;
    case "none":
      // Clear the pattern canvas to have no pattern
      patternCtx.clearRect(0, 0, patternCanvas.width, patternCanvas.height);
      break;
    default:
      return; // No pattern
  }

  // const patternImg = ctx.createPattern(patternCanvas, 'repeat');
  // ctx.globalCompositeOperation = 'source-over'; // Ensure pattern is applied correctly
  // ctx.fillStyle = patternImg;
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);
};
