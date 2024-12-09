import * as THREE from 'three';
import { applylogo } from './apply_logo';
import { drawVerticalText } from './drawVerticalText';


export const combineLogoChange = (sockTexture, logo, logoPlacement,text,textColor,placement, fontStyle) => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const canvasWidth = sockTexture.image.width;
  const canvasHeight = sockTexture.image.height;
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;

  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    
  // Draw default sock texture
  ctx.drawImage(sockTexture.image, 0, 0, canvasWidth, canvasHeight);

  // Apply logo if any
  if (logo) {
    console.log(logo);
    applylogo(ctx, canvasWidth, canvasHeight, logo, logoPlacement,sockTexture.image);

  }
  if(text) {
    ctx.globalCompositeOperation = 'source-atop'; // Use 'source-atop' to apply color overlay
    const updatedCtx = drawVerticalText(ctx, text, canvas, textColor,placement,fontStyle);
    updatedCtx.globalCompositeOperation = 'source-over'; // Reset to default
  }


  return new THREE.CanvasTexture(canvas);
};
