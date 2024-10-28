import { Dimensions } from "react-native";

const { height } = Dimensions.get("window");
export const CELL_HEIGHT = Math.round(height / 18);

export const VIEWPORT_HEIGHT = CELL_HEIGHT * 3;
