function fitTextToCanvas(ctx, text, maxWidth, fs, fontst) {
    let fontSize = fs; // Start with a large font size
    let textWidth;
  
    // Set initial font size
    ctx.font = `${fontSize}px ${fontst} `;
  
    // Measure text width
    textWidth = ctx.measureText(text).width;
  
    // Adjust font size until the text fits within the maxWidth
    while (textWidth > maxWidth && fontSize > 10) { // Avoid too small font size
      fontSize -= 1; // Decrease font size
      ctx.font = `${fontSize}px ${fontst}`;
      textWidth = ctx.measureText(text).width;
    }
  
    return fontSize;
}
  
export function drawVerticalText(ctx, text, canvas, color,placement, fontStyle) {
    switch (placement) {
      case 'bottom':
          // Define max width for text to fit within
          const maxWidthB = canvas.width * 0.4; // Example: 80% of canvas width

          // Determine the appropriate font size
          const fontSizeB = fitTextToCanvas(ctx, text, maxWidthB,50,fontStyle);

          ctx.font = `${fontSizeB}px ${fontStyle}`;

          // console.log(fontStyle);
          
        
          // Measure the adjusted text width
          const textWidthB = ctx.measureText(text).width;
          // Save the current context state
          ctx.save();

          // Translate the context to the desired position (center of the canvas)
          ctx.translate(canvas.width / 2, canvas.height / 2);

          // Rotate the context by 90 degrees (for vertical text)
          ctx.rotate(-Math.PI / 2); // Rotating counterclockwise

          // Flip the canvas horizontally to prevent mirrored text
          ctx.scale(-1, 1);

          // Set the text color
          ctx.fillStyle = color; // Set dynamic text color

          const rightHalfX = canvas.width * -0.25; // Move to right half of canvas
          const x = rightHalfX - textWidthB / 2; // Center the text within the right half

          // Draw the text

          // console.log(canvas.height,canvas.width);
          
          ctx.fillText(text, x, 620);
          ctx.fillText(text, x, -580);

          // Restore the context to its original state
          ctx.restore();

          // Return the context
          return ctx;

        case 'Front':
                  // Define max width for text to fit within
          const maxWidthF = canvas.width * 0.8; // Example: 80% of canvas width
      
          // Determine the appropriate font size
          const fontSizeF = fitTextToCanvas(ctx, text, maxWidthF,70,fontStyle);

          ctx.font = `${fontSizeF}px ${fontStyle}`;
          console.log(fontStyle);
          
        
          // Measure the adjusted text width
          const textWidthF = ctx.measureText(text).width;
          // Save the current context state
          ctx.save();
        
          // Translate the context to the desired position (center of the canvas)
          ctx.translate(canvas.width / 2, canvas.height / 2);
        
          // Rotate the context by 90 degrees (for vertical text)
          ctx.rotate(-Math.PI / 2); // Rotating counterclockwise
        
          // Flip the canvas horizontally to prevent mirrored text
          ctx.scale(-1, 1);
        
          // Set the text color
          ctx.fillStyle = color; // Set dynamic text color
        
          // Calculate the x position to center the text
          const x1 = -textWidthF / 2; // Adjusting x position to center the text horizontally
        
          // Draw the text
          ctx.fillText(text, x1, 0);
        
          // Restore the context to its original state
          ctx.restore();
          return ctx
          
          case 'Calf':
            // Define max width for text to fit within
            const maxWidthC = canvas.width * 0.4; // Example: 50% of canvas width
          
            // Determine the appropriate font size for the given max width
            const fontSizeC = fitTextToCanvas(ctx, text, maxWidthC, 50, fontStyle);
          
            // Set the calculated font size
            ctx.font = `${fontSizeC}px ${fontStyle}`;
          
            // Measure the adjusted text width after setting the font
            const textWidthC = ctx.measureText(text).width;
          
            // Save the current context state before transformation
            ctx.save();
          
            // Translate the context to the center of the canvas
            // Adjust the y-axis translation to move text downward by 50 pixels
            ctx.translate(canvas.width / 2, (canvas.height / 2) ); // Adjust the "50" as needed to move downward
          
            // Rotate the context by 90 degrees for vertical text
            ctx.rotate(-Math.PI / 2);
          
            // Flip the canvas horizontally to prevent mirrored text
            ctx.scale(-1, 1);
          
            // Set the dynamic text color
            ctx.fillStyle = color;
          
            // Define the horizontal offset (center the text horizontally)
            const xc = -(textWidthC / 2) +300;
          
            // Define vertical positions; you don't need to change these if moving the canvas downward
            const ycTop = -275;
            const ycBottom = 280;
          
            // Draw the text at both the top and bottom positions
            ctx.fillText(text, xc, ycTop); // Top text
            ctx.fillText(text, xc, ycBottom); // Bottom text
            
          
            // Restore the context to its original state
            ctx.restore();
          
            // Return the context
            return ctx;

            case 'Calf+Bottom':
              // Define max width for text to fit within
              const maxWidthBC = canvas.width * 0.4; // Example: 50% of canvas width
            
              // Determine the appropriate font size for the given max width
              const fontSizeBC = fitTextToCanvas(ctx, text, maxWidthBC, 50, fontStyle);
            
              // Set the calculated font size
              ctx.font = `${fontSizeBC}px ${fontStyle}`;
            
              // Measure the adjusted text width after setting the font
              const textWidthBC = ctx.measureText(text).width;
            
              // Save the current context state before transformation
              ctx.save();
            
              // Translate the context to the center of the canvas
              // Adjust the y-axis translation to move text downward by 50 pixels
              ctx.translate(canvas.width / 2, (canvas.height / 2) ); // Adjust the "50" as needed to move downward
            
              // Rotate the context by 90 degrees for vertical text
              ctx.rotate(-Math.PI / 2);
            
              // Flip the canvas horizontally to prevent mirrored text
              ctx.scale(-1, 1);
            
              // Set the dynamic text color
              ctx.fillStyle = color;
            
              // Define the horizontal offset (center the text horizontally)
              const xC = -(textWidthBC / 2) +300;
            
              // Define vertical positions; you don't need to change these if moving the canvas downward
              const ycTopC = -275;
              const ycBottomC = 280;
  
              const rightHalfB = canvas.width * -0.25; // Move to right half of canvas
              const xb = rightHalfB - textWidthBC / 2; // Center the text within the right half
            
              // Draw the text at both the top and bottom positions
              ctx.fillText(text, xC, ycTopC); // Top text
              ctx.fillText(text, xC, ycBottomC); // Bottom text
  
              ctx.fillText(text, xb, 620);
              ctx.fillText(text, xb, -580);
  
            
              // Restore the context to its original state
              ctx.restore();
            
              // Return the context
              return ctx;
              case 'Repeat':
                const fontSize = 20; // Font size for the text
                const spacing = 400; // Space between text instances
                const numberOfTextInstances = 5; // Number of text instances to draw
                
                // Set the font style
                ctx.font = `${fontSize}px ${fontStyle}`; // Change 'Arial' to any desired font
                ctx.fillStyle = color; // Set the text color (you can define 'color' elsewhere in your code)
                
                // Save the current context state
                ctx.save();
            
                // Move the canvas origin to the center of the canvas and rotate by 180 degrees (π radians)
                ctx.translate(canvas.width / 2, canvas.height / 2);
                ctx.rotate(Math.PI);
                ctx.scale(-1, 1); // This flips the canvas horizontally

            
                // Loop to draw the text at multiple positions (now upside down)
                for (let i = 0; i < numberOfTextInstances; i++) {
                    const textXr = (canvas.width / 2) - 100 - (i * spacing); // Adjust coordinates as needed
                    const textYr = (canvas.height / 2) - 10;
            
                    // Draw the text at calculated position (upside down)
                    ctx.fillText(text, textXr, textYr);
            
                    // Additional text placements (now upside down)
                    ctx.fillText(text, textXr + 200, textYr - 100);
                    ctx.fillText(text, textXr + 400, textYr - 200);
                    ctx.fillText(text, textXr + 200, textYr - 300);
                    ctx.fillText(text, textXr + 400, textYr - 400);
                    ctx.fillText(text, textXr + 200, textYr - 500);
                    ctx.fillText(text, textXr + 400, textYr - 590);
                    ctx.fillText(text, textXr + 200, textYr - 700);
                    ctx.fillText(text, textXr + 400, textYr - 800);
                    ctx.fillText(text, textXr + 200, textYr - 900);
                    ctx.fillText(text, textXr + 400, textYr - 1000);
                    ctx.fillText(text, textXr + 200, textYr - 1100);
                }
            
                // Restore the original context (to avoid affecting other drawing operations)
                ctx.restore();
            
                // Reset to default operation
                return ctx;
            
            
          
    }

}

// function drawRepeatingText(ctx, text, fontStyle, initialFontSize, spacing, numberOfTexts) {
//   // Set the font style and size
//   ctx.font = `${initialFontSize}px ${fontStyle}`;

//   // Measure the text width and height
//   const textMetrics = ctx.measureText(text);
//   const textWidth = textMetrics.width;
//   const textHeight = initialFontSize; // Approximate text height

//   // Calculate the starting position
//   const startX = canvas.width - textWidth - 100;
//   const startY = canvas.height - textHeight - 10;
  
//   // Draw text in a grid-like pattern
//   for (let i = 0; i < numberOfTexts; i++) {
//       for (let j = 0; j < numberOfTexts; j++) {
//           const textX = startX - (i * spacing); // Adjust X position
//           const textY = startY - (j * spacing); // Adjust Y position

//           // Draw the text at calculated position
//           ctx.fillText(text, textX, textY);
//       }
//   }
// }

