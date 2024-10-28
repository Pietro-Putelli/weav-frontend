import { unionBy } from "lodash";
import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Dimensions, Keyboard, StyleSheet, View } from "react-native";
import { Navigation } from "react-native-navigation";
import { useNavigation } from "react-native-navigation-hooks/dist";
import { RFPercentage } from "react-native-responsive-fontsize";
import { useDispatch } from "react-redux";
import { shareMoment, shareProfile } from "../../backend/chat";
import { formatReceivers } from "../../backend/formatters/chatFormatters";
import { deleteMyMoment } from "../../backend/moments";
import { FadeAnimatedView } from "../../components/animations";
import { ConfirmView } from "../../components/badgeviews";
import { SolidButton } from "../../components/buttons";
import { HorizontalUserProfileCell } from "../../components/cells";
import { SolidSearchBar } from "../../components/inputs";
import { AdvancedFlatList } from "../../components/lists";
import { FullScreenLoader } from "../../components/loaders";
import { SeparatorTitle } from "../../components/separators";
import { SocialShareList } from "../../components/shares";
import ViewShotHandler from "../../components/viewshots/ViewShotHandler";
import { querylimits } from "../../constants";
import { SCREENS } from "../../constants/screens";
import shareOptions from "../../constants/shareOptions";
import {
  useDelayedEffect,
  useLanguages,
  useSearchUsers,
  useTheme,
} from "../../hooks";
import { showSheetNavigation } from "../../navigation/actions";
import { deleteUserMomentStateAt } from "../../store/slices/momentsReducer";
import { icons, insets } from "../../styles";
import { handleSelection, includesById } from "../../utility/collections";
import { triggerHaptic } from "../../utility/haptics";
import {
  copyLinkFor,
  shareMore,
  shareOnInstagram,
  shareOnTelegram,
  shareOnWhatsApp,
} from "../../utility/shareApis";
import FullSheetModal from "../FullSheetModal";
import DoubleOptionPopupModal from "../popups/DoubleOptionPopupModal";

const { width } = Dimensions.get("window");

/* Use amI to tell that I'm from my moment */

const ShareModal = ({
  onDismiss,
  onDeleted,
  moment,
  event,
  business,
  profileId,
  amI,
}) => {
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [visibleBadge, setVisibleBadge] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const [isSending, setIsSending] = useState(false);

  /* Use when waiting for share to open */
  const [isLoading, setIsLoading] = useState(false);
  const [allUsers, setAllUsers] = useState([]);

  const {
    users,
    recentUsers,
    isNotFound,
    onChangeText,
    onEndReached,
    isLoadingMore,
    ...searchProps
  } = useSearchUsers({ allowRecents: true, limit: querylimits.EIGHT });

  const { languageContent } = useLanguages();

  const momentId = moment?.id;
  const businessId = business?.id;
  const eventId = event?.id;

  const { isShareVisible, allowInstagramShare } = useMemo(() => {
    return {
      isShareVisible: !momentId,
      allowInstagramShare: momentId || businessId,
    };
  }, [momentId, eventId, businessId]);

  const [instagramShare, setInstagramShare] = useState(false);

  const [popupVisible, setPopupVisible] = useState(false);

  /* Hooks */

  const dispatch = useDispatch();
  const navigation = useNavigation();
  const searchBarRef = useRef();
  const shotRef = useRef();

  /* Effects */

  useDelayedEffect(
    0,
    () => {
      if (recentUsers) {
        setAllUsers(recentUsers);
      }
    },
    [recentUsers]
  );

  useEffect(() => {
    if (instagramShare) {
      setIsLoading(true);

      setTimeout(() => {
        shotRef.current.capture().then((data) => {
          shareOnInstagram(data, () => {
            setIsLoading(false);
          });
        });
      }, 500);
    }
  }, [instagramShare, shotRef]);

  /* Callbacks */

  const onDonePress = () => {
    if (isSending) {
      return;
    }

    setIsSending(true);

    const receivers = formatReceivers(selectedUsers);

    let data = { receivers };

    if (momentId) {
      data.moment_id = momentId;
    }

    if (eventId) {
      data.event_id = eventId;
    }

    if (momentId || eventId) {
      dispatch(shareMoment(data, completedCallback));
    } else {
      const id = profileId ?? businessId;
      const mode = profileId ? "user" : "business";

      dispatch(
        shareProfile({ mode, profile_id: id, receivers }, completedCallback)
      );
    }
  };

  const onCancelPress = useCallback(() => {
    onChangeText("");
    setIsSearching(false);
  }, []);

  const onSearchFocus = useCallback(() => {
    setIsSearching(true);
  }, []);

  const onUserPress = useCallback(
    (user) => {
      const [newUsers, isAdded] = handleSelection(selectedUsers, user);

      if (isAdded) {
        if (!includesById(allUsers, user)) {
          setAllUsers((users) => {
            return unionBy([user], users, "id");
          });
        }
      }

      setSelectedUsers(newUsers);
    },
    [selectedUsers, allUsers]
  );

  const onSearchUserSelected = useCallback(
    (user) => {
      setIsSearching(false);
      Keyboard.dismiss();

      onChangeText("");

      setTimeout(() => {
        onUserPress(user);
        searchBarRef.current.hideCancel();
      }, 200);
    },
    [onUserPress]
  );

  const onSocialPress = useCallback(
    (type) => {
      const params = { event, businessId };

      switch (type) {
        case shareOptions.MORE:
          shareMore(params);
          break;
        case shareOptions.COPY:
          copyLinkFor(params);
          setVisibleBadge(true);
          break;
        case shareOptions.WHATSAPP:
          shareOnWhatsApp(params);
          break;
        case shareOptions.TELEGRAM:
          shareOnTelegram(params);
          break;
        case shareOptions.INSTAGRAM:
          setInstagramShare(true);
          break;
        case shareOptions.REPORT:
          showSheetNavigation({ screen: SCREENS.Report });
      }
    },
    [moment]
  );

  const onDeletePress = useCallback(() => {
    const momentId = moment.id;

    dispatch(
      deleteMyMoment(momentId, (isDone) => {
        if (isDone) {
          dispatch(deleteUserMomentStateAt(momentId));

          onDeleted?.();
          Navigation.dismissAllModals();
        }
      })
    );
  }, []);

  /* Methods */

  const completedCallback = (isDone) => {
    if (isDone) {
      triggerHaptic();
      navigation.dismissModal();
    }
  };

  /* Components */

  const renderItem = useCallback(
    ({ item: user }) => {
      const selected = includesById(selectedUsers, user);

      return (
        <HorizontalUserProfileCell
          user={user}
          selected={selected}
          onPress={isSearching ? onSearchUserSelected : onUserPress}
        />
      );
    },
    [selectedUsers, isSearching, onUserPress]
  );

  return (
    <>
      <ConfirmView
        title={languageContent.action_feedbacks.copied}
        visible={visibleBadge}
        setVisible={setVisibleBadge}
      />

      <FullSheetModal
        onDismiss={onDismiss}
        contentStyle={{
          paddingBottom: insets.bottom + RFPercentage(2),
        }}
      >
        <SolidSearchBar
          ref={searchBarRef}
          onFocus={onSearchFocus}
          placeholder={languageContent.text_placeholders.search_users}
          onCancelPress={onCancelPress}
          onChangeText={onChangeText}
          {...searchProps}
        />

        <SeparatorTitle noBottom marginTop>
          {languageContent.separator_titles.recents}
        </SeparatorTitle>

        <View style={{ flex: 1, marginTop: "3%" }}>
          <AdvancedFlatList
            data={allUsers}
            enabledAnimation
            estimatedItemSize={60}
            renderItem={renderItem}
            extraData={selectedUsers}
            isLoading={isLoadingMore && !isSearching}
          />
        </View>

        {isShareVisible && (
          <SocialShareList
            onPress={onSocialPress}
            setIsLoading={setIsLoading}
            allowInstagram={allowInstagramShare}
            style={{ marginBottom: "5%" }}
          />
        )}

        <View style={styles.buttons}>
          <SolidButton
            flex
            type="done"
            loadingOnPress
            onPress={onDonePress}
            icon={icons.Paperplane}
            disabled={selectedUsers.length < 1}
            title={languageContent.buttons.send}
          />

          {amI && (
            <SolidButton
              flex
              type="delete"
              title="delete"
              icon={icons.Bin}
              onPress={() => setPopupVisible(true)}
              style={styles.deleteButton}
            />
          )}
        </View>

        {isSearching && (
          <SearchView
            users={users}
            renderItem={renderItem}
            isLoading={isLoadingMore}
            onEndReached={onEndReached}
          />
        )}
      </FullSheetModal>

      <FullScreenLoader isLoading={isLoading} />

      {instagramShare && (
        <ViewShotHandler
          ref={shotRef}
          event={event}
          moment={moment}
          business={business}
        />
      )}

      {amI && (
        <DoubleOptionPopupModal
          visible={popupVisible}
          onDonePress={onDeletePress}
          setVisible={setPopupVisible}
          title={languageContent.popup_contents.delete_moment}
        />
      )}
    </>
  );
};

export default ShareModal;

const SearchView = memo(({ users, ...props }) => {
  const theme = useTheme();

  const containerStyle = useMemo(() => {
    return {
      backgroundColor: theme.colors.background,
      ...styles.container,
    };
  }, []);

  return (
    <FadeAnimatedView mode="fade" style={containerStyle}>
      <AdvancedFlatList
        data={users}
        enabledAnimation
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="always"
        bulkCount={querylimits.EIGHT}
        {...props}
      />
    </FadeAnimatedView>
  );
});

const styles = StyleSheet.create({
  container: {
    width: width - 16,
    height: "94%",
    bottom: 0,
    position: "absolute",
    paddingHorizontal: 0,
  },
  seach_cell: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: "2%",
    flexDirection: "row",
    alignItems: "center",
  },
  username: {
    marginLeft: "3%",
  },
  buttons: {
    flexDirection: "row",
  },
  deleteButton: {
    marginLeft: "4%",
  },
});
