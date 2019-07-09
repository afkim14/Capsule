import Utils from './utils';

export const FONTS = [
  {label: "Open Sans", style: "Opensans", value: '\'Open Sans\', serif'},
  {label: "DM Serif", style: "DMSerif", value: '\'DM Serif Display\', serif'},
  {label: "EB Garamond", style: "EBGaramond", value: '\'EB Garamond\', serif'},
];

export const fontStyleMap = Utils.arrToStyleMapObject(FONTS, 'fontFamily');
