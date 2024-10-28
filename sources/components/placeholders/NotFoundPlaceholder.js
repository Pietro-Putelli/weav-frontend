import React, { memo } from "react";
import { Dimensions, Image, View } from "react-native";
import { icons } from "../../styles";
import { widthPercentage } from "../../styles/sizes";
import { FadeAnimatedView } from "../animations";
import { SolidButton } from "../buttons";
import { MainText } from "../texts";

const ICON_SIDE = widthPercentage(0.5);

const NotFoundPlaceholder = ({
  marginTop,
  buttonTitle,
  icon,
  onPress,
  children,
}) => {
  return (
    <FadeAnimatedView
      style={{
        zIndex: 2,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: "16%",
        marginTop,
      }}
    >
      <Image
        resizeMode={"contain"}
        style={{
          width: ICON_SIDE,
          height: ICON_SIDE * 0.6,
          marginBottom: "-4%",
        }}
        source={icon ?? icons.NotFound}
      />
      <MainText align={"center"} font={"subtitle"}>
        {children}
      </MainText>

      {onPress && (
        <View style={{ marginTop: "8%" }}>
          <SolidButton
            haptic
            type={"done"}
            onPress={onPress}
            title={buttonTitle}
            style={{ width: "100%" }}
          />
        </View>
      )}
    </FadeAnimatedView>
  );
};

export default memo(NotFoundPlaceholder);
