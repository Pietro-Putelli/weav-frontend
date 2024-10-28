import React, { memo } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { gradients, icons } from "../../styles";
import { BORDER_RADIUS, ICON_SIZES, MomentCellSize } from "../../styles/sizes";
import { CacheableImageView, SquareImage } from "../images";
import { MainText } from "../texts";
import LinearGradientView from "../views/LinearGradientView";

const { height } = Dimensions.get("window");
const ICON_SIDE = ICON_SIZES.one;

const VenueShotCell = ({ business }) => {
  const businessCity = business?.city ?? business?.location?.city;

  return (
    <View style={styles.container}>
      <CacheableImageView
        source={business.source}
        style={StyleSheet.absoluteFillObject}
      />

      <LinearGradientView
        colors={gradients.LightMoment}
        style={styles.topGradient}
        isFromTop
      >
        <MainText bold numberOfLines={2} font="title-4">
          {business.title}
        </MainText>
      </LinearGradientView>

      {businessCity && (
        <LinearGradientView
          colors={gradients.LightMoment}
          style={styles.bottomGradient}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <SquareImage
              side={ICON_SIDE}
              source={icons.Marker2}
              color="white"
            />
            <MainText color="white" font="title-6" style={{ marginLeft: "1%" }}>
              {businessCity}
            </MainText>
          </View>
        </LinearGradientView>
      )}
    </View>
  );
};

export default memo(VenueShotCell);

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
    height: height / 3,
    borderRadius: BORDER_RADIUS,
    width: MomentCellSize.width * 0.96,
  },
  topGradient: {
    padding: "4%",
    height: "60%",
  },
  bottomGradient: {
    position: "absolute",
    bottom: -1,
    padding: "3%",
    width: "100%",
    height: "30%",
    justifyContent: "flex-end",
  },
});
