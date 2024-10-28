import React, { memo, useMemo } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { widthPercentage } from "../../styles/sizes";
import { CacheableImageView } from "../images";
import { MainText } from "../texts";

const LARGE_IMAGE_SIDE = widthPercentage(0.1);
const SMALL_IMAGE_SIDE = widthPercentage(0.08);

const MomentParticipantsView = ({
  participants,
  isLarge,
  onPress,
  style,
  disabled,
}) => {
  const { users, count } = participants;

  const hasMoreThan3 = count > 3;

  const imageSide = useMemo(() => {
    if (isLarge) {
      return LARGE_IMAGE_SIDE;
    }
    return SMALL_IMAGE_SIDE;
  }, []);

  const formattedCount = useMemo(() => {
    if (count >= 3) {
      return count - 2;
    }

    return Math.min(count, 9);
  }, [count]);

  if (users.length === 0) {
    return null;
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
      style={[styles.container, style]}
    >
      {users.slice(0, 3).map((user, index) => {
        return (
          <View
            style={[
              styles.image,
              {
                width: imageSide,
                height: imageSide,
                zIndex: index,
                borderRadius: imageSide / 2.2,
                marginLeft: index > 0 ? -imageSide / 1.8 : 0,
              },
            ]}
            key={index.toString()}
          >
            <CacheableImageView
              source={user.picture}
              style={StyleSheet.absoluteFillObject}
            />

            {index === 2 && hasMoreThan3 && (
              <View
                style={{
                  position: "absolute",
                  zIndex: 10,
                  backgroundColor: "rgba(0,0,0,0.6)",
                  ...StyleSheet.absoluteFillObject,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <MainText bold style={{ fontSize: imageSide * 0.4 }}>
                  +{formattedCount}
                </MainText>
              </View>
            )}
          </View>
        );
      })}
    </TouchableOpacity>
  );
};

export default memo(MomentParticipantsView);

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  image: {
    overflow: "hidden",
  },
  title: { marginLeft: 8 },
  replyIcon: {
    marginLeft: -10,
  },
});
