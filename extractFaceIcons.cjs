const fs = require('fs');
const path = require('path');
// 获取 twemoji 图标包
// const twemojiPath = path.resolve('node_modules/@iconify-json/twemoji/icons.json');
// const __dirname = path.dirname(fileURLToPath(import.meta.url))

const twemojiData = JSON.parse(fs.readFileSync('node_modules/@iconify-json/twemoji/icons.json', 'utf8'));

// 筛选包含 face 的图标
const faceIcons = {};
for (const [key, value] of Object.entries(twemojiData.icons)) {
  if (key.includes('face')) {
    faceIcons[key] = value;
  }
}

// 创建新的图标集
const faceIconsData = {
  ...twemojiData,
  prefix: twemojiData.prefix,
  icons: faceIcons
};

// 保存到文件
const outputPath = path.resolve(__dirname, './assets/icons/twemoji-face-icons.json');
fs.writeFileSync(outputPath, JSON.stringify(faceIconsData, null, 2));

console.log(`Extracted ${Object.keys(faceIcons).length} face icons to ${outputPath}`);