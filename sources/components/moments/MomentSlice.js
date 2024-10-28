import React, { memo } from "react";
import { StyleSheet, View } from "react-native";
import { CacheableImageView } from "../images";
import { MainText } from "../texts";
import { LinearGradientView } from "../views";
import TagsList from "./TagsList";

const MomentSlice = ({ slice, style, isChatOrMine, componentId }) => {
  const { source, content } = slice;

  return (
    <View style={[styles.container, style]}>
      <CacheableImageView
        source={source}
        style={[StyleSheet.absoluteFillObject, { borderRadius: 0 }]}
      />

      <LinearGradientView isDark style={styles.bottom_content}>
        <MainText font={isChatOrMine ? "subtitle-1" : "subtitle"}>
          {content}
        </MainText>

        <TagsList
          moment={slice}
          style={styles.tag_list}
          componentId={componentId}
        />
      </LinearGradientView>
    </View>
  );
};

export default memo(MomentSlice);

const styles = StyleSheet.create({
  bottom_content: {
    zIndex: 10,
    bottom: 0,
    width: "100%",
    height: "50%",
    position: "absolute",
    justifyContent: "flex-end",
    padding: "4%",
  },
  content: {
    marginTop: "1%",
    marginHorizontal: "1.5%",
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: "4%",
  },
  tag_list: {
    marginTop: "2%",
  },
});
