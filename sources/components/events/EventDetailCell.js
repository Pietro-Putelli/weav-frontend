import { isUndefined } from "lodash";
import React, { memo } from "react";
import { useTheme } from "../../hooks";
import { icons } from "../../styles";
import { ICON_SIZES } from "../../styles/sizes";
import { SquareImage } from "../images";
import { MainText } from "../texts";
import { BounceView } from "../views";

const EventDetailCell = ({
  onPress,
  title,
  icon,
  subtitle,
  titleStyle,
  style,
}) => {
  const theme = useTheme();

  const isPressEnabled = !isUndefined(onPress);

  return (
    <BounceView
      onPress={onPress}
      disabledWithoutOpacity={!isPressEnabled}
      style={[
        theme.styles.shadow_round,
        { flexDirection: "row", alignItems: "center", padding: "4%" },
        style,
      ]}
    >
      <SquareImage coloredIcon source={icon} side={ICON_SIZES.two} />

      <MainText
        numberOfLines={2}
        style={{ flex: 1, marginHorizontal: 12, bottom: 1, ...titleStyle }}
        font="subtitle-1"
      >
        {title}
      </MainText>

      <MainText
        font="subtitle-4"
        bold
        uppercase
        numberOfLines={2}
        style={{ maxWidth: "24%" }}
      >
        {subtitle}
      </MainText>

      {isPressEnabled && (
        <SquareImage
          style={{ marginLeft: 8 }}
          source={icons.Chevrons.Right}
          side={ICON_SIZES.chevron_right}
          color={theme.white_alpha(0.5)}
        />
      )}
    </BounceView>
  );
};

export default memo(EventDetailCell);
