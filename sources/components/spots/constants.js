import { Dimensions } from "react-native";

const { width } = Dimensions.get("window");

export const CELL_SIDE = width / 3;
export const CELL_IMAGE_SIDE = CELL_SIDE * 0.9;
export const LIST_HEIGHT = CELL_SIDE * 1.5;
