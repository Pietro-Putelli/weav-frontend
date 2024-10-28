import React, { memo, useMemo } from "react";
import { StyleSheet } from "react-native";
import { MainText } from "../texts";
import { LinearGradientView } from "../views";
import { isNullOrEmpty } from "../../utility/strings";

const PostTitleView = ({ slice }) => {
  const title = slice?.title;
  const content = slice?.content;

  const isContentEmpty = isNullOrEmpty(content);

  if (title == null && isContentEmpty) {
    return null;
  }

  const titleStyle = useMemo(() => {
    if (isContentEmpty) {
      return { marginBottom: "4%" };
    }
    return {};
  }, [isContentEmpty]);

  return (
    <LinearGradientView isDark style={styles.container}>
      <MainText font="title-5" style={titleStyle}>
        {title}
      </MainText>
      {!isContentEmpty && (
        <MainText style={styles.subtitle} font="subtitle-1">
          {content}
        </MainText>
      )}
    </LinearGradientView>
  );
};

export default memo(PostTitleView);

const styles = StyleSheet.create({
  container: {
    bottom: -1,
    width: "100%",
    paddingTop: "40%",
    position: "absolute",
    paddingHorizontal: "4%",
    paddingBottom: "2%",
  },
  subtitle: {
    marginLeft: 4,
    marginTop: "1%",
    paddingBottom: "5%",
  },
});
