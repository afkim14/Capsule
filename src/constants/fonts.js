import Utils from './utils';

export const FONTS = [
  {label: "Lora", style: "Lora", value: '\'Lora\', serif'},
  {label: "Quicksand", style: "Quicksand", value: '\'Quicksand\', serif'},
  {label: "Source Code Pro", style: "Source Code Pro", value: '\'Source Code Pro\', serif'},
];

export const fontStyleMap = Utils.arrToStyleMapObject(FONTS, 'fontFamily');
