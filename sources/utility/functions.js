import { Image } from "expo-image";
import extractNumbers from "extract-numbers";
import psl from "psl";

const extractHostname = (url) => {
  var hostname;

  if (url.indexOf("//") > -1) {
    hostname = url.split("/")[2];
  } else {
    hostname = url.split("/")[0];
  }
  hostname = hostname.split(":")[0];
  hostname = hostname.split("?")[0];
  return hostname;
};

export const getHostnameFromRegex = (url) => {
  if (!url || url == "") return;

  if (url.includes("search?=")) {
    return url.split("=")[0].split(".")[0];
  }

  return psl.get(extractHostname(url));
};

export const numberize = (value) => {
  if (value == undefined || value == null) return undefined;
  const numberExtracted = extractNumbers(value.toString())?.[0];

  if (!numberExtracted) return undefined;
  return parseInt(numberExtracted);
};

export const containsOnlyEmojis = (text) => {
  if (!text) {
    return false;
  }

  const onlyEmojis = text.replace(new RegExp("[\u0000-\u1eeff]", "g"), "");
  const visibleChars = text.replace(new RegExp("[\n\rs]+|( )+", "g"), "");

  return onlyEmojis.length === visibleChars.length;
};

export const countEmojis = (text) => {
  if (!text) {
    return 0;
  }

  const emojis = text.match(
    new RegExp(
      "[\u{1F000}-\u{1F6FF}\u{1F900}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F1E6}-\u{1F1FF}\u{1F3FB}-\u{1F3FF}\u{1F400}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F910}-\u{1F96B}\u{1F980}-\u{1F9E0}\u{1F9F0}\u{1FA70}-\u{1FA74}\u{1F004}\u{1FAB0}-\u{1FAB6}\u{1FAC0}\u{1FAD0}-\u{1FAD6}]",
      "gu"
    )
  );

  return emojis ? emojis.length : 0;
};

export const isAndroidDevice = () => Platform.OS === "android";

export const clearImageCache = () => {
  // FastImage.clearDiskCache();
  // FastImage.clearMemoryCache();
  Image.clearDiskCache();
  Image.clearMemoryCache();
};
