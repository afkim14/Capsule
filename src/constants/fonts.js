import Utils from './utils';

export const FONTS = [
  {label: "Lora", style: "Lora", value: '\'Lora\', serif'},
  {label: "Cardo", style: "Cardo", value: '\'Cardo\', serif'},
  {label: "Rasa", style: "Rasa", value: '\'Rasa\', serif'},
];

export const fontStyleMap = Utils.arrToStyleMapObject(FONTS, 'fontFamily');
