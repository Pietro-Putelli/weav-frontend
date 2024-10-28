import React from "react";
import { View } from "react-native";
import { useTheme } from "../../hooks";
import { icons, typographies } from "../../styles";
import { SquareImage } from "../images";
import { MainText } from "../texts";

const PhoneCell = ({ title }) => {
  const theme = useTheme();

  return (
    <View
      style={[
        theme.styles.shadow_round,
        { padding: "4%", flexDirection: "row", alignItems: "center" },
      ]}
    >
      <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
        <SquareImage percentage={0.7} coloredIcon source={icons.ColoredPhone} />
        <MainText
          style={{
            fontSize: typographies.fontSizes.subtitle,
            marginLeft: "4%",
            flex: 1,
          }}
        >
          {title}
        </MainText>
      </View>
      <SquareImage
        percentage={0.7}
        source={icons.Verified}
        color={theme.colors.green}
      />
    </View>
  );
};
export default PhoneCell;
