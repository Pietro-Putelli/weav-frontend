import { imagesizes } from "../../constants";
import { resizeImage } from "../../utility/imagecropper";

export const appendProfilePicture = async (uri) => {
  const picture = await resizeImage(uri, imagesizes.PROFILE);

  const formData = new FormData();

  formData.append("picture", {
    uri: picture,
    type: "image/png",
    name: "profile.picture.png",
  });

  return formData;
};
