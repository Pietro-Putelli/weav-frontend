import ImageCropPicker from "react-native-image-crop-picker";

export const openPicker = (params, callback) => {
  ImageCropPicker.openPicker({
    cropping: true,
    mediaType: "photo",
    ...params,
  })
    .then((image) => {
      const { width, height, path } = image;

      callback({ width, height, uri: path });
    })
    .catch((error) => {});
};
