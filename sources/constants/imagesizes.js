import { Dimensions } from "react-native";
import { CELL_POST_HEIGHT, CELL_POST_WIDTH } from "../styles/sizes";
import { RFPercentage } from "react-native-responsive-fontsize";

const { width, height } = Dimensions.get("window");

const imagesizes = {
  BUSINESS_COVER: {
    width,
    height: RFPercentage(40),
  },
  BUSINESS_COVER_CROP: {
    width: width * 2,
    height: RFPercentage(40) * 2,
  },
  PROFILE: {
    width: 800,
    height: 800,
  },
  VERTICAL: {
    width: 900,
    height: 1350,
  },
  POST: {
    width: CELL_POST_WIDTH,
    height: CELL_POST_HEIGHT,
  },
  POST_CROP: {
    width: CELL_POST_WIDTH * 3,
    height: CELL_POST_HEIGHT * 3,
  },
};

export default imagesizes;
