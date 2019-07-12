import Utils from './utils';

export const TEXT_SIZES = [
  // {label: "Small", style: "smallText", value: '12px', maxPreviewLength: 40},
  {label: "Normal", style: "normalText", value: '18px', maxPreviewLength: 25},
  {label: "Large", style: "largeText", value: '30px', maxPreviewLength: 15},
];

export const textSizeStyleMap = Utils.arrToStyleMapObject(TEXT_SIZES, 'fontSize');
