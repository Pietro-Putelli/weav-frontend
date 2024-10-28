import React, { memo } from "react";
import { View } from "react-native";
import { useTheme } from "../../hooks";
import { icons, insets } from "../../styles";
import { IconButton } from "../buttons";
import { RFPercentage } from "react-native-responsive-fontsize";
import { openWeb } from "../../utility/linking";

const WebViewFooter = ({ url, onNavigate, options }) => {
  const theme = useTheme();
  const { canGoBack, canGoForward } = options;

  return (
    <View
      style={[
        theme.styles.shadow_round,
        {
          borderRadius: 0,
          paddingTop: "4%",
          flexDirection: "row",
          paddingBottom: insets.bottom + RFPercentage(1),
          paddingHorizontal: "4%",
        },
      ]}
    >
      <View
        style={{
          flex: 1,
          justifyContent: "space-between",
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <IconButton
          side={"three"}
          disabled={!canGoBack}
          source={icons.Chevrons.Left}
          onPress={() => {
            onNavigate("back");
          }}
        />
        <IconButton
          side={"three"}
          disabled={!canGoForward}
          source={icons.Chevrons.Right}
          onPress={() => {
            onNavigate("next");
          }}
        />
      </View>

      <View style={{ flex: 1, alignItems: "flex-end" }}>
        <IconButton
          onPress={() => {
            openWeb(url);
          }}
          side={"three"}
          source={icons.Explore}
        />
      </View>
    </View>
  );
};

export default memo(WebViewFooter);
