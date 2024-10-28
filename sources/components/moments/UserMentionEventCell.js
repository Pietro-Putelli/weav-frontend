import React, { memo } from "react";
import { StyleSheet } from "react-native";
import { gradients } from "../../styles";
import { MainText } from "../texts";
import { LinearGradientView } from "../views";
import MediaCell from "./MediaCell";

const UserMentionEventCell = ({ moment, ...props }) => {
  const event = moment?.event;
  const { title } = event;

  return (
    <MediaCell moment={moment} source={event?.cover} {...props}>
      <LinearGradientView
        isFromTop
        style={styles.title}
        colors={gradients.Shadow}
      >
        <MainText bold numberOfLines={1} font="title-4">
          {title}
        </MainText>
      </LinearGradientView>
    </MediaCell>
  );
};

export default memo(UserMentionEventCell);

const styles = StyleSheet.create({
  title: {
    top: 0,
    padding: "4%",
    width: "100%",
    paddingBottom: "4%",
    position: "absolute",
    justifyContent: "flex-start",
  },
});
