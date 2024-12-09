export const applylogo = (ctx, canvasWidth, canvasHeight, logo,key,sockimg) => {
    ctx.globalCompositeOperation = 'source-over'; // Use 'source-atop' to apply color overlay
    // ctx.globalAlpha = 1; // Adjust opacity (0.0 is fully transparent, 1.0 is fully opaque)
    
    switch (key) {
        case 'calf':
            const logoWidth = 300; // Adjust as needed
            const logoHeight = 200; // Adjust as needed
            const logoX = canvasWidth - logoWidth - 150; // Adjust coordinates as needed
            const logoY = canvasHeight - logoHeight - 10; // Adjust coordinates as needed
        
            // Clear previous logo area
            // ctx.clearRect(logoX, logoY, logoWidth, logoHeight);
            // ctx.clearRect(canvasWidth - logoWidth - 700, canvasHeight - logoHeight - 10, logoWidth,logoHeight )
            
            // Draw new logo
            ctx.drawImage(logo, logoX, logoY, logoWidth, logoHeight);//left calf
            ctx.drawImage(logo, canvasWidth - logoWidth - 750, canvasHeight - logoHeight - 10, logoWidth,logoHeight );//right-calf   
            // ctx.globalAlpha = 1.0;
            ctx.globalCompositeOperation = 'source-over'; // Reset to default
            
        break;
        case 'footbed':
            ctx.save();

            // Set opacity (transparency)
            ctx.globalAlpha = 0.8; // Adjust opacity (0.0 is fully transparent, 1.0 is fully opaque)
            
            // Apply blur effect if needed
            ctx.filter = 'blur(1px)'; // Adjust the blur amount as needed
        
            ctx.drawImage(logo, 1050, 275, 350,100 );
            ctx.drawImage(logo, -150, 275, 320,100 );
            
            // Restore the original state of the canvas context
            ctx.restore();
            
            // Reset the filter and opacity for future drawings
            // ctx.filter = 'none';
            // ctx.globalAlpha = 1.0;
            ctx.globalCompositeOperation = 'source-over'; // Reset to default

        break;
        case 'calf_footbed':
            const logoWidth2 = 300; // Adjust as needed
            const logoHeight2 = 200; // Adjust as needed
            const logoX2 = canvasWidth - logoWidth2 - 150; // Adjust coordinates as needed
            const logoY2 = canvasHeight - logoHeight2 - 10;
            // Draw new logo
            ctx.drawImage(logo, logoX2, logoY2, logoWidth2, logoHeight2);//left calf
            ctx.drawImage(logo, canvasWidth - logoWidth2 - 750, canvasHeight - logoHeight2 - 10, logoWidth2,logoHeight2 );//right-calf
            
            ctx.save();

            // Set opacity (transparency)
            // ctx.globalAlpha = 0.5; // Adjust opacity (0.0 is fully transparent, 1.0 is fully opaque)
            
            // Apply blur effect if needed
            ctx.filter = 'blur(2px)'; // Adjust the blur amount as needed
            
            // ctx.clearRect(1000, 275, 400,100);
            // ctx.clearRect(-50, 275, 220,100 );

            // Draw the image with transparency and rotation
            // ctx.drawImage(logo, 1000, 275, 400,100 );
            // ctx.drawImage(logo, -50, 275, 220,100 );
            ctx.drawImage(logo, 1050, 275, 350,100 );
            ctx.drawImage(logo, -150, 275, 320,100 );
            
            // Restore the original state of the canvas context
            ctx.restore();
            
            // Reset the filter and opacity for future drawings
            // ctx.filter = 'none';
            // ctx.globalAlpha = 1.0;
            ctx.globalCompositeOperation = 'source-over'; // Reset to default

        break;
        case 'repeating':
            const logoWidths = 50; // Adjust as needed
            const logoHeights = 50; // Adjust as needed
            const spacing = 400; // Space between logo instances
            const numberOfLogos = 5; // Number of logos to draw
            
            // Loop to draw the logo at multiple positions
            for (let i = 0; i < numberOfLogos; i++) {
            const logoXr = canvasWidth - logoWidths - 100 - (i * spacing); // Adjust coordinates as needed
            const logoYr = canvasHeight - logoHeights - 10;
        
            // Draw new logo at calculated position
            ctx.drawImage(logo, logoXr, logoYr, logoWidths, logoHeights);
            ctx.drawImage(logo, logoXr+200, logoYr-100, logoWidths, logoHeights);
            ctx.drawImage(logo, logoXr+400, logoYr-200, logoWidths, logoHeights);
            ctx.drawImage(logo, logoXr+200, logoYr-300, logoWidths, logoHeights);
            ctx.drawImage(logo, logoXr+400, logoYr-400, logoWidths, logoHeights);
            ctx.drawImage(logo, logoXr+200, logoYr-500, logoWidths, logoHeights);
            ctx.drawImage(logo, logoXr+400, logoYr-590, logoWidths, logoHeights);
            ctx.drawImage(logo, logoXr+200, logoYr-700, logoWidths, logoHeights);
            ctx.drawImage(logo, logoXr+400, logoYr-800, logoWidths, logoHeights);
            ctx.drawImage(logo, logoXr+200, logoYr-900, logoWidths, logoHeights);
            ctx.drawImage(logo, logoXr+400, logoYr-1000, logoWidths, logoHeights);
            ctx.drawImage(logo, logoXr+200, logoYr-1100, logoWidths, logoHeights);
            }
            // ctx.globalAlpha = 1.0;
            ctx.globalCompositeOperation = 'source-over'; // Reset to default

        break;
        // case 'no_logo':
        //     ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        //     ctx.drawImage(sockimg, 0, 0, canvasWidth, canvasHeight);
        //     // ctx.globalAlpha = 1.0;
        //     ctx.globalCompositeOperation = 'source-over'; // Reset to default

        // break

        default:
            break;
    }
  };
  