import { LazyGlowBorder } from '#components';
import emojiIcons from '@iconify-json/twemoji/icons.json'
import { getIconData, iconToSVG, iconToHTML, replaceIDs } from '@iconify/utils';

interface IconData {
  body: string;
  width?: number;
  height?: number;
  left?: number;
  top?: number;
  // 可能还有其他属性，根据实际数据结构添加
}

interface IconSet {
  prefix: string;
  icons: {
    [key: string]: IconData;
  };

  // 可能还有其他属性，如 width, height, 等
  width?: number;
  height?: number;
  // 其他可能的属性
}

const typedEmojiIcons = emojiIcons as IconSet;

type IconName = string
// type SupportedSetName = 'twemoji'
// const supportedIcons = {
//   'twemoji': emojiIcons,
// }
/**
 * 返回在 backgroundImage 中使用的url内容
 * @param iconName twemoji:downcast-face-with-sweat
 * @returns base64 url 
 */
export function getBase64IconURL(iconName:string, iconSize: number) {
  const svgHTML = getIconSVGHTML(iconName, iconSize);

  if (!svgHTML) return null;
   
  const base64SVG = `data:image/svg+xml;base64,${Buffer.from(svgHTML, 'utf8').toString('base64')}`;

  return base64SVG
}

export function getIconSVGHTML(iconName:IconName, iconSize: number) { 
  if (!iconName) return null;
  const iconNames = iconName.split(':');

  if (iconNames.length !== 2) return null;

  const iconInnerName = iconNames[1];

  const iconData = getIconData(typedEmojiIcons as any, iconInnerName);

  if (!iconData) return null;

  const renderData = iconToSVG(iconData, {
    width: iconSize,
    height: iconSize,
  });

  let iconSVG = iconToHTML(replaceIDs(renderData.body), renderData.attributes);
  // 修正 viewBox 属性，确保与 iconSize 一致
  iconSVG = iconSVG.replace(/viewbox="([^"]*)"/, `viewbox="0 0 ${iconSize} ${iconSize}"`);
  return iconSVG;
}