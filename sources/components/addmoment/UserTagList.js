import _ from "lodash";
import { MotiView } from "moti";
import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Dimensions, Platform, StyleSheet } from "react-native";
import { searchUsers } from "../../backend/profile";
import { useTheme } from "../../hooks";
import { FadeAnimatedView } from "../animations";
import { ProfilePicture } from "../images";
import { AdvancedFlatList } from "../lists";
import { MainText } from "../texts";
import { BounceView } from "../views";

const isAndroid = Platform.OS === "android";

const { width } = Dimensions.get("window");
const CELL_SIDE = (width - 8 * 5) / 5;

const UserTagList = ({ parts, currentText, onSelected }) => {
  const theme = useTheme();
  const [users, setUsers] = useState([]);

  const offset = useRef(0);
  const isVisible = currentText != null;

  useEffect(() => {
    if (isVisible) {
      fetchUsers();
    }
  }, [currentText]);

  const onPress = (user) => {
    if (!parts) return;

    const _parts = parts.map((part) => {
      if (part.isCursorActive) {
        const words = part.word.split("@");
        const word = part.word.replace(
          `@${words[words.length - 1]}`,
          `@${user.username}`
        );
        return { ...part, word };
      }
      return part;
    });

    let combinedText = "";
    _parts.forEach((part) => {
      combinedText += part.word + " ";
    });

    onSelected({ value: combinedText, user });
  };

  const fetchUsers = () => {
    searchUsers(
      { value: currentText.slice(1), offset: offset.current },
      (data) => {
        if (offset.current == 0) {
          setUsers(data);
        } else {
          setUsers(_.unionBy(users, data, "id"));
        }
      }
    );
  };

  const onEndReached = useCallback(() => {
    offset.current += 8;
    fetchUsers();
  }, [users, currentText]);

  const renderItem = useCallback(
    ({ item: user }) => {
      return (
        <FadeAnimatedView mode="fade">
          <BounceView haptic onPress={() => onPress(user)} style={styles.cell}>
            <ProfilePicture
              disabled
              removeOutline
              side={CELL_SIDE * 0.6}
              source={user.picture}
            />
            <MainText numberOfLines={1} style={{ marginTop: 4 }} align="center">
              {user.username}
            </MainText>
          </BounceView>
        </FadeAnimatedView>
      );
    },
    [onPress]
  );

  const animatedProps = useMemo(() => {
    let props = {};

    if (isVisible) {
      props = {
        animate: {
          translateY: 0,
          opacity: 1,
        },
      };
    } else {
      props = {
        animate: {
          translateY: CELL_SIDE * 2,
          opacity: 0,
        },
      };
    }

    return {
      ...props,
      transition: { damping: 18, type: "spring" },
    };
  }, [isVisible]);

  const containerStyle = useMemo(() => {
    return {
      backgroundColor: theme.colors.background,
      ...styles.container,
    };
  }, []);

  return (
    <MotiView {...animatedProps} style={containerStyle}>
      <AdvancedFlatList
        horizontal
        data={users}
        renderItem={renderItem}
        onEndReached={onEndReached}
        style={{ height: CELL_SIDE }}
        keyboardShouldPersistTaps="always"
      />
    </MotiView>
  );
};

export default memo(UserTagList);

const styles = StyleSheet.create({
  container: {
    zIndex: 2,
    width: "100%",
    position: "absolute",
    bottom: 0,
    borderRadius: 16,
    paddingTop: 8,
    marginBottom: isAndroid ? -16 : 0,
  },
  cell: {
    width: CELL_SIDE,
    height: CELL_SIDE,
    alignItems: "center",
    marginHorizontal: 4,
  },
});
