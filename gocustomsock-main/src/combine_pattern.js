import { applyPattern } from "./pattern";
import * as THREE from "three";
import { applylogo } from "./apply_logo";
import { drawVerticalText } from "./drawVerticalText";

export const combinePattern = (sockTexture,logo,pattern,logoPlacement,dotColors,checkBoardColors,illusionistic_colors,csts1,csts2,csts3,csts4,text,textColor,placement, fontStyle) => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  const canvasWidth = sockTexture.image.width;
  const canvasHeight = sockTexture.image.height;

  canvas.width = canvasWidth;
  canvas.height = canvasHeight;

  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  ctx.drawImage(sockTexture.image, 0, 0, canvasWidth, canvasHeight);

  if (pattern) {
    const patternCanvas = document.createElement("canvas");
    const patternCtx = patternCanvas.getContext("2d");

    patternCanvas.width = canvasWidth;
    patternCanvas.height = canvasHeight;

    patternCtx.drawImage(sockTexture.image, 0, 0, canvasWidth, canvasHeight);

    // Add debug logs
    applyPattern(
      patternCtx,
      canvasWidth,
      canvasHeight,
      pattern,
      logoPlacement,
      dotColors,
      checkBoardColors,
      illusionistic_colors,
      csts1,
      csts2,
      csts3,
      csts4
    );

    const patternImg = patternCtx.createPattern(patternCanvas, "no-repeat");
    ctx.globalCompositeOperation = "multiply";
    ctx.fillStyle = patternImg;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    ctx.globalCompositeOperation = "source-over";
    
    if(text) {
      ctx.globalCompositeOperation = 'source-atop'; // Use 'source-atop' to apply color overlay
      const updatedCtx = drawVerticalText(ctx, text, canvas, textColor , placement, fontStyle);
      updatedCtx.globalCompositeOperation = 'source-over'; // Reset to default
    }
  }
  if (logo) {
    applylogo(
      ctx,
      canvasWidth,
      canvasHeight,
      logo,
      logoPlacement,
      sockTexture.image
    );

  }

  return new THREE.CanvasTexture(canvas);
};
