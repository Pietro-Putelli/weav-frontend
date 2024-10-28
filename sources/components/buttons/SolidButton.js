import { MotiView } from "moti";
import React, { useEffect, useMemo, useState } from "react";
import { StyleSheet } from "react-native";
import { useLanguages, useTheme } from "../../hooks";
import { BORDER_RADIUS, BUTTON_HEIGHT, ICON_SIZES } from "../../styles/sizes";
import { BadgeCountView } from "../badgeviews";
import { SquareImage } from "../images";
import { MainText } from "../texts";
import { BounceView, LoaderView } from "../views";

const LEFT_ICON_SIDE = ICON_SIZES.three;

const activeScale = 0.95;

const SolidButton = ({
  icon,
  rightIcon,
  title,
  titleColor,
  selected,
  side,
  style,
  disabled,
  inset = 0,
  type,
  titleStyle,
  loading,
  onPress,
  flex = 0,
  marginRight,
  loadingOnPress,
  coloredIcon,
  count = 0,
  ...props
}) => {
  const theme = useTheme();
  const { languageContent } = useLanguages();

  const [_loading, setLoading] = useState(false);

  const backgroundColor = useMemo(() => {
    switch (type) {
      case "done":
        return "#3E08A3";
      case "delete":
        return "#7F1111";
      case "aqua":
        return "#009B8E";
      case "none":
        return "transparent";
      default:
        return theme.colors.second_background;
    }
  }, [type]);

  const _titleColor = useMemo(() => {
    if (type == "done") {
      return "white";
    }

    return theme.colors.text;
  }, [type]);

  useEffect(() => setLoading(loading), [loading]);

  const _onPress = () => {
    if (loadingOnPress == true) {
      setLoading(true);
    }

    onPress?.();
  };

  const formattedTitle = useMemo(() => {
    const _title = String(title).toLowerCase();

    const action =
      languageContent.actions?.[_title] ?? languageContent.buttons?.[_title];

    if (action) {
      return action;
    }

    return title;
  }, [title]);

  const renderContent = () => (
    <>
      <MotiView
        style={{ flexDirection: "row", alignItems: "center" }}
        animate={{ scale: loading || _loading ? 0 : 1 }}
        transition={{
          type: loading || _loading ? "timing" : "spring",
        }}
      >
        {icon && (
          <SquareImage
            source={icon}
            side={LEFT_ICON_SIDE}
            coloredIcon={coloredIcon}
            style={{ marginRight: 8 }}
          />
        )}
        {title && (
          <MainText
            uppercase
            align="center"
            lineHeight={2}
            bold
            font="subtitle-25"
            color={_titleColor}
            style={{ letterSpacing: 2, ...titleStyle }}
          >
            {formattedTitle}
          </MainText>
        )}

        {rightIcon && (
          <SquareImage
            source={rightIcon}
            side={LEFT_ICON_SIDE}
            coloredIcon={coloredIcon}
            style={{ marginLeft: 8 }}
            color={"#FFFFFF"}
          />
        )}
      </MotiView>

      <MotiView
        from={{ scale: 0 }}
        style={{ position: "absolute" }}
        animate={{ scale: loading || _loading ? 0.8 : 0 }}
        transition={{ type: "timing" }}
      >
        <LoaderView />
      </MotiView>
    </>
  );

  if (icon && !title) {
    return (
      <BounceView
        activeScale={0.9}
        disabled={disabled}
        style={[
          styles.container,
          theme.styles.shadow_round,
          {
            width: side,
            height: side,
            borderRadius: side / 2.2,
            backgroundColor,
          },
          style,
        ]}
        onPress={onPress}
        {...props}
      >
        <MotiView style={styles.moti} animate={{ scale: loading ? 0 : 1 }}>
          <SquareImage
            source={icon}
            side={ICON_SIZES.two - 4 * inset}
            style={{ opacity: disabled ? 0.3 : 1 }}
          />
        </MotiView>

        <MotiView
          from={{ scale: 0 }}
          style={{ position: "absolute" }}
          animate={{ scale: loading ? 0.8 : 0 }}
          transition={{ type: "timing" }}
        >
          <LoaderView />
        </MotiView>
      </BounceView>
    );
  }

  return (
    <BounceView
      activeScale={activeScale}
      style={[
        styles.titleContainer,
        theme.styles.shadow_round,
        {
          height: BUTTON_HEIGHT,
          borderRadius: BORDER_RADIUS * 1.3,
          backgroundColor,
          flex: flex ? 1 : 0,
          marginRight: marginRight ? 12 : 0,
          paddingHorizontal: flex ? 0 : 24,
          alignItems: "center",
        },
        style,
      ]}
      disabled={disabled}
      onPress={_onPress}
      {...props}
    >
      {renderContent()}

      {count > 0 && (
        <BadgeCountView
          count={count}
          style={{ top: 0, position: "relative", marginLeft: 2 }}
        />
      )}
    </BounceView>
  );
};
export default SolidButton;

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  titleContainer: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  moti: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
  dot: {
    position: "absolute",
    top: -2,
    right: -2,
    borderWidth: 3,
  },
});
