import _ from "lodash";
import { resizeImageToNearestSize } from "../../utility/imagecropper";

export const isInFileSystem = (source) => {
  const uri = source?.uri ?? source;

  if (uri) {
    return (
      uri.includes("file:///") ||
      uri.includes("ph://") ||
      uri.includes("/private/")
    );
  }
  return false;
};

export const appendSourceTo = async (formData, { source, name = "source" }) => {
  const sourceUri = await resizeImageToNearestSize(source);

  formData.append(name, {
    uri: sourceUri,
    type: "image/jpeg",
    name: "image" + "-" + Date.now() + ".jpg",
  });
};

export const getFormDataSourceName = (type) => {
  const isPhoto = type == "photo";
  const sourceType = isPhoto ? "image/jpg" : "video/mp4";
  const extension = isPhoto ? "png" : "mp4";

  return { type: sourceType, name: `filename.${extension}` };
};

export const getRightAsset = (localIdentifier, ext) => {
  const hash = localIdentifier.split("://")[1];
  return `assets-library://asset/asset.${ext}?id=${hash}&ext=${ext}`;
};
