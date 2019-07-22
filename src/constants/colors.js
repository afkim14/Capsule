import Utils from './utils';

export const TEXT_COLORS = [
  {label: 'White', style: 'text_white', value: "#cecece"},
  {label: 'Red', style: 'text_red', value: "#f47a8f"},
  {label: 'Blue', style: 'text_blue', value: "#6acece"},
  {label: 'Yellow', style: 'text_yellow', value: "#f2d67c"},
  {label: 'Green', style: 'text_green', value: "#9ce099"},
];

export const HIGHLIGHT_COLORS = [
  {label: 'Blue', style: 'highlight_blue', value: "#315984"},
];

export const BACKGROUND_COLORS = [
  {label: 'Grey', value: "#3e3e3e"},
  {label: 'Red', value: "#352d2d"},
  {label: 'Purple', value: "#38313d"},
  {label: 'Blue', value: "#2e3738"}
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
