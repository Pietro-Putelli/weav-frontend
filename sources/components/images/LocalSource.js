import React, { forwardRef, memo, useCallback, useMemo, useState } from "react";
import { Image, StyleSheet, View } from "react-native";
import { useTheme } from "../../hooks";
import { LoaderView } from "../views";

const LocalSource = forwardRef(
  ({ style, source, onLoadEnd, ...props }, ref) => {
    const theme = useTheme();
    const [isLoading, setILoading] = useState(true);

    const { uri } = source;

    /* Effects */

    const onLoad = useCallback(() => {
      setILoading(false);

      onLoadEnd?.();
    }, []);

    const containerStyle = useMemo(() => {
      return {
        overflow: "hidden",
        alignItems: "center",
        justifyContent: "center",
        ...theme.styles.shadow_round,
        ...style,
      };
    }, [style]);

    return (
      <View style={containerStyle}>
        <Image
          source={{ uri }}
          style={StyleSheet.absoluteFillObject}
          onLoad={onLoad}
          {...props}
        />

        <LoaderView isLoading={isLoading} />
      </View>
    );
  }
);

export default memo(LocalSource);
