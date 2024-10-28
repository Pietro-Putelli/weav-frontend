import React, { memo } from "react";
import { MainText } from "../texts";
import BaseCell from "./BaseCell";

const TimetableCell = ({ text, ...props }) => {
  return (
    <BaseCell {...props}>
      <MainText bold font="title-6">
        {text}
      </MainText>
    </BaseCell>
  );
};

export default memo(TimetableCell);
