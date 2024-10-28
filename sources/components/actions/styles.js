import { Dimensions } from "react-native";
import { ICON_SIZES } from "../../styles/sizes";

const { width } = Dimensions.get("window");

const BUTTON_SIDE = (width - 32 - 16 * 4) / 5;
export const ICON_SIDE = ICON_SIZES.two * 0.9;

export const actionCellContainerStyle = {
  width: BUTTON_SIDE,
  height: BUTTON_SIDE,
  borderRadius: BUTTON_SIDE / 2.2,
  justifyContent: "center",
  alignItems: "center",
};
