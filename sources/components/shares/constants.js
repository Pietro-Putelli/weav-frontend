import { Dimensions } from "react-native";

const { width } = Dimensions.get("window");
export const SOCIAL_CELL_SIDE = Math.round(width / 4);
export const SOCIAL_CELL_CONTENT_SIDE = Math.round(SOCIAL_CELL_SIDE * 0.7);
