import React, { memo, useMemo } from "react";
import { dateFormats } from "../../dates";
import { formatDate } from "../../dates/formatters";
import { useLanguages } from "../../hooks";
import { MainText } from "../texts";
import BaseCell from "./BaseCell";

const DateCell = ({ text, index, isPeriodic, ...props }) => {
  const { languageContent } = useLanguages();

  const formattedText = useMemo(() => {
    if (isPeriodic) {
      return text;
    }

    const { today, tomorrow } = languageContent;

    if (index == 0) {
      return today;
    }

    if (index == 1) {
      return tomorrow;
    }

    return formatDate({ date: text, format: dateFormats.ddd_D_MMM });
  }, [index, isPeriodic]);

  return (
    <BaseCell index={index} {...props}>
      <MainText capitalize bold font="title-6">
        {formattedText}
      </MainText>
    </BaseCell>
  );
};

export default memo(DateCell);
