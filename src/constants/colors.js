import Utils from './utils';

export const TEXT_COLORS = [
  {label: 'text_0', style: 'text_0', value: "#cecece"},
  {label: 'text_2', style: 'text_2', value: "#d1e0fd"},
  {label: 'text_7', style: 'text_7', value: "#bcdce4"},
  {label: 'text_8', style: 'text_8', value: "#75c9c0"},
  {label: 'text_9', style: 'text_9', value: "#87a0a3"},
  {label: 'text_1', style: 'text_1', value: "#9795b4"},
  {label: 'text_3', style: 'text_3', value: "#ceaaab"},
  {label: 'text_4', style: 'text_4', value: "#eedea4"},
  {label: 'text_5', style: 'text_5', value: "#b1a5b7"},
  {label: 'text_6', style: 'text_6', value: "#ebcc9d"},
];

export const HIGHLIGHT_COLORS = [
  {label: 'Blue', style: 'highlight_blue', value: "#315984"},
];

export const BACKGROUND_COLORS = [
  {label: 'Grey', value: "#3e3e3e"},
  {label: 'Red', value: "#352d2d"},
  {label: 'Purple', value: "#38313d"},
  {label: 'Blue', value: "#2e3738"},
  {label: 'Brown', value: "#634733"}
];

function textColorsToObject(arr) {
  var obj = {};
  for (var i = 0; i < arr.length; ++i) {
    obj[arr[i].style] = { color: arr[i].value };
  }
  return obj;
}

function highlightColorsToObject(arr) {
  var obj = {};
  for (var i = 0; i < arr.length; ++i) {
    obj[arr[i].style] = { backgroundColor: arr[i].value };
  }
  return obj;
}

export const textColorStyleMap = Utils.arrToStyleMapObject(TEXT_COLORS, 'color');
export const highlightColorStyleMap = Utils.arrToStyleMapObject(HIGHLIGHT_COLORS, 'backgroundColor');
