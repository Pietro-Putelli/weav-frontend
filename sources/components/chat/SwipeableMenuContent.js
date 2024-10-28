import React, { memo } from "react";
import { View } from "react-native";
import { useTheme } from "../../hooks";
import { icons } from "../../styles";
import { SolidIconButton } from "../buttons";

const SwipeableMenuContent = ({ chat, onMutedPress, onDeletePress }) => {
  const theme = useTheme();

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      <SolidIconButton
        selected={!chat.muted}
        style={{ marginRight: "3%", padding: "3%" }}
        states={[
          { icon: icons.NotificationOn },
          { icon: icons.NotificationOffFill, color: theme.colors.orange },
        ]}
        onPress={() => onMutedPress(chat)}
      />
      <SolidIconButton
        icon={icons.Bin}
        style={{ padding: "3%" }}
        onPress={() => {
          onDeletePress && onDeletePress(chat);
        }}
      />
    </View>
  );
};

export default memo(SwipeableMenuContent);
