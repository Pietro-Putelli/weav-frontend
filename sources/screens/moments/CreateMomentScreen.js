import { isEmpty, isUndefined } from "lodash";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { KeyboardAvoidingView, StyleSheet, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useNavigation } from "react-native-navigation-hooks/dist";
import { RFPercentage } from "react-native-responsive-fontsize";
import { useSelector } from "react-redux";
import { Analytics, analyticTypes } from "../../analytics";
import {
  MomentPreviewContainer,
  ParticipantsList,
  UserTagList,
  WidgetsList,
} from "../../components/addmoment";
import { FadeAnimatedView } from "../../components/animations";
import { InvalidSourceView } from "../../components/badgeviews";
import { IconButton } from "../../components/buttons";
import { CheckableCell } from "../../components/cells";
import { EdgeGesture } from "../../components/gestures";
import { HeaderTitle } from "../../components/headers";
import { ProfilePicture } from "../../components/images";
import { MentionTextInput } from "../../components/inputs";
import TagsList from "../../components/moments/TagsList";
import { CreateMomentPlaceholder } from "../../components/placeholders";
import { SeparatorTitle } from "../../components/separators";
import { MAX_USER_MOMENT_CHAR_COUNT } from "../../constants/constants";
import { SCREENS } from "../../constants/screens";
import {
  useCreateMoment,
  useFocusEffect,
  useLanguages,
  useUser,
} from "../../hooks";
import { showModalNavigation } from "../../navigation/actions";
import { getTutorialState } from "../../store/slices/settingsReducer";
import { icons, insets, typographies } from "../../styles";
import { widthPercentage } from "../../styles/sizes";
import { isNullOrUndefined } from "../../utility/boolean";
import { isAndroidDevice } from "../../utility/functions";
import { removeWhiteSpaces } from "../../utility/strings";

const PROFILE_SIDE = widthPercentage(0.14);
const TEXT_INPUT_MAX_HEIGHT = RFPercentage(36);

const isAndroid = isAndroidDevice();

const CreateMomentScreen = ({ initialMoment, businessDisabled, onCreated }) => {
  /* Utility hooks */

  const { languageContent } = useLanguages();

  const {
    moment,
    mentionedUsername,
    participants,
    activeWidgets,

    doesMomentExists,
    isLoading,
    isDoneEnabled,
    isSourceInvalid,
    removeTag,
    createMoment,

    onPickedWidget,
    onChangeText,
    onMentioningChangeText,
    onDurationChanged,
    onUserTagSelected,
    onParticipantsChanged,
  } = useCreateMoment({ initialMoment });

  const user = useUser();

  const parts = moment?.parts ?? [];

  const hasParticipants = !isEmpty(participants);

  const isAnonymousVisible = useMemo(() => {
    return (
      !isEmpty(removeWhiteSpaces(moment?.content)) ||
      moment?.source ||
      moment?.business_tag
    );
  }, [moment]);

  const isMomentAnonymous = moment?.is_anonymous;

  const [popupVisible, setPopupVisible] = useState(false);

  const isRepostingEvent = !isNullOrUndefined(moment?.event);

  const { createMoment: isTutorialVisible } = useSelector(getTutorialState);
  const isPlaceholderHidden = isTutorialVisible || !isUndefined(initialMoment);

  /* Hooks */

  const textInputRef = useRef();
  const navigation = useNavigation();

  /* Effects */

  const focusTextInput = (delay = 0) => {
    setTimeout(() => {
      textInputRef.current?.focus();
    }, delay);
  };

  useEffect(() => {
    focusTextInput();

    Analytics.sendEvent(analyticTypes.BEGIN_MOMENT_CREATE);
  }, []);

  useFocusEffect(() => {
    focusTextInput();
  });

  useEffect(() => {
    if (!isAnonymousVisible) {
      onPickedWidget({ type: "is_anonymous", item: false });
    }
  }, [isAnonymousVisible]);

  /* Methods */

  const shownMediaLibrary = useCallback(() => {
    showModalNavigation({
      screen: SCREENS.Camera,
      fullscreen: true,
      passProps: {
        isModal: true,
        isLibraryDisabled: true,
        onMediaCaptured: (item) => {
          onPickedWidget({ type: "source", item });
        },
      },
    });
  }, []);

  /* Callbacks */

  const onSourceLoadEnd = useCallback(() => {
    setTimeout(() => {
      textInputRef.current?.focus();
    }, 200);
  }, []);

  const onBack = useCallback(() => {
    if (doesMomentExists) {
      setPopupVisible(true);
    } else {
      navigation.dismissModal();
    }
  }, [doesMomentExists]);

  const onRemoveSourcePress = useCallback(() => {
    const { source, business_tag, event } = moment;

    if (!isNullOrUndefined(event)) {
      removeTag("event");
      return;
    }

    if (!isNullOrUndefined(source)) {
      removeTag("source");
      return;
    }

    if (isNullOrUndefined(source) && !isNullOrUndefined(business_tag)) {
      removeTag("business_tag");
    }
  }, [moment]);

  const onRemoveUserPress = (user) => {
    const newParticipants = participants.filter((participant) => {
      return participant.id !== user.id;
    });

    onPickedWidget({ type: "participants", item: newParticipants });
  };

  const onAddParticipantsPress = () => {
    showModalNavigation({
      screen: SCREENS.AddParticipants,
      passProps: {
        moment,
        onParticipantsChanged,
      },
    });
  };

  const onAnonymousPress = useCallback(() => {
    onPickedWidget({ type: "is_anonymous", item: !moment.is_anonymous });
  }, [moment]);

  const onCreatePress = useCallback(() => {
    if (isLoading) {
      return;
    }

    createMoment((moment) => {
      if (moment) {
        onCreated?.(moment);

        setTimeout(() => {
          navigation.dismissModal();
        }, 100);
      }
    });
  }, [createMoment, moment, isLoading]);

  /* Styles */

  const textInputStyle = useMemo(() => {
    return {
      ...styles.textInput,
      fontSize: typographies.fontSizes.title7,
    };
  }, []);

  /* Components */

  const rightButton = () => {
    return <IconButton onPress={onBack} inset={3} source={icons.Cross} />;
  };

  return (
    <EdgeGesture
      onBack={onBack}
      visible={popupVisible}
      setVisible={setPopupVisible}
    >
      <View style={styles.container}>
        <HeaderTitle
          noBack
          rightButton={rightButton}
          titleStyle={{ marginLeft: "3.5%" }}
          title={languageContent.header_titles.share_moment}
        />

        <KeyboardAwareScrollView
          keyboardShouldPersistTaps="always"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.keyboardContentContainerStyle}
        >
          {!isPlaceholderHidden ? (
            <CreateMomentPlaceholder
              onPress={() => {
                focusTextInput(400);
              }}
            />
          ) : (
            <FadeAnimatedView>
              <View style={styles.content}>
                <View style={styles.profilePicture}>
                  <ProfilePicture side={PROFILE_SIDE} source={user.picture} />
                </View>

                <MentionTextInput
                  ref={textInputRef}
                  style={textInputStyle}
                  value={moment?.content}
                  onChangeText={onChangeText}
                  placeholder={languageContent.text_placeholders.new_moment}
                  onMentioningChangeText={onMentioningChangeText}
                  maxLength={MAX_USER_MOMENT_CHAR_COUNT}
                />
              </View>

              <ParticipantsList
                users={participants}
                onRemoveUserPress={onRemoveUserPress}
              />

              {doesMomentExists && (
                <TagsList
                  isEditing
                  moment={moment}
                  style={[
                    styles.tagList,
                    { marginTop: hasParticipants ? 0 : "2%" },
                  ]}
                  onRemovePress={removeTag}
                />
              )}

              <MomentPreviewContainer
                moment={moment}
                onLoadEnd={onSourceLoadEnd}
                onRemoveSourcePress={onRemoveSourcePress}
              />
            </FadeAnimatedView>
          )}

          {isAnonymousVisible && (
            <FadeAnimatedView>
              <SeparatorTitle marginLeft marginTop>
                {languageContent.more_options}
              </SeparatorTitle>

              <View style={styles.moreOptions}>
                <CheckableCell
                  noColored
                  icon={icons.Anonymous}
                  style={{ marginTop: 0 }}
                  onPress={onAnonymousPress}
                  selected={isMomentAnonymous}
                  title={languageContent.anonymous}
                />
              </View>
            </FadeAnimatedView>
          )}
        </KeyboardAwareScrollView>

        {/* WIDGETS */}
        {isPlaceholderHidden && (
          <KeyboardAvoidingView
            keyboardVerticalOffset={0}
            behavior={isAndroid ? null : "position"}
          >
            <InvalidSourceView visible={isSourceInvalid} />

            <UserTagList
              parts={parts}
              onSelected={onUserTagSelected}
              currentText={mentionedUsername}
            />

            <WidgetsList
              businessDisabled={businessDisabled}
              isDoneLoading={isLoading}
              doneEnabled={isDoneEnabled}
              duration={moment?.duration}
              onDonePress={onCreatePress}
              activeWidgets={activeWidgets}
              onPickedWidget={onPickedWidget}
              onSourcePress={shownMediaLibrary}
              isRepostingEvent={isRepostingEvent}
              onDurationChanged={onDurationChanged}
              onAddParticipantsPress={onAddParticipantsPress}
            />
          </KeyboardAvoidingView>
        )}
      </View>
    </EdgeGesture>
  );
};

export default CreateMomentScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: insets.bottom,
  },
  content: {
    flexDirection: "row",
    paddingHorizontal: "3%",
  },
  profilePicture: {
    marginRight: "1%",
    alignItems: "center",
  },
  keyboardContentContainerStyle: {
    paddingBottom: "4%",
  },
  textInput: {
    flex: 1,
    marginLeft: "3%",
    marginRight: "2%",
    maxHeight: TEXT_INPUT_MAX_HEIGHT,
  },
  tagList: {
    marginHorizontal: "2%",
  },
  partipantsTitle: {
    marginTop: "2%",
    marginLeft: "3%",
  },
  moreOptions: {
    marginHorizontal: "2%",
  },
});
