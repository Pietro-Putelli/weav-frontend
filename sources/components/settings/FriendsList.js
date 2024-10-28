import { unionBy } from "lodash";
import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { StyleSheet } from "react-native";
import querylimits from "../../constants/querylimits";
import { SCREENS } from "../../constants/screens";
import { useFriends, useLanguages, useTheme } from "../../hooks";
import { pushNavigation } from "../../navigation/actions";
import { icons } from "../../styles";
import { ICON_SIZES, widthPercentage } from "../../styles/sizes";
import { FadeAnimatedView } from "../animations";
import { HeaderFlatList } from "../containers";
import { ProfilePicture, SquareImage } from "../images";
import { FriendsPlaceholder } from "../placeholders";
import { SeparatorTitle } from "../separators";
import { MainText } from "../texts";
import { BounceView } from "../views";

const PROFILE_SIDE = widthPercentage(0.12);

const FriendsList = ({ title, componentId }) => {
  const theme = useTheme();
  const offset = useRef(0);
  const { getPluralAwareWord } = useLanguages();

  const [friends, setFriends] = useState([]);
  const [friendsCount, setFriendsCount] = useState(0);

  const { isLoading, isNotFound, fetchMyFriends } = useFriends();

  useEffect(() => {
    getMyFriends();
  }, []);

  /* Methods */

  const getMyFriends = () => {
    fetchMyFriends(offset.current, ({ friends, count }) => {
      if (friendsCount == 0) {
        setFriendsCount(count);
      }

      setFriends((_friends) => {
        return unionBy(_friends, friends, "id");
      });
    });
  };

  /* Styles */

  const cellStyle = useMemo(() => {
    return {
      ...theme.styles.shadow_round,
      ...styles.cell,
    };
  }, []);

  /* Callbacks */

  const onUserPress = useCallback((user) => {
    pushNavigation({
      componentId,
      screen: SCREENS.Profile,
      passProps: { user },
    });
  }, []);

  const onEndReached = useCallback(() => {
    offset.current += querylimits.TEN;
    getMyFriends();
  }, [friendsCount]);

  /* Components */

  const renderItem = useCallback(({ item: user }) => {
    const { username, picture } = user;

    return (
      <BounceView
        onPress={() => {
          onUserPress(user);
        }}
        style={cellStyle}
      >
        <ProfilePicture side={PROFILE_SIDE} source={picture} />
        <MainText
          font="subtitle"
          numberOfLines={1}
          style={{ marginLeft: "3%", flex: 1 }}
        >
          {username}
        </MainText>

        <SquareImage
          source={icons.Chevrons.Right}
          side={ICON_SIZES.chevron_right}
          color={theme.colors.placeholderText}
        />
      </BounceView>
    );
  }, []);

  const renderHeader = useCallback(() => {
    if (friendsCount) {
      return (
        <FadeAnimatedView>
          <SeparatorTitle>
            {friendsCount}{" "}
            {getPluralAwareWord({ word: "friend", count: friendsCount })}
          </SeparatorTitle>
        </FadeAnimatedView>
      );
    }
    return null;
  }, [friendsCount]);

  const ListEmptyComponent = useMemo(() => {
    if (isNotFound) {
      return <FriendsPlaceholder />;
    }
    return null;
  }, [isNotFound]);

  return (
    <HeaderFlatList
      data={friends}
      enabledAnimation
      isLoading={isLoading}
      renderItem={renderItem}
      estimatedItemSize={80}
      headerProps={{ title }}
      bulkCount={querylimits.TEN}
      onEndReached={onEndReached}
      renderHeader={renderHeader}
      ListEmptyComponent={ListEmptyComponent}
    />
  );
};

export default memo(FriendsList);

const styles = StyleSheet.create({
  cell: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: "4%",
    marginBottom: "3%",
    paddingVertical: "2%",
  },
});
