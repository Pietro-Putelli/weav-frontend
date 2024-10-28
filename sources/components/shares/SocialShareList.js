import React, { memo, useMemo } from "react";
import { Dimensions, FlatList, StyleSheet, View } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { useTheme } from "../../hooks";
import { isAndroidDevice } from "../../utility/functions";
import { SquareImage } from "../images";
import { MainText } from "../texts";
import { BounceView, LinearGradient } from "../views";
import shareItems from "./shareItems";
import { cloneDeep } from "lodash";

const { width } = Dimensions.get("window");
const CELL_SIDE = (width - 8 * 7) / 5;
const CELL_CONTENT_SIDE = CELL_SIDE * 0.68;

const isAndroid = isAndroidDevice();

const SocialShareList = ({
  onPress,
  allowInstagram,
  disableReport,
  scrollEnabled,
  style,
}) => {
  const caseActions = useMemo(() => {
    const _shareItems = cloneDeep(shareItems);

    // if (isAndroid || !allowInstagram) {
    //   _shareItems.splice(0, 1);
    // }

    if (disableReport) {
      _shareItems.splice(_shareItems.length - 1, 1);
    }

    return _shareItems;
  }, []);

  return (
    <View style={[styles.container, style]}>
      <FlatList
        horizontal
        data={caseActions}
        scrollEnabled={scrollEnabled}
        showsHorizontalScrollIndicator={false}
        renderItem={(props) => {
          return <ShareItem onPress={onPress} {...props} />;
        }}
        keyExtractor={(item) => {
          return item.title;
        }}
      />
    </View>
  );
};

export default memo(SocialShareList);

const ShareItem = memo(({ item, onPress }) => {
  const theme = useTheme();

  const { type, icon, title, backgroundColor, backgroundColors } = item;

  const cellStyle = useMemo(() => {
    return {
      ...theme.styles.shadow_round,
      ...styles.cell_content,
      backgroundColor: backgroundColor ?? theme.colors.background,
    };
  }, []);

  return (
    <BounceView onPress={() => onPress(type)} style={styles.cell_container}>
      <LinearGradient
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={cellStyle}
        colors={backgroundColors ?? []}
      >
        <SquareImage side={CELL_SIDE * 0.34} source={icon} />
      </LinearGradient>
      <MainText
        numberOfLines={1}
        uppercase
        style={{ marginTop: "12%", fontSize: RFValue(8) }}
        bold
      >
        {title}
      </MainText>
    </BounceView>
  );
});

const styles = StyleSheet.create({
  container: {
    marginTop: "4%",
    height: CELL_SIDE,
  },
  cell_container: {
    width: CELL_SIDE,
    height: CELL_SIDE,
    marginHorizontal: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  cell_content: {
    width: CELL_CONTENT_SIDE,
    height: CELL_CONTENT_SIDE,
    borderRadius: CELL_CONTENT_SIDE / 2.2,
    justifyContent: "center",
    alignItems: "center",
  },
});
