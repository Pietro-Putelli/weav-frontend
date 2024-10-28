import React, { memo } from "react";
import { View } from "react-native";
import { useNavigation } from "react-native-navigation-hooks/dist";
import { icons, insets } from "../../styles";
import { IconButton } from "../buttons";
import { HorizontalProgressBar } from "../progress";
import { MainText } from "../texts";

const WebViewHeader = ({ url, isModal, progress }) => {
  const navigation = useNavigation();

  return (
    <View>
      <View
        style={{
          paddingTop: isModal ? "5%" : insets.top,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            paddingBottom: "4%",
            alignItems: "center",
            paddingHorizontal: "3%",
          }}
        >
          {!isModal && (
            <IconButton
              onPress={() => {
                navigation.pop();
              }}
              source={icons.Chevrons.Left}
              side={"four"}
            />
          )}
          <MainText
            bold
            font="subtitle"
            numberOfLines={1}
            style={{ flex: 1, marginHorizontal: "3%" }}
          >
            {url}
          </MainText>

          {isModal && (
            <IconButton
              onPress={() => {
                navigation.dismissModal();
              }}
              source={icons.Cross}
              side={"four"}
            />
          )}
        </View>

        <HorizontalProgressBar progress={progress} />
      </View>
    </View>
  );
};
export default memo(WebViewHeader);
