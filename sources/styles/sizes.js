import { Dimensions } from "react-native";
import { RFPercentage } from "react-native-responsive-fontsize";
import { isAndroidDevice } from "../utility/functions";
import insets from "./insets";

const isAndroid = isAndroidDevice();

const { width, height } = Dimensions.get("window");

export const widthPercentage = (percentage) => {
  return percentage * width;
};

export const heightPercentage = (percentage) => {
  return percentage * height;
};

export const ICON_SIZES = {
  one: widthPercentage(0.075),
  two: RFPercentage(3),
  three: RFPercentage(2.5),
  four: RFPercentage(2.2),
  five: RFPercentage(1.8),
  six: RFPercentage(1.5),
  seven: RFPercentage(1.2),

  chevron_right: RFPercentage(2),
};

/* GENERAL */

export const TAB_BAR_HEIGHT = insets.bottom + 60;
export const NAVIGATION_BAR_HEIGHT = RFPercentage(5) + insets.top;

export const HOME_PADDING_BOTTOM = TAB_BAR_HEIGHT + 16;

export const CURRENT_EVENT_VIEW_HEIGHT = RFPercentage(6.5);

export const HOME_PADDING_BOTTOM_WITH_EVENT =
  HOME_PADDING_BOTTOM + CURRENT_EVENT_VIEW_HEIGHT;

export const HOME_HEADER_HEIGHT = widthPercentage(0.125);

export const VENUE_TYPES_SELECTOR_HEIGHT = RFPercentage(6) + 16;

/* SOLID BUTTON */

export const BUTTON_HEIGHT = Math.max(width / 8.5, RFPercentage(6));
export const MID_BUTTON_HEIGHT = BUTTON_HEIGHT * 0.95;
export const BORDER_RADIUS = BUTTON_HEIGHT / 3.3;

/* CAMERA */

export const CAMERA_BUTTON_SIDE = width / 5;

/* POST */

export const CELL_POST_WIDTH = (width - 24) / 2;
export const CELL_POST_HEIGHT = Math.round(
  Math.max(width / 1.5, RFPercentage(35))
);

export const InsightSourceCellSize = {
  width: CELL_POST_WIDTH,
  height: CELL_POST_HEIGHT,
};

export const postCellSizeForScale = (scale) => {
  return {
    width: CELL_POST_WIDTH * scale,
    height: CELL_POST_HEIGHT * scale,
  };
};

export const VENUE_CELL_HEIGHT = RFPercentage(32);

export const PLACEHOLDER_HEIGHT =
  height - NAVIGATION_BAR_HEIGHT * 1 - TAB_BAR_HEIGHT;

/* CHAT */

export const CHAT_CELL_HEIGHT = widthPercentage(0.175);
export const CHAT_PROFILE_CELL_SIDE = CHAT_CELL_HEIGHT * 0.8;

/* PROFILE */

export const PROFILE_IMAGE_SIDE = widthPercentage(0.12);

/* MOMENTS CELL */

export const MomentCellSize = {
  width: width - 12,
  height: (height - TAB_BAR_HEIGHT - HOME_HEADER_HEIGHT - insets.top) * 0.96,
};

export const MediaCellSize = {
  maxHeight: MomentCellSize.height * 0.9,
  minHeight: RFPercentage(38),
  initialHeight: RFPercentage(35) / 2,
};

export const MomentCellPreviewSize = {
  maxHeight: MediaCellSize.maxHeight * 0.9,
  mediaWidth: MomentCellSize.width * 0.9,
  mediaHeight: MomentCellSize.height * 0.7,
  textWidth: MomentCellSize.width * 0.9,
};

export const EVENT_CELL_LIMIT =
  MomentCellSize.height * (isAndroid ? 0.3 : 0.35);

export const MESSAGE_TEXT_INPUT_HEIGHT = Math.max(800, height) * 0.06;

export const POST_HEIGHT = height * 0.85 - insets.top - insets.bottom;

export const FLOATING_HEADER_PADDING_TOP = insets.top + 68;

/* METHODS */

export const getCircleImageStyle = (side, percentage) => {
  const containerSide =
    side == undefined ? widthPercentage(0.25) * percentage : side;

  let contentSide = containerSide * 0.92;
  let borderWidth = 2.5;

  if (side < 100) {
    contentSide = containerSide * 0.9;

    if (side < 60) {
      borderWidth = 1.5;
      contentSide = containerSide * 0.88;
    }
  }

  const borderRadiusFactor = 2.2;

  return {
    container: {
      width: containerSide,
      height: containerSide,
      borderRadius: containerSide / borderRadiusFactor,
      borderWidth,
    },
    content: {
      width: contentSide,
      height: contentSide,
      borderRadius: contentSide / borderRadiusFactor,
    },
  };
};

export const getPictureHeight = (
  { width: sourceWidth, height: sourceHeight },
  isChatPreview
) => {
  let pictureHeight = (width * sourceHeight) / sourceWidth;

  const MAX_HEIGHT = isChatPreview
    ? MomentCellPreviewSize.maxHeight
    : MediaCellSize.maxHeight;

  if (pictureHeight >= MediaCellSize.minHeight) {
    return Math.min(pictureHeight, MAX_HEIGHT);
  }

  return MediaCellSize.minHeight;
};

export const getPictureHeightUsingRatio = (ratio = 0.7, isChatPreview) => {
  const imageHeight = width * ratio;

  if (imageHeight <= MediaCellSize.minHeight) {
    return MediaCellSize.minHeight;
  }

  const MAX_HEIGHT = isChatPreview
    ? MomentCellPreviewSize.maxHeight
    : MediaCellSize.maxHeight;

  return Math.min(imageHeight, MAX_HEIGHT);
};

export const getEventCellSize = ({ ratio, scale = 1 }) => {
  return {
    width: (width - 12) * scale,
    height: getPictureHeightUsingRatio(ratio) * scale,
  };
};
