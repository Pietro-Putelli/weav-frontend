import React, { useCallback, useEffect, useRef, useState } from "react";
import { Dimensions, ScrollView, StyleSheet, View } from "react-native";
import { useNavigation } from "react-native-navigation-hooks";
import uuid from "react-native-uuid";
import { Camera } from "../../components/camera";
import { EdgeGesture } from "../../components/gestures";
import { CameraPermissionsPlaceholder } from "../../components/placeholders";
import { SCREENS } from "../../constants/screens";
import { useCurrentBusiness, useUser } from "../../hooks";
import { showStackModal } from "../../navigation/actions";

const { width, height } = Dimensions.get("window");

const CameraScreen = ({
  scrollTo,
  isActive,
  isModal,
  isLibraryDisabled,
  componentId,
  setIsScrollEnabled,
  onMediaCaptured,
  onClosePress,
  ...props
}) => {
  const [isMediaLibraryLoaded, setIsMediaLibraryLoaded] = useState(false);

  const { permissions } = useUser();
  const { isBusiness } = useCurrentBusiness();

  const scrollRef = useRef();

  const navigation = useNavigation();

  useEffect(() => {
    if (!isMediaLibraryLoaded && isActive && !isLibraryDisabled) {
      setIsMediaLibraryLoaded(true);
    }
  }, [isActive]);

  const scrollToInside = (index) => {
    scrollRef.current.scrollTo({ y: index * height, animate: true });
  };

  const _onMediaCaptured = useCallback((source) => {
    if (onMediaCaptured) {
      onMediaCaptured(source);

      if (isModal) {
        navigation.dismissModal();
      }
    } else {
      setTimeout(() => {
        onAssetSelected(source);
      }, 300);
    }
  }, []);

  const onCloseLibraryPress = useCallback(() => {
    scrollRef.current.scrollTo({ y: 0, animate: true });
  }, []);

  const onLibraryPress = useCallback(() => {
    scrollToInside(1);
  }, []);

  const onMomentumScrollEnd = useCallback(
    ({
      nativeEvent: {
        contentOffset: { y },
      },
    }) => {
      setIsScrollEnabled?.(y < height);
    },
    []
  );

  const onCreated = () => {
    scrollToInside(0);
    scrollTo(1);
  };

  const onAssetSelected = useCallback(
    (source) => {
      const passProps = { onCreated };

      if (isBusiness) {
        passProps.initialEvent = { source, id: uuid.v1(), content: "" };
      } else {
        passProps.initialMoment = { source };
      }

      showStackModal({
        screen: isBusiness ? SCREENS.CreateEvent : SCREENS.CreateMoment,
        passProps,
      });
    },
    [isBusiness]
  );

  const _onClosePress = () => {
    onClosePress?.();

    if (isModal) {
      navigation.dismissModal();
    } else {
      navigation.pop();
    }
  };

  return (
    <EdgeGesture disabled={!isModal}>
      {!permissions.camera ? (
        <CameraPermissionsPlaceholder />
      ) : (
        <ScrollView
          pagingEnabled
          ref={scrollRef}
          bounces={false}
          overScrollMode="never"
          showsVerticalScrollIndicator={false}
          contentInsetAdjustmentBehavior="never"
          onMomentumScrollEnd={onMomentumScrollEnd}
        >
          <View style={styles.container}>
            <Camera
              onClosePress={_onClosePress}
              isActive={isActive || isModal}
              onLibraryPress={onLibraryPress}
              onMediaCaptured={_onMediaCaptured}
              isLibraryDisabled={isLibraryDisabled}
              {...props}
            />
          </View>
        </ScrollView>
      )}
    </EdgeGesture>
  );
};

export default CameraScreen;

const styles = StyleSheet.create({
  container: { width, height },
});
