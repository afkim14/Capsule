import Utils from './utils';

export const FONTS = [
  {label: "Quicksand", style: "Quicksand", value: '\'Quicksand\', serif'},
  {label: "Literata", style: "Literata", value: '\'Literata\', serif'},
  {label: "Muli", style: "Muli", value: '\'Muli\', serif'},
];

export const fontStyleMap = Utils.arrToStyleMapObject(FONTS, 'fontFamily');
