import MaskedView from "@react-native-masked-view/masked-view";
import { BarCodeScanner } from "expo-barcode-scanner";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { useNavigation } from "react-native-navigation-hooks";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { AnimatedFeedbackView } from "../../components/animations";
import { IconButton } from "../../components/buttons";
import { EdgeGesture } from "../../components/gestures";
import { LoaderView } from "../../components/views";
import { useEventActivity } from "../../hooks";
import { icons, insets } from "../../styles";
import { triggerHaptic } from "../../utility/haptics";

const { width, height } = Dimensions.get("window");
const SCANNER_SIDE = width * 0.8;

const ValidationStates = {
  None: "none",
  Valid: "valid",
  Invalid: "invalid",
};

const QrScannerScreen = () => {
  const navigation = useNavigation();

  const { completeMatch } = useEventActivity();

  const [isLoading, setIsLoading] = useState(false);
  const [validationState, setValidationState] = useState(ValidationStates.None);

  const isFeedbackVisible = validationState != ValidationStates.None;
  const isInvalidated = validationState == ValidationStates.Invalid;

  const scanWidth = useSharedValue(SCANNER_SIDE);
  const scanHeight = useSharedValue(SCANNER_SIDE);

  const lastCodeScanned = useRef(null);

  useEffect(() => {
    if (isFeedbackVisible) {
      const timer = setTimeout(() => {
        setValidationState(ValidationStates.None);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [validationState]);

  useEffect(() => {
    const side = isLoading ? 0 : SCANNER_SIDE;

    scanWidth.value = withSpring(side);
    scanHeight.value = withSpring(side);
  }, [isLoading]);

  /* Callbacks */

  const onBarCodeScanned = useCallback(({ data }) => {
    if (lastCodeScanned.current == data) {
      return;
    }

    lastCodeScanned.current = data;

    setIsLoading(true);
    setValidationState(ValidationStates.None);

    triggerHaptic();

    completeMatch(data, (isValid) => {
      setIsLoading(false);

      const validationState = isValid
        ? ValidationStates.Valid
        : ValidationStates.Invalid;

      setValidationState(validationState);
    });
  }, []);

  const onClosePress = () => {
    navigation.dismissModal();
  };

  const animatedMaskStyle = useAnimatedStyle(() => {
    return {
      width: scanWidth.value,
      height: scanHeight.value,
    };
  }, []);

  return (
    <EdgeGesture>
      <View style={styles.container}>
        <MaskedView
          style={styles.maskedView}
          maskElement={
            <View style={styles.maskWrapper}>
              <Animated.View
                style={[animatedMaskStyle, styles.mask]}
              ></Animated.View>
            </View>
          }
        >
          <BarCodeScanner
            style={styles.barCodeScanner}
            onBarCodeScanned={onBarCodeScanned}
          />
        </MaskedView>

        {isLoading && (
          <View style={styles.loaderContainer}>
            <LoaderView isLoading percentage={1.5} />
          </View>
        )}

        <AnimatedFeedbackView
          style={styles.feedback}
          isPositive={!isInvalidated}
          isVisible={isFeedbackVisible}
        />

        <View style={styles.closeButton}>
          <IconButton onPress={onClosePress} source={icons.Cross} />
        </View>
      </View>
    </EdgeGesture>
  );
};

export default QrScannerScreen;

const styles = StyleSheet.create({
  container: { flex: 1 },
  closeButton: {
    position: "absolute",
    top: insets.top + 4,
    right: 20,
  },
  maskedView: {
    flex: 1,
    flexDirection: "row",
    height: "100%",
  },
  maskWrapper: {
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  mask: {
    backgroundColor: "#000",
    borderRadius: 32,
  },
  barCodeScanner: {
    width,
    height,
    backgroundColor: "red",
  },
  feedback: {
    position: "absolute",
    bottom: SCANNER_SIDE / 1.8,
    alignSelf: "center",
  },
  loaderContainer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
  },
});
