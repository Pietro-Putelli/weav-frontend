import React, { memo } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { useTheme } from "../../hooks";
import { MainText } from "../texts";
import { ReplySegment, ReplyUsername } from "./MessageMixComponents";

const ReplyTextView = ({ reply, isClub, isSender, onPress }) => {
  const theme = useTheme();

  return (
    <View>
      <TouchableOpacity
        activeOpacity={0.7}
        style={styles.reply_container}
        onPress={() => onPress(message)}
      >
        <ReplySegment isSender={isSender} />
        <View style={{ flexShrink: 1 }}>
          {isClub && <ReplyUsername reply={reply} />}
          <MainText
            font={"subtitle-2"}
            numberOfLines={2}
            style={[{ color: theme.colors.text }]}
          >
            {reply.content}
          </MainText>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default memo(ReplyTextView);

const styles = StyleSheet.create({
  reply_container: {
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  reply_segment: {
    width: 2,
    height: "100%",
    borderRadius: 4,
    marginRight: 8,
    marginLeft: 4,
  },
});
