const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function generateFavicon() {
  try {
    // Read the SVG file
    const svgBuffer = fs.readFileSync(path.join(__dirname, '../public/icon.svg'));
    
    // Generate PNG first
    await sharp(svgBuffer)
      .resize(32, 32, {
        kernel: sharp.kernel.lanczos3,
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .png()
      .toFile(path.join(__dirname, '../public/icon.png'));

    // Convert PNG to ICO
    await sharp(path.join(__dirname, '../public/icon.png'))
      .toFile(path.join(__dirname, '../src/app/favicon.ico'));

    console.log('Favicon generated successfully in both PNG and ICO formats!');
  } catch (error) {
    console.error('Error generating favicon:', error);
  }
}

generateFavicon(); 