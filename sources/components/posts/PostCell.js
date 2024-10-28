import React, { memo, useMemo } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { useTheme } from "../../hooks";
import { icons } from "../../styles";
import { postCellSizeForScale } from "../../styles/sizes";
import { isNullOrEmpty } from "../../utility/strings";
import { FadeAnimatedView } from "../animations";
import { IconButton } from "../buttons";
import { CacheableImageView } from "../images";
import { MainText } from "../texts";
import { BounceView, LinearGradientView } from "../views";

const PostCell = ({
  post,
  scale = 1,
  style,
  disabled,
  hideOverlay,
  disabledRemove,
  marginVertical,
  onRemovePress,
  onLongPress,
  ...props
}) => {
  let title = post?.title;
  let content = post?.content;

  let source = post?.uri || post.source;
  const postSlice = post?.slices?.[0];

  if (postSlice) {
    source = postSlice.source;
    title = postSlice.title;
    content = postSlice.content;
  }

  let hasContent = !isNullOrEmpty(title) || !isNullOrEmpty(content);

  const theme = useTheme();

  /* Styles */

  const containerStyle = useMemo(() => {
    return {
      ...styles.container,
      ...theme.styles.shadow_round,
      ...postCellSizeForScale(scale),
      ...style,
      marginVertical: marginVertical ? 4 : 0,
    };
  }, [scale, style]);

  return (
    <BounceView
      style={containerStyle}
      disabledWithoutOpacity={disabled}
      onLongPress={() => onLongPress(post)}
      {...props}
    >
      <CacheableImageView
        resizeMode={"cover"}
        source={source?.uri ?? source}
        style={StyleSheet.absoluteFill}
      />

      {hasContent && !hideOverlay && (
        <FadeAnimatedView mode="fade" style={styles.overlay_container}>
          <LinearGradientView animated style={styles.overlay}>
            <MainText numberOfLines={2} font="title-6">
              {title}
            </MainText>
            {!isNullOrEmpty(content) && (
              <MainText
                numberOfLines={2}
                font="subtitle-3"
                style={styles.subtitle}
              >
                {content}
              </MainText>
            )}
          </LinearGradientView>
        </FadeAnimatedView>
      )}

      {onRemovePress && (
        <IconButton
          blur
          side="five"
          source={icons.Cross}
          onPress={onRemovePress}
          disabled={disabledRemove}
          style={styles.remove_button}
        />
      )}
    </BounceView>
  );
};

export default memo(PostCell);

const styles = StyleSheet.create({
  image: {
    zIndex: 0,
    width: "100%",
    height: "100%",
  },
  externalContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    borderRadius: 8,
    overflow: "hidden",
    justifyContent: "flex-end",
  },
  remove_button: {
    position: "absolute",
    zIndex: 2,
    right: 8,
    top: 8,
  },
  overlay: {
    paddingBottom: "6%",
    paddingHorizontal: "5%",
    ...StyleSheet.absoluteFill,
    justifyContent: "flex-end",
    bottom: -1,
  },
  overlay_container: {
    height: "82%",
  },
  subtitle: {
    marginTop: "3%",
    marginLeft: "2%",
  },
  video: {
    ...StyleSheet.absoluteFillObject,
    zIndex: -1,
  },
});
