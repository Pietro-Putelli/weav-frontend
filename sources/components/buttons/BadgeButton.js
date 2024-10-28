import React, { memo } from "react";
import { BadgeCountView } from "../badgeviews";
import { BounceView } from "../views";
import IconButton from "./IconButton";

const BadgeButton = ({ count, style, onPress, showLabel, ...props }) => {
  return (
    <BounceView style={style} onPress={onPress}>
      <BadgeCountView noText={!showLabel} count={count} />

      <IconButton disabledWithoutOpacity {...props} />
    </BounceView>
  );
};

export default memo(BadgeButton);
