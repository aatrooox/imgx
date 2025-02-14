import { icons } from '@iconify-json/material-symbols';
import { icons as emojiIcons } from '@iconify-json/twemoji'
import { getIconData, iconToSVG, iconToHTML, replaceIDs } from '@iconify/utils';

type IconName = string
type SupportedSetName = 'twemoji' | 'material-symbols'
const supportedIcons = {
  'twemoji': emojiIcons,
  'material-symbols': icons
}
/**
 * 返回在 backgroundImage 中使用的url内容
 * @param iconName twemoji:downcast-face-with-sweat
 * @returns base64 url 
 */
export function getBase64IconURL(iconName:IconName, iconSize: number) {
  const svgHTML =  getIconSVGHTML(iconName, iconSize);

  if (!svgHTML) return null;

  const base64SVG = `data:image/svg+xml;base64,${btoa(svgHTML)}`;

  return base64SVG
}

export function getIconSVGHTML(iconName:IconName, iconSize: number) { 
  const iconNames = iconName.split(':');

  if (iconNames.length !== 2) return null;

  const setName: SupportedSetName = iconNames[0] as SupportedSetName
  const iconInnerName = iconNames[1];
  const iconSets = supportedIcons[setName]

  if (!iconSets) return null;

  const iconData = getIconData(iconSets, iconInnerName);

  if (!iconData) return null;

  const renderData = iconToSVG(iconData, {
    width: iconSize,
    height: iconSize,
  });

  const iconSVG = iconToHTML(replaceIDs(renderData.body), renderData.attributes);

  return iconSVG;
}