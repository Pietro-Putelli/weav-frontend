import React, { memo } from "react";
import { View } from "react-native";
import { FadeAnimatedView } from "../animations";
import PostCell from "./PostCell";

const PostsList = ({
  posts,
  style,
  onPress,
  isNotFound,
  onLongPress,
  renderPlaceholder,
  ...props
}) => {
  if (isNotFound) {
    return renderPlaceholder();
  }

  return (
    <View
      style={{
        flexWrap: "wrap",
        flexDirection: "row",
        justifyContent: "space-between",
        ...style,
      }}
      {...props}
    >
      {(posts ?? []).map((post, index) => {
        return (
          <FadeAnimatedView key={post.id}>
            <PostCell
              post={post}
              onLongPress={onLongPress}
              onPress={() => onPress(index)}
              style={{ marginBottom: index < 2 ? 8 : 0 }}
            />
          </FadeAnimatedView>
        );
      })}
    </View>
  );
};

export default memo(PostsList);
