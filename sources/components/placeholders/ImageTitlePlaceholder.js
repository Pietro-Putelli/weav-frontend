import React, { memo } from "react";
import { NAVIGATION_BAR_HEIGHT, widthPercentage } from "../../styles/sizes";
import { FadeAnimatedView } from "../animations";
import { SquareImage } from "../images";
import { MainText } from "../texts";
import { Dimensions } from "react-native";
import { icons, insets } from "../../styles";
import { isUndefined } from "lodash";
import { SolidButton } from "../buttons";

const ICON_SIDE = widthPercentage(0.25);

const { height } = Dimensions.get("window");

const ImageTitlePlaceholder = ({
  icon,
  style,
  buttonTitle,
  onPress,
  children,
}) => {
  return (
    <FadeAnimatedView
      style={{
        height: height - NAVIGATION_BAR_HEIGHT - insets.bottom - 32,
        alignItems: "center",
        marginHorizontal: "8%",
        justifyContent: "center",
        alignItems: "center",

        ...style,
      }}
    >
      <SquareImage source={icon} coloredIcon side={ICON_SIDE} />

      <MainText align="center" font="subtitle" style={{ marginTop: "8%" }}>
        {children}
      </MainText>

      {!isUndefined(onPress) && (
        <SolidButton
          type="done"
          icon={icons.Add}
          title={buttonTitle}
          onPress={onPress}
          style={{ marginTop: "6%", width: "70%" }}
        />
      )}
    </FadeAnimatedView>
  );
};

export default memo(ImageTitlePlaceholder);
