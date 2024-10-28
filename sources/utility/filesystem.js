import * as FileSystem from "expo-file-system";

export const convertToBase64FromLocalUrl = async (sourceUrl) => {
  const base64 = await FileSystem.readAsStringAsync(sourceUrl, {
    encoding: "base64",
  });
  return base64;
};

export const convertToBase64FromUrl = async (url) => {
  const data = await fetch(url);
  const blob = await data.blob();
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = () => {
      const base64data = reader.result;
      resolve(base64data);
    };
  });
};
