import Utils from './utils';

export const TEXT_COLORS = [
  {label: 'White', style: 'text_white', value: "#cecece"},
  {label: 'Grey', style: 'text_grey', value: '#3e3e3e'},
  {label: 'Red', style: 'text_red', value: "#eb2f39"},
  {label: 'Blue', style: 'text_blue', value: "#5cadf7"},
  {label: 'Yellow', style: 'text_yellow', value: "#e0c863"},
  {label: 'Green', style: 'text_green', value: "#40bf55"},
];

export const HIGHLIGHT_COLORS = [
  {label: 'None', style: 'highlight_none', value: '#3e3e3e'},
  {label: 'White', style: 'highlight_white', value: "#cecece"},
  {label: 'Red', style: 'highlight_red', value: "#eb2f39"},
  {label: 'Blue', style: 'highlight_blue', value: "#5cadf7"},
  {label: 'Yellow', style: 'highlight_yellow', value: "#e0c863"},
  {label: 'Green', style: 'highlight_green', value: "#40bf55"},
];

export const BACKGROUND_COLORS = [
  {label: 'Grey', value: "#3e3e3e"},
  {label: 'Red', value: "#eb2f39"},
  {label: 'White', value: "#f9f9f9"},
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
