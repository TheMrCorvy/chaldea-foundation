const fs = require('fs');
const path = require('path');

function copyAssets() {
    const srcDir = path.resolve(__dirname, '../src/assets');
    const distDir = path.resolve(__dirname, '../dist/assets');

    if (fs.existsSync(srcDir)) {
        fs.mkdirSync(distDir, { recursive: true });
        fs.cpSync(srcDir, distDir, { recursive: true });
        console.log('✅ Assets successfully copied to dist/assets');
    } else {
        console.warn(`⚠️ Source assets directory not found at ${srcDir}`);
    }
}

copyAssets();
