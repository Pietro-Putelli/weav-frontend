import { MotiView } from "moti";
import React from "react";
import { Dimensions, Image, View } from "react-native";
import { useTheme } from "../../hooks";
import { icons } from "../../styles";

const { width } = Dimensions.get("window");
const CHECK_SIDE = width / 18;

const CheckmarkButton = ({ selected, disabled, side, hideUnselected }) => {
  const theme = useTheme();
  const _side = side ? side : CHECK_SIDE;

  return (
    <View
      style={{
        borderWidth: hideUnselected ? 0 : 1,
        width: _side,
        height: _side,
        borderColor: theme.colors.main_accent,
        borderRadius: _side / 2,
        opacity: disabled ? 0.5 : 1,
      }}
    >
      <MotiView
        style={{ justifyContent: "center", alignItems: "center" }}
        from={{ scale: selected ? 1 : 0 }}
        transition={{
          type: "timing",
        }}
      >
        <Image
          source={icons.CircleCheck}
          style={[
            {
              width: "105%",
              height: "105%",
              tintColor: theme.colors.main_accent,
            },
          ]}
        />
      </MotiView>
    </View>
  );
};
export default React.memo(CheckmarkButton);
