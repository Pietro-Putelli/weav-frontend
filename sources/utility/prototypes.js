import { FlashList } from "@shopify/flash-list";
import { RefreshControl, ScrollView, Text, TextInput } from "react-native";
import { FlatList } from "react-native-gesture-handler";

/* Set default props for components */
TextInput.defaultProps = Object.assign({}, TextInput.defaultProps, {
  keyboardAppearance: "dark",
  allowFontScaling: false,
});

Text.defaultProps = Object.assign({}, Text.defaultProps, {
  allowFontScaling: false,
});

RefreshControl.defaultProps = Object.assign({}, RefreshControl.defaultProps, {
  tintColor: "#FFFFFF60",
});

String.prototype.capitalize = function () {
  return this.charAt(0).toUpperCase() + this.slice(1);
};

FlatList.defaultProps = Object.assign({}, FlatList.defaultProps, {
  overScrollMode: "never",
});

FlashList.defaultProps = Object.assign({}, FlashList.defaultProps, {
  overScrollMode: "never",
});

ScrollView.defaultProps = Object.assign({}, ScrollView.defaultProps, {
  overScrollMode: "never",
});
