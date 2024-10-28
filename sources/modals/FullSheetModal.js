import React, { useCallback } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { icons, insets } from "../styles";
import { FadeAnimatedView } from "../components/animations";
import { useTheme } from "../hooks";
import {
  useNavigation,
  useNavigationModalDismiss,
} from "react-native-navigation-hooks";
import { MainText } from "../components/texts";
import { isAndroidDevice } from "../utility/functions";
import { IconButton } from "../components/buttons";

const isAndroid = isAndroidDevice();

const FullSheetModal = ({
  title,
  children,
  scrollable,
  containerStyle,
  contentStyle,
  removePadding,
  onDismiss,
}) => {
  const theme = useTheme();
  const navigation = useNavigation();

  useNavigationModalDismiss(() => {
    onDismiss?.();
  });

  const renderExitButton = useCallback(() => {
    return (
      <IconButton
        onPress={() => {
          navigation.dismissModal();
        }}
        source={icons.Chevrons.Down}
      />
    );
  }, []);

  return (
    <View
      style={[
        {
          flex: 1,
          paddingHorizontal: removePadding ? 0 : 8,
          backgroundColor: theme.colors.background,
        },
        containerStyle,
      ]}
    >
      {!isAndroid && (
        <View
          style={{
            height: 4,
            width: "30%",
            borderRadius: 8,
            marginVertical: "4%",
            alignSelf: "center",
            backgroundColor: theme.colors.secondText,
          }}
        />
      )}

      {title && !isAndroid && (
        <MainText
          style={[styles.title, { paddingHorizontal: !removePadding ? 0 : 12 }]}
          font="title-5"
          capitalize
        >
          {title}
        </MainText>
      )}

      {isAndroid && !title && (
        <View style={styles.exitContainer}>{renderExitButton()}</View>
      )}

      {isAndroid && title && (
        <View style={styles.header}>
          <View style={{ flex: 1 }}>
            <MainText font="title-5" capitalize>
              {title}
            </MainText>
          </View>
          {renderExitButton()}
        </View>
      )}

      <FadeAnimatedView style={{ flex: 1 }}>
        {scrollable ? (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: insets.bottom }}
          >
            {children}
          </ScrollView>
        ) : (
          <View style={[{ flex: 1 }, contentStyle]}>{children}</View>
        )}
      </FadeAnimatedView>
    </View>
  );
};

export default FullSheetModal;

const styles = StyleSheet.create({
  title: {
    marginLeft: "1%",
    marginBottom: "4%",
  },
  exitContainer: {
    marginVertical: "4%",
    alignItems: "flex-end",
    paddingHorizontal: "2%",
  },
  header: {
    marginTop: "6%",
    marginBottom: "4%",
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: "1%",
  },
});
