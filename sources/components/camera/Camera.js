import { pick, size } from "lodash";
import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  Extrapolate,
  interpolate,
  runOnJS,
  useAnimatedProps,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import {
  Camera as VisionCamera,
  frameRateIncluded,
  sortFormats,
  useCameraDevices,
} from "react-native-vision-camera";
import { insets } from "../../styles";
import { BORDER_RADIUS } from "../../styles/sizes";
import { formatTakenPictureUri } from "../../utility/formatters";
import { isAndroidDevice } from "../../utility/functions";
import BottomCameraMenu from "./BottomCameraMenu";
import CameraButton from "./CameraButton";
import CameraFlareView from "./CameraFlareView";
import TopCameraMenu from "./TopCameraMenu";

const { width } = Dimensions.get("window");

const AnimatedCamera = Animated.createAnimatedComponent(VisionCamera);
Animated.addWhitelistedNativeProps({ zoom: true });

const SCALE_FULL_ZOOM = 3;
const MAX_ZOOM_FACTOR = 20;

const isAndroid = isAndroidDevice();

const Camera = ({
  isActive,
  isLibraryDisabled,
  onMediaCaptured,
  onLibraryPress,
  onClosePress,
  initialCameraPosition = "back",
}) => {
  /* States */

  const [cameraPosition, setCameraPosition] = useState(initialCameraPosition);
  const [isFlashEnabled, setIsFlashEnabled] = useState(false);
  const [isCameraInitialized, setIsCameraInitialized] = useState(false);

  const devices = useCameraDevices();
  const device = devices[cameraPosition];
  const hasOneCamera = size(device?.devices) === 1;

  const minZoom = device?.minZoom ?? 0.5;
  const maxZoom = Math.min(device?.maxZoom ?? 1, MAX_ZOOM_FACTOR);

  const defaultZoom = useMemo(() => {
    if (isCameraInitialized && !hasOneCamera) {
      return 2;
    }

    return 0;
  }, [isCameraInitialized]);

  /* Hooks */

  const cameraRef = useRef();
  const flareRef = useRef();

  /* Handle zoom gesture animation */
  const zoom = useSharedValue(0);
  const startZoom = useSharedValue(null);

  /* Effects */

  useEffect(() => {
    if (cameraPosition === "back") {
      zoom.value = withSpring(defaultZoom);
    } else {
      zoom.value = withSpring(0);
    }
  }, [cameraPosition, defaultZoom]);

  /* Props */

  const formats = useMemo(() => {
    if (device?.formats == null) return [];
    return device.formats.sort(sortFormats);
  }, [device?.formats]);

  const fps = useMemo(() => {
    const supports60Fps = formats.some((f) =>
      f.frameRateRanges.some((r) => frameRateIncluded(r, 60))
    );
    if (!supports60Fps) return 30;

    return 60;
  }, [device?.supportsLowLightBoost, formats]);

  const format = useMemo(() => {
    let result = formats;
    return result.find((f) =>
      f.frameRateRanges.some((r) => frameRateIncluded(r, fps))
    );
  }, [formats, fps]);

  const cameraAnimatedProps = useAnimatedProps(() => {
    const zoomValue = Math.max(Math.min(zoom.value, maxZoom), minZoom);

    return {
      zoom: zoomValue,
    };
  }, [maxZoom, minZoom, zoom]);

  /* Callbacks */

  const _onMediaCaptured = useCallback(
    (asset) => {
      flareRef.current?.flare();

      const _asset = pick(asset, ["width", "height", "uri"]);
      const uri = formatTakenPictureUri(_asset.uri);

      onMediaCaptured({ ..._asset, uri });
    },
    [onMediaCaptured]
  );

  const onFlipCamera = useCallback(() => {
    setCameraPosition((position) => {
      return position === "back" ? "front" : "back";
    });
  }, [defaultZoom]);

  const onChangeFlash = useCallback(() => {
    setIsFlashEnabled(!isFlashEnabled);
  }, [isFlashEnabled]);

  /* Handle Gestures */

  const tapGesture = Gesture.Tap()
    .onEnd(() => {
      runOnJS(onFlipCamera)();
    })
    .numberOfTaps(2);

  const pinchGesture = Gesture.Pinch()
    .onStart(() => {
      startZoom.value = zoom.value ?? 0;
    })
    .onChange((event) => {
      const _startZoom = startZoom.value ?? 0;

      const scale = interpolate(
        event.scale,
        [1 - 1 / SCALE_FULL_ZOOM, 1, SCALE_FULL_ZOOM],
        [-1, 0, 1],
        Extrapolate.CLAMP
      );

      zoom.value = interpolate(
        scale,
        [-1, 0, 1],
        [minZoom, _startZoom, maxZoom],
        Extrapolate.CLAMP
      );
    });

  /* Styles */

  const cameraContainerStyle = useMemo(() => {
    return styles.moment_camera;
  }, []);

  const cameraButtonProps = useMemo(() => {
    return {
      isFlashEnabled,
      minZoom,
      maxZoom,
      cameraZoom: zoom,
      style: styles.button,
      onMediaCaptured: _onMediaCaptured,
    };
  }, [isFlashEnabled, minZoom, maxZoom, _onMediaCaptured]);

  if (!device) {
    return null;
  }

  const cameraGesture = Gesture.Race(tapGesture, pinchGesture);

  return (
    <View style={styles.container}>
      <View style={{ flex: 1 }}>
        <GestureDetector gesture={cameraGesture}>
          <View style={cameraContainerStyle}>
            <TopCameraMenu
              onClosePress={onClosePress}
              onChangeFlash={onChangeFlash}
              isFlashEnabled={isFlashEnabled}
            />

            {device != null && (
              <AnimatedCamera
                ref={cameraRef}
                style={StyleSheet.absoluteFill}
                device={device}
                format={format}
                fps={fps}
                isActive={isActive}
                enableZoomGesture={false}
                animatedProps={cameraAnimatedProps}
                photo={true}
                orientation="portrait"
                onInitialized={() => {
                  setIsCameraInitialized(true);
                }}
              />
            )}
            <CameraFlareView ref={flareRef} />

            <CameraButton ref={cameraRef} {...cameraButtonProps} />
          </View>
        </GestureDetector>

        <BottomCameraMenu
          onFlipCamera={onFlipCamera}
          onLibraryPress={onLibraryPress}
          isLibraryDisabled={isLibraryDisabled}
        />
      </View>
    </View>
  );
};

export default memo(Camera);

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: insets.topAndroid },
  moment_camera: {
    overflow: "hidden",
    borderRadius: isAndroid ? 0 : BORDER_RADIUS * 1.5,
    width,
    flex: 1,
  },
  button: {
    zIndex: 100,
    bottom: 16,
    alignSelf: "center",
    position: "absolute",
  },
});
