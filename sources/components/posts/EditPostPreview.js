import React, { useMemo } from "react";
import { Dimensions, Platform, StyleSheet, View } from "react-native";
import {
  MAX_POST_CONTENT_LENGTH,
  MAX_POST_TITLE_LENGTH,
} from "../../constants/constants";
import { useLanguages, useTheme } from "../../hooks";
import { gradients, icons } from "../../styles";
import {
  CELL_POST_HEIGHT,
  CELL_POST_WIDTH,
  ICON_SIZES,
} from "../../styles/sizes";
import { FadeAnimatedView } from "../animations";
import { IconButton } from "../buttons";
import { CacheableImageView } from "../images";
import { MainTextInput } from "../inputs";
import { LinearGradient } from "../views";
import { RFPercentage } from "react-native-responsive-fontsize";

const { height } = Dimensions.get("window");

const isAndroid = Platform.OS === "android";

const EditPostPreview = ({
  post,
  index,
  onRemovePress,
  onTileChangeText,
  onContentChangeText,
}) => {
  const theme = useTheme();
  const { languageContent } = useLanguages();

  const placeholderColor = theme.colors.secondText;

  const source = post?.source?.uri ?? post?.source;

  const postCellStyle = useMemo(() => {
    return {
      ...styles.postCell,
      ...theme.styles.shadow_round,
    };
  }, []);

  return (
    <FadeAnimatedView delay={200} style={postCellStyle}>
      <CacheableImageView source={source} style={styles.image} />

      {onRemovePress && (
        <View style={styles.closeButton}>
          <IconButton
            blur
            source={icons.Cross}
            side={ICON_SIZES.three}
            onPress={() => onRemovePress(post)}
          />
        </View>
      )}

      <LinearGradient inverted style={styles.overlay} colors={gradients.Shadow}>
        <MainTextInput
          font="title-4"
          numberOfLines={2}
          clearButtonMode="never"
          value={post.title}
          onChangeText={(value) => onTileChangeText({ value, index })}
          maxLength={MAX_POST_TITLE_LENGTH}
          placeholderTextColor={placeholderColor}
          placeholder={languageContent.text_placeholders.add_title}
          textStyle={styles.textInput}
        />

        <View style={styles.textContent}>
          <MainTextInput
            multiline
            scrollEnabled={true}
            font="title-8"
            numberOfLines={3}
            value={post.content}
            clearButtonMode="never"
            textStyle={styles.textContentInput}
            onChangeText={(value) => onContentChangeText({ value, index })}
            placeholderTextColor={placeholderColor}
            showsVerticalScrollIndicator={false}
            maxLength={MAX_POST_CONTENT_LENGTH}
            placeholder={languageContent.text_placeholders.add_description}
          />
        </View>
      </LinearGradient>
    </FadeAnimatedView>
  );
};

export default EditPostPreview;

const styles = StyleSheet.create({
  postCell: {
    overflow: "hidden",
    width: CELL_POST_WIDTH * 2,
    height: CELL_POST_HEIGHT * 2,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  overlay: {
    width: "100%",
    position: "absolute",
    height: "70%",
    bottom: -1,
    justifyContent: "flex-end",
    padding: 16,
    paddingBottom: "6%",
  },
  textContent: {
    marginTop: 6,
    marginHorizontal: "1%",
  },
  textContentInput: {
    maxHeight: height / 10,
    height: isAndroid ? RFPercentage(6) : "auto",
    textAlignVertical: "top",
  },
  closeButton: {
    right: 12,
    top: 12,
    position: "absolute",
  },
  textInput: {
    includeFontPadding: false,
    height: isAndroid ? RFPercentage(6) : "auto",
  },
});
