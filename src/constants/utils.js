class Utils {
  static isVideo(url) {
    const VIDEO_URL = /^(http:\/\/|https:\/\/)(vimeo\.com|youtu\.be|www\.youtube\.com)\/([\w\/]+)([\?].*)?$/;
    return VIDEO_URL.test(url);
  }


}

export default Utils;
