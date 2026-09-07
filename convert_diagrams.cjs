const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const diagramsDir = path.join(__dirname, 'diagrams');
const svgFiles = fs.readdirSync(diagramsDir).filter(file => file.endsWith('.svg'));

console.log(`Converting ${svgFiles.length} SVG diagram files to high-resolution PNG...`);

async function convertAll() {
  const promises = svgFiles.map(async (file) => {
    const svgPath = path.join(diagramsDir, file);
    const pngPath = path.join(diagramsDir, file.replace('.svg', '.png'));
    
    await sharp(svgPath, { density: 300 })
      .png()
      .toFile(pngPath);
      
    console.log(`- Converted: ${file} -> ${file.replace('.svg', '.png')}`);
  });
  await Promise.all(promises);
  console.log("✅ All SVG diagrams converted to PNG successfully!");
}

convertAll().catch(err => {
  console.error("❌ Conversion failed:", err);
});
