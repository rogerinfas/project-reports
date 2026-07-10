const fs = require('fs');
const path = require('path');

const sectionsDir = path.join(__dirname, 'sections');
const assetsDir = path.join(__dirname, 'assets');

// Get all tex files
const texFiles = fs.readdirSync(sectionsDir).filter(f => f.endsWith('.tex'));

// Read all content
let allTexContent = '';
for (const file of texFiles) {
    allTexContent += fs.readFileSync(path.join(sectionsDir, file), 'utf-8');
}

// Get all images
const images = fs.readdirSync(assetsDir).filter(f => f.endsWith('.png') || f.endsWith('.jpg'));

let deletedCount = 0;
for (const img of images) {
    if (!allTexContent.includes(img)) {
        console.log(`Borrando imagen no usada: ${img}`);
        fs.unlinkSync(path.join(assetsDir, img));
        deletedCount++;
    }
}

console.log(`Se eliminaron ${deletedCount} imágenes no utilizadas.`);
