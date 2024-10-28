import React, { memo } from "react";
import { MainText } from "../texts";
import BadgeView from "./BadgeView";

const TitleBadgeView = ({ ...props }) => {
  return (
    <BadgeView style={{ width: "50%" }} {...props}>
      <MainText bold font="subtitle">
        Seen stories
      </MainText>
    </BadgeView>
  );
};

export default memo(TitleBadgeView);
