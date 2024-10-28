import React, { memo } from "react";
import { StyleSheet } from "react-native";
import { MainText } from "../texts";
import { LinearGradientView } from "../views";
import MediaCell from "./MediaCell";
import { gradients } from "../../styles";

const BusinessCell = ({ moment, ...props }) => {
  const business = moment.business_tag;

  const name = business?.name ?? business?.value;

  return (
    <MediaCell moment={moment} source={business.cover_source} {...props}>
      <LinearGradientView
        isFromTop
        colors={gradients.DarkMoment}
        style={styles.topContainer}
      >
        <MainText style={styles.title} bold numberOfLines={1} font="title-4">
          {name}
        </MainText>
      </LinearGradientView>
    </MediaCell>
  );
};

export default memo(BusinessCell);

const styles = StyleSheet.create({
  title: {
    top: 12,
    position: "absolute",
    marginHorizontal: 12,
  },
  topContainer: {
    position: "absolute",
    top: 0,
    width: "100%",
    height: "35%",
  },
});
