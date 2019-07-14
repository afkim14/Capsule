import Utils from './utils';

export const FONTS = [
  {label: "Literata", style: "Literata", value: '\'Literata\', serif'},
  {label: "Muli", style: "Muli", value: '\'Muli\', serif'},
  {label: "Indie Flower", style: "IndieFlower", value: '\'Indie Flower\', serif'},
];

export const fontStyleMap = Utils.arrToStyleMapObject(FONTS, 'fontFamily');
