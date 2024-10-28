import { isNull } from "lodash";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Platform, StyleSheet, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useNavigation } from "react-native-navigation-hooks";
import { RFPercentage } from "react-native-responsive-fontsize";
import { useDispatch } from "react-redux";
import { Analytics, analyticTypes } from "../../analytics";
import SpotsAPI from "../../backend/spots";
import {
  AnimatedBlurView,
  FadeAnimatedView,
} from "../../components/animations";
import {
  CheckmarkButton,
  CreateContentButton,
  IconButton,
  SolidButton,
} from "../../components/buttons";
import { KeyboardAvoidingView } from "../../components/containers";
import { EdgeGesture } from "../../components/gestures";
import { HeaderTitle } from "../../components/headers";
import { CacheableImageView, ProfilePicture } from "../../components/images";
import { TextView } from "../../components/inputs";
import { MainText } from "../../components/texts";
import { BounceView, LinearGradient } from "../../components/views";
import { MAX_SPOT_CONTENT_CHAR_COUNT } from "../../constants/constants";
import { SCREENS } from "../../constants/screens";
import { useFocusEffect, useLanguages, useTheme, useUser } from "../../hooks";
import { showModalNavigation } from "../../navigation/actions";
import { gradients, icons, insets, typographies } from "../../styles";
import {
  BORDER_RADIUS,
  VENUE_CELL_HEIGHT,
  widthPercentage,
} from "../../styles/sizes";
import { isValidText } from "../../utility/validators";

const PROFILE_SIDE = widthPercentage(0.14);
const TEXT_INPUT_MAX_HEIGHT = RFPercentage(20);
const TEXT_INPUT_MIN_HEIGHT = RFPercentage(12);
const BUTTON_SIDE = widthPercentage(0.12);

const CreateSpotScreen = ({ initialSpot, onCreated }) => {
  /* Utility */

  const theme = useTheme();
  const dispatch = useDispatch();
  const textInputRef = useRef();
  const navigation = useNavigation();

  const user = useUser();

  /* States */

  const [spot, setSpot] = useState({
    isAnonymous: true,
    content: "",
    business: null,
    ...initialSpot,
  });

  const [isLoading, setIsLoading] = useState(false);

  const { business, businessSource, businessSourceExists } = useMemo(() => {
    const business = spot.business;
    const businessSource = business?.cover_source;
    const businessSourceExists = !!businessSource;

    return { business, businessSource, businessSourceExists };
  }, [spot]);

  const isDoneEnabled = useMemo(() => {
    const isContentValid = isValidText({ text: spot.content, minLength: 8 });

    return isContentValid && !isNull(spot.business);
  }, [spot]);

  const isFromBusiness = !!initialSpot?.business;

  const { languageContent } = useLanguages();

  /* Effects */

  useEffect(() => {
    textInputRef.current?.focus();

    Analytics.sendEvent(analyticTypes.BEGIN_SPOT_CREATE);
  }, []);

  useFocusEffect(() => {
    textInputRef.current?.focus();
  });

  /* Methods */

  const updateSpotState = (data) => {
    setSpot({ ...spot, ...data });
  };

  /* Callbacks */

  const onBack = () => {
    navigation.dismissModal();
  };

  const onChangeText = useCallback(
    (content) => {
      updateSpotState({ content });
    },
    [spot]
  );

  const onAnonymousPress = () => {
    updateSpotState({
      isAnonymous: !spot.isAnonymous,
    });
  };

  const onVenuePress = () => {
    showModalNavigation({
      screen: SCREENS.AddBusiness,
      passProps: {
        onGoBack: (item) => {
          const business = {
            cover_source: item.source.uri,
            name: item.value,
            id: item.id,
          };

          updateSpotState({ business });
        },
      },
    });
  };

  const onDonePress = () => {
    setIsLoading(true);

    if (isLoading) {
      return;
    }

    const spotData = {
      content: spot.content,
      business_id: spot.business?.id,
      is_anonymous: spot.isAnonymous,
    };

    dispatch(
      SpotsAPI.createMine(spotData, (data) => {
        if (data) {
          onCreated?.(data);

          setTimeout(() => {
            navigation.dismissModal();
          }, 300);
        } else {
          setIsLoading(false);
        }
      })
    );
  };

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
    <EdgeGesture>
      <View style={styles.container}>
        <HeaderTitle
          noBack
          rightButton={rightButton}
          titleStyle={{ marginLeft: "3.5%" }}
          title={languageContent.buttons.create_spot}
        />

        <KeyboardAwareScrollView
          keyboardShouldPersistTaps="always"
          showsVerticalScrollIndicator={false}
        >
          <FadeAnimatedView style={{ paddingHorizontal: 12 }}>
            <View style={styles.content}>
              <View style={styles.profilePicture}>
                <ProfilePicture side={PROFILE_SIDE} source={user.picture} />

                <AnimatedBlurView
                  intensity={30}
                  visible={spot.isAnonymous}
                  style={styles.blurOverlay}
                />
              </View>

              <View style={{ flex: 1 }}>
                <TextView
                  ref={textInputRef}
                  value={spot.content}
                  textStyle={textInputStyle}
                  onChangeText={onChangeText}
                  maxLength={MAX_SPOT_CONTENT_CHAR_COUNT}
                  placeholder={languageContent.text_placeholders.new_spot}
                />
              </View>
            </View>

            {businessSourceExists && (
              <FadeAnimatedView style={styles.businessImage}>
                <BounceView
                  style={StyleSheet.absoluteFill}
                  onPress={onVenuePress}
                >
                  <CacheableImageView
                    style={StyleSheet.absoluteFillObject}
                    source={businessSource}
                  />

                  <LinearGradient
                    inverted
                    style={styles.imageGradient}
                    colors={gradients.Shadow}
                  >
                    <MainText bold font="title-4">
                      {business?.name}
                    </MainText>
                  </LinearGradient>
                </BounceView>
              </FadeAnimatedView>
            )}
          </FadeAnimatedView>
        </KeyboardAwareScrollView>

        <KeyboardAvoidingView
          keyboardVerticalOffset={0}
          behavior={Platform.OS == "android" ? null : "position"}
        >
          <View
            style={[
              styles.actionsContainer,
              { backgroundColor: theme.colors.background },
            ]}
          >
            <BounceView
              onPress={onAnonymousPress}
              selected={spot.isAnonymous}
              title={languageContent.anonymous}
              style={[theme.styles.shadow_round, styles.anonymousContainer]}
            >
              <CheckmarkButton selected={spot.isAnonymous} />

              <MainText
                bold
                uppercase
                font="subtitle-3"
                style={{ marginLeft: 12 }}
              >
                {languageContent.anonymous}
              </MainText>
            </BounceView>

            {!isFromBusiness && (
              <SolidButton
                marginRight
                icon={icons.Marker1}
                onPress={onVenuePress}
                title={languageContent.venue}
              />
            )}

            <CreateContentButton
              onPress={onDonePress}
              isLoading={isLoading}
              disabled={!isDoneEnabled}
              style={styles.createButton}
              iconSide={BUTTON_SIDE * 0.45}
            />
          </View>
        </KeyboardAvoidingView>
      </View>
    </EdgeGesture>
  );
};

export default CreateSpotScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: insets.bottom,
  },
  content: {
    flexDirection: "row",
  },
  profilePicture: {
    marginRight: "3%",
    marginTop: 4,
  },
  textInput: {
    flex: 1,
    marginRight: "2%",
    maxHeight: TEXT_INPUT_MAX_HEIGHT,
    minHeight: TEXT_INPUT_MIN_HEIGHT,
    textAlignVertical: "top",
    padding: 0,
  },
  anonymousContainer: {
    flex: 1,
    marginRight: 12,
    borderRadius: BORDER_RADIUS * 1.4,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  actionsContainer: {
    flexDirection: "row",
    paddingVertical: 10,
    marginHorizontal: "2%",
  },
  businessImage: {
    marginTop: "4%",
    overflow: "hidden",
    height: VENUE_CELL_HEIGHT * 1.1,
    borderRadius: BORDER_RADIUS,
  },
  blurOverlay: {
    overflow: "hidden",
    width: PROFILE_SIDE,
    height: PROFILE_SIDE,
    transform: [{ scale: 1.02 }],
    borderRadius: PROFILE_SIDE / 2.2,
  },
  createButton: {
    width: BUTTON_SIDE,
    height: BUTTON_SIDE,
    borderRadius: BUTTON_SIDE / 2.2,
  },
  imageGradient: {
    position: "absolute",
    zIndex: 10,
    width: "100%",
    bottom: 0,
    height: "60%",
    justifyContent: "flex-end",
    padding: 12,
  },
});
