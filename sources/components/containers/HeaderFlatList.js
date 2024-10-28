import { size } from "lodash";
import React, { forwardRef, memo, useCallback, useMemo } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { useSharedValue } from "react-native-reanimated";
import { useTheme } from "../../hooks";
import { insets } from "../../styles";
import { NAVIGATION_BAR_HEIGHT } from "../../styles/sizes";
import { FadeAnimatedView, ScaleAnimatedView } from "../animations";
import { HeaderTitle } from "../headers";
import { SquareImage } from "../images";
import { AdvancedFlatList } from "../lists";
import { BounceView, LoaderView } from "../views";

const { width } = Dimensions.get("window");
const FLOATING_BUTTON_SIDE = width / 6.5;

const HeaderFlatList = forwardRef(
  (
    {
      data,
      isLoading,
      contentStyle,
      removeMargin,
      children,
      hideNavigationHeader,
      contentContainerStyle,
      renderBottomContent,
      renderHeader,
      headerStyle,
      headerProps,
      renderItem,
      renderEmptyComponent,
      renderFooterComponent,
      isNotFound,
      floatingButtonProps,
      waitForData,
      ...props
    },
    ref
  ) => {
    const theme = useTheme();
    const scrollY = useSharedValue(0);

    /* Props */

    const hasData = useMemo(() => {
      return size(data) > 0;
    }, [data]);

    const conditionToRenderList = useMemo(() => {
      if (!waitForData) {
        return true;
      }

      return hasData || isNotFound;
    }, [waitForData, hasData, isNotFound]);

    /* Methods */

    const keyExtractor = useCallback((item) => {
      return item?.id?.toString();
    }, []);

    /* Styles */

    const contentPaddingBottom = useMemo(() => {
      if (floatingButtonProps) {
        return insets.bottom + FLOATING_BUTTON_SIDE + 8;
      }

      if (renderBottomContent) {
        return 16;
      }

      return insets.bottom + 16;
    }, [floatingButtonProps, renderBottomContent]);

    const listContainerStyle = useMemo(() => {
      return [
        styles.listContainer,
        { paddingHorizontal: removeMargin ? 0 : 8 },
        contentStyle,
      ];
    }, [contentStyle, removeMargin]);

    const _contentContainerStyle = useMemo(() => {
      return {
        paddingTop: hideNavigationHeader ? 0 : NAVIGATION_BAR_HEIGHT + 4,
        paddingBottom: contentPaddingBottom,
        ...contentContainerStyle,
      };
    }, [hideNavigationHeader, contentPaddingBottom, contentContainerStyle]);

    /* Components */

    const ListFooterComponent = useCallback(() => {
      if (!isLoading) {
        return null;
      }

      return (
        <LoaderView
          percentage={0.8}
          isLoading={isLoading}
          style={styles.loader}
        />
      );
    }, [isLoading, renderFooterComponent]);

    return (
      <View style={theme.styles.container}>
        {!hideNavigationHeader && (
          <View style={[styles.header, headerStyle]}>
            <HeaderTitle {...headerProps} headerY={scrollY} />
          </View>
        )}

        {conditionToRenderList ? (
          <View style={listContainerStyle}>
            <AdvancedFlatList
              ref={ref}
              data={data}
              scrollY={scrollY}
              renderItem={renderItem}
              keyExtractor={keyExtractor}
              showsVerticalScrollIndicator={false}
              contentInsetAdjustmentBehavior="never"
              ListFooterComponent={ListFooterComponent()}
              ListEmptyComponent={renderEmptyComponent?.()}
              contentContainerStyle={_contentContainerStyle}
              ListHeaderComponent={renderHeader ? renderHeader() : null}
              {...props}
            />
          </View>
        ) : (
          <View style={styles.lodearContainer}>
            <LoaderView />
          </View>
        )}

        {renderBottomContent && (
          <FadeAnimatedView
            style={[styles.bottomContainer, theme.styles.shadow_round_half]}
          >
            {renderBottomContent()}
          </FadeAnimatedView>
        )}

        {floatingButtonProps && (
          <ScaleAnimatedView style={styles.floatingButton}>
            <BounceView
              haptic
              activeScale={0.9}
              onPress={floatingButtonProps.onPress}
              style={[
                styles.floatingButtonContent,
                { backgroundColor: theme.colors.main_accent },
              ]}
            >
              <SquareImage
                source={floatingButtonProps.icon}
                side={FLOATING_BUTTON_SIDE * 0.45}
              />
            </BounceView>
          </ScaleAnimatedView>
        )}
      </View>
    );
  }
);

export default memo(HeaderFlatList);

const styles = StyleSheet.create({
  bottomContainer: {
    width,
    bottom: 0,
    padding: "4%",
    paddingBottom: insets.bottom + 16,
  },
  floatingButton: {
    width: FLOATING_BUTTON_SIDE,
    height: FLOATING_BUTTON_SIDE,
    position: "absolute",
    bottom: insets.bottom + 8,
    right: 12,
  },
  floatingButtonContent: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: FLOATING_BUTTON_SIDE / 2.2,
  },
  lodearContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: insets.bottom,
  },
  header: { zIndex: 10, position: "absolute" },
  listContainer: { flex: 1 },
  loader: { marginVertical: 16, alignSelf: "center" },
});
