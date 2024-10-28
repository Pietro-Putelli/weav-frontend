import { Image as ExpoImage } from "expo-image";
import React, { memo, useCallback, useMemo, useState } from "react";
import { Image, StyleSheet, View } from "react-native";
import { isAndroidDevice } from "../../utility/functions";
import { isLocalMemoryUri } from "../../utility/validators";

const isAndroid = isAndroidDevice();

const CacheableImageView = ({
  source,
  style,
  animationDuration,
  onLoadEnd,
  ...props
}) => {
  const isLocalUri = isLocalMemoryUri(source);

  const initialLoaded = useMemo(() => {
    if (isAndroid) {
      return true;
    }
    return false;
  }, []);

  const [isLoaded, setIsLoaded] = useState(initialLoaded);

  const _onLoadEnd = useCallback(() => {
    onLoadEnd?.();

    setIsLoaded(true);
  }, [onLoadEnd]);

  const isBlurVisible = !isLoaded && !isLocalUri;

  return (
    <View style={[style, styles.container]}>
      {isLocalUri ? (
        <Image
          source={{ uri: source }}
          style={[StyleSheet.absoluteFillObject, style]}
          {...props}
        />
      ) : (
        <>
          <ExpoImage
            style={style}
            source={source}
            contentFit="cover"
            transition={250}
            onLoadEnd={_onLoadEnd}
            {...props}
          />

          {/* <AnimatedBlurView
            tint="dark"
            style={styles.blur}
            visible={isBlurVisible}
            animationDuration={animationDuration}
          /> */}
        </>
      )}
    </View>
  );
};
export default memo(CacheableImageView);

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  blur: {
    ...StyleSheet.absoluteFillObject,
    overflow: "hidden",
  },
});
