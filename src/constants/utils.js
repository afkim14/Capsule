class Utils {
  static isVideo(url) {
    const VIDEO_URL = /^(http:\/\/|https:\/\/)(vimeo\.com|youtu\.be|www\.youtube\.com)\/([\w\/]+)([\?].*)?$/;
    return VIDEO_URL.test(url);
  }

  static arrToStyleMapObject(arr, style) {
    var obj = {};
    for (var i = 0; i < arr.length; ++i) {
      obj[arr[i].style] = { [style]: arr[i].value };
    }
    return obj;
  }

  static getLineHeightFromFontSize(fontSize) {
    let containerHeight = 30;
    let currFontSize = fontSize.replace("px", "");
    let lineHeight = containerHeight - parseInt(currFontSize);
    return "-5px";
  }
}

export default Utils;
