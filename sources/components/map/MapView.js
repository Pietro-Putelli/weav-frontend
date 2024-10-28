import { pick } from "lodash";
import React, { forwardRef, useCallback, useMemo, useRef } from "react";
import { default as _MapView } from "react-native-maps";

const customMapStyle = require("../../json/mapstyle.json");

const MapView = forwardRef(
  (
    {
      onDragChange,
      onRegionChangeComplete,
      onRegionChange,
      children,
      showUserLocation,
      cameraProps,
      onPress,
      initialRegion,
      ...props
    },
    ref
  ) => {
    const isChanging = useRef(false);

    const camera = useMemo(() => {
      if (cameraProps) {
        const coordinate = pick(cameraProps.coordinate, [
          "latitude",
          "longitude",
        ]);

        const zoomLevel = cameraProps?.zoomLevel ?? 17;

        return {
          center: coordinate,
          pitch: 30,
          zoom: zoomLevel,
          heading: 0,
        };
      }

      return undefined;
    }, [cameraProps]);

    const _initialRegion = useMemo(() => {
      if (initialRegion) {
        return {
          ...initialRegion,
          latitudeDelta: 0.001,
          longitudeDelta: 0.003,
        };
      }

      return undefined;
    }, [initialRegion]);

    const _onRegionChange = useCallback((region, { isGesture }) => {
      if (isGesture) {
        if (!isChanging.current) {
          isChanging.current = true;
          onDragChange?.(true);
        }
      }

      onRegionChange?.({ region, isGesture });
    }, []);

    const _onRegionChangeComplete = useCallback(
      (region, { isGesture }) => {
        if (isGesture) {
          isChanging.current = false;
          onDragChange?.(false);
        }
        onRegionChangeComplete?.({ region, isGesture });
      },
      [onRegionChangeComplete]
    );

    return (
      <_MapView
        ref={ref}
        camera={camera}
        provider="google"
        customMapStyle={customMapStyle}
        onRegionChange={_onRegionChange}
        onRegionChangeComplete={_onRegionChangeComplete}
        initialRegion={_initialRegion}
        showsCompass={false}
        onPress={({ nativeEvent }) => {
          onPress?.(nativeEvent);
        }}
        {...props}
      >
        {children}
      </_MapView>
    );
  }
);

export default MapView;

/*
type Region {
  latitude: Number,
  longitude: Number,
  latitudeDelta: Number,
  longitudeDelta: Number,
}

type Camera = {
    center: {
      latitude: number,
      longitude: number,
  },
  pitch: number,
  heading: number,

  // Only on iOS MapKit, in meters. The property is ignored by Google Maps.
  altitude: number,

  // Only when using Google Maps.
  zoom: number
}
 */
