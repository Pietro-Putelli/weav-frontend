import React, { useMemo } from "react";
import { StyleSheet, View } from "react-native";
import Animated, { SlideInDown } from "react-native-reanimated";
import { gradients } from "../../styles";
import {
  BORDER_RADIUS,
  CELL_POST_HEIGHT,
  CELL_POST_WIDTH,
} from "../../styles/sizes";
import { isNullOrEmpty } from "../../utility/strings";
import { CacheableImageView } from "../images";
import { LinearGradient } from "../views";
import { MainText } from "../texts";

const UserPostFullCell = ({ post }) => {
  const { title, content, hasTitle, hasContent, hasTextContent } =
    useMemo(() => {
      const title = post?.title;
      const content = post?.content;

      const hasTitle = !isNullOrEmpty(title);
      const hasContent = !isNullOrEmpty(content);

      return {
        title,
        content,
        hasTitle,
        hasContent,
        hasTextContent: hasTitle || hasContent,
      };
    }, [post]);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <CacheableImageView
          source={post.source}
          style={StyleSheet.absoluteFillObject}
        />

        {hasTextContent && (
          <LinearGradient
            inverted
            style={styles.overlay}
            colors={gradients.Shadow}
          >
            {hasTitle && (
              <MainText numberOfLines={2} font="title-4">
                {title}
              </MainText>
            )}

            {hasContent && (
              <MainText
                numberOfLines={2}
                font="subtitle"
                style={styles.subtitle}
              >
                {content}
              </MainText>
            )}
          </LinearGradient>
        )}
      </View>
    </View>
  );
};

export default UserPostFullCell;

const styles = StyleSheet.create({
  container: {},
  content: {
    overflow: "hidden",
    width: CELL_POST_WIDTH * 2,
    borderRadius: BORDER_RADIUS,
    height: CELL_POST_HEIGHT * 2,
    justifyContent: "flex-end",
  },
  overlay: {
    width: "100%",
    height: "50%",
    bottom: -1,
    paddingBottom: "6%",
    position: "absolute",
    paddingHorizontal: "5%",
    justifyContent: "flex-end",
  },
  subtitle: {
    marginTop: "1%",
    marginLeft: "0.5%",
  },
});
