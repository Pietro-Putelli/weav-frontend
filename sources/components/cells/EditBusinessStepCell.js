import { isUndefined } from "lodash";
import React, { memo, useMemo } from "react";
import { View } from "react-native";
import { useLanguages, useTheme } from "../../hooks";
import { icons } from "../../styles";
import { ICON_SIZES } from "../../styles/sizes";
import { isNullOrUndefined } from "../../utility/boolean";
import { SquareImage } from "../images";
import { MainText } from "../texts";
import { BounceView, PurpleDot } from "../views";

const EditBusinessStepCell = ({
  icon,
  placeholder,
  title,
  content,
  isOptional,
  onPress,
  multilineContent,
  isRequired,
  isNumbers,
  category,
  ...props
}) => {
  const theme = useTheme();
  const { languageContent } = useLanguages();

  const isValidContent = !isNullOrUndefined(content) || !isUndefined(category);

  const containerStyle = useMemo(() => {
    return {
      ...theme.styles.shadow_round,
      marginTop: "3%",
      padding: "4%",
      flexDirection: "row",
      alignItems: "center",
    };
  }, []);

  const contentStyle = useMemo(() => {
    if (isValidContent) {
      return {
        font: multilineContent ? "subtitle-1" : "title-8",
        isNumbers,
      };
    }

    return {
      font: "subtitle-1",
      color: theme.colors.placeholderText,
    };
  }, [isValidContent, isNumbers, multilineContent]);

  const _content = useMemo(() => {
    if (isValidContent) {
      return content;
    } else {
      return (
        languageContent.add +
        " " +
        title +
        (isOptional ? " " + languageContent.optional : "")
      );
    }
  }, [isValidContent, content, isOptional]);

  return (
    <BounceView onPress={() => onPress(props)} style={containerStyle}>
      {icon && (
        <SquareImage
          source={icon}
          coloredIcon
          side={ICON_SIZES.two}
          style={{ marginRight: "4%" }}
        />
      )}
      <View style={{ flex: 1 }}>
        {isValidContent && title && (
          <MainText
            style={{ marginBottom: "3%" }}
            font="subtitle-4"
            uppercase
            bold
          >
            {title}
          </MainText>
        )}

        <View style={{ flexDirection: "row", alignItems: "center" }}>
          {category && (
            <View
              style={{
                backgroundColor: theme.colors.main_accent,
                padding: 3,
                marginRight: 8,
                borderRadius: 10,
                paddingHorizontal: 8,
              }}
            >
              <MainText {...contentStyle} font="subtitle-1">
                {category}
              </MainText>
            </View>
          )}

          <View style={{ flex: 1, marginRight: "4%", marginLeft: 2 }}>
            <MainText
              numberOfLines={multilineContent ? 3 : 1}
              {...contentStyle}
            >
              {_content}
            </MainText>
          </View>
        </View>
      </View>

      {isRequired && <PurpleDot style={{ marginRight: 8 }} />}
      <SquareImage
        side={ICON_SIZES.chevron_right}
        color={theme.white_alpha(0.3)}
        source={icons.Chevrons.Right}
      />
    </BounceView>
  );
};

export default memo(EditBusinessStepCell);
