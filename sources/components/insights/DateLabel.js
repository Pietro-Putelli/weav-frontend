import React, { useMemo } from "react";
import { SCREENS } from "../../constants/screens";
import { dateFormats } from "../../dates";
import { formatDate } from "../../dates/formatters";
import { useTheme } from "../../hooks";
import { showModalNavigation } from "../../navigation/actions";
import { MainText } from "../texts";
import { BounceView } from "../views";

const DateLabel = ({ data, onDatePicked }) => {
  const theme = useTheme();

  const { from, to } = useMemo(() => {
    const format = dateFormats.MMM_DD;

    return {
      from: formatDate({ date: data.from, format }),
      to: formatDate({ date: data.to, format }),
    };
  }, []);

  return (
    <BounceView
      onPress={() => {
        showModalNavigation({
          screen: SCREENS.Calendar,
          passProps: {
            period: data,
            onDatePicked,
          },
        });
      }}
      style={[
        {
          paddingHorizontal: "5%",
          flexDirection: "row",
          paddingVertical: "4%",
        },
        theme.styles.cell,
      ]}
    >
      <MainText capitalize bold style={{ flex: 1 }} font="subtitle">
        {data.title}
      </MainText>

      <MainText capitalize bold font="title-8">
        {from} • {to}
      </MainText>
    </BounceView>
  );
};

export default DateLabel;
