import { manipulateAsync } from "expo-image-manipulator";

const getPercentFromNumber = (percent, numberFrom) =>
  (numberFrom / 100) * percent;

const getPercentDiffNumberFromNumber = (number, numberFrom) =>
  (number / numberFrom) * 100;

export { getPercentFromNumber, getPercentDiffNumberFromNumber };

export const cropImage = (params) => {
  const {
    positionX,
    positionY,
    scale,
    srcSize,
    fittedSize,
    cropSize,
    cropAreaSize,
    imageUri,
  } = params;

  const offset = {
    x: 0,
    y: 0,
  };

  const cropAreaW = cropAreaSize ? cropAreaSize.width : w;
  const cropAreaH = cropAreaSize ? cropAreaSize.height : w;

  const wScale = cropAreaW / scale;
  const hScale = cropAreaH / scale;

  const percentCropperAreaW = getPercentDiffNumberFromNumber(
    wScale,
    fittedSize.width
  );
  const percentRestW = 100 - percentCropperAreaW;
  const hiddenAreaW = getPercentFromNumber(percentRestW, fittedSize.width);

  const percentCropperAreaH = getPercentDiffNumberFromNumber(
    hScale,
    fittedSize.height
  );
  const percentRestH = 100 - percentCropperAreaH;
  const hiddenAreaH = getPercentFromNumber(percentRestH, fittedSize.height);

  const x = hiddenAreaW / 2 - positionX;
  const y = hiddenAreaH / 2 - positionY;

  offset.x = x <= 0 ? 0 : x;
  offset.y = y <= 0 ? 0 : y;

  const srcPercentCropperAreaW = getPercentDiffNumberFromNumber(
    offset.x,
    fittedSize.width
  );
  const srcPercentCropperAreaH = getPercentDiffNumberFromNumber(
    offset.y,
    fittedSize.height
  );

  const offsetW = getPercentFromNumber(srcPercentCropperAreaW, srcSize.width);
  const offsetH = getPercentFromNumber(srcPercentCropperAreaH, srcSize.height);

  const sizeW = getPercentFromNumber(percentCropperAreaW, srcSize.width);
  const sizeH = getPercentFromNumber(percentCropperAreaH, srcSize.height);

  offset.x = Math.floor(offsetW);
  offset.y = Math.floor(offsetH);

  const cropData = {
    offset,
    size: {
      width: Math.round(sizeW),
      height: Math.round(sizeH),
    },
    displaySize: {
      width: Math.round(cropSize.width),
      height: Math.round(cropSize.height),
    },
  };

  const { x: originX, y: originY } = cropData.offset;

  return new Promise((resolve, reject) =>
    manipulateAsync(imageUri, [
      {
        crop: { ...cropData.size, originX, originY },
      },
      {
        resize: cropData.displaySize,
      },
    ])
      .then(resolve)
      .catch(reject)
  );
};

export const resizeImage = async (source, size) => {
  const manipulatedImage = await manipulateAsync(source, [{ resize: size }]);

  return manipulatedImage.uri;
};

const roundToNearestRatio = (size, min = 1080) => {
  let prevSize;

  while (size.width >= min) {
    prevSize = { ...size };

    size.width *= 0.9;
    size.height *= 0.9;

    if (size.width < min) {
      size = prevSize;
      break;
    }
  }
  return size;
};

/* Resize the image to nearest value to MAX_WIDTH=1080 */

export const resizeImageToNearestSize = async ({ uri, width, height }, min) => {
  const newSize = roundToNearestRatio({ width, height }, min);

  return await resizeImage(uri, newSize);
};

export const resizeImageKeepingRatio = async ({ uri, width, height }) => {
  // R_W : R_H = w : h
  const imageWidth = 1000;
  const imageHeight = (imageWidth * height) / width;

  return await resizeImage(uri, { width: imageWidth, height: imageHeight });
};
