import Clipboard from "@react-native-clipboard/clipboard";
import { MotiView } from "moti";
import React, { useState } from "react";
import { Dimensions, Keyboard, StyleSheet, View } from "react-native";
import { useNavigation } from "react-native-navigation-hooks/dist";
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { WebView } from "react-native-webview";
import { IconButton, SolidButton } from "../../components/buttons";
import { MainTextInput } from "../../components/inputs";
import { useLanguages, useTheme } from "../../hooks";
import { icons, insets } from "../../styles";
import { heightPercentage } from "../../styles/sizes";
import { isURL } from "../../utility/validators";
import FullSheetModal from "../FullSheetModal";

const { width } = Dimensions.get("window");

const WIDTH = width * 0.76;
const HIDE_BUTTON = heightPercentage(0.2);

const AddLinkModal = ({ onGoBack }) => {
  const theme = useTheme();
  const navigation = useNavigation();
  const { languageContent } = useLanguages();

  const [value, setValue] = useState("");
  const [uri, setUri] = useState("https://www.google.com");

  const enabled = value.includes("https://");

  const progress = useSharedValue(0);
  const progressOpacity = useSharedValue(1);

  const onChangeText = (v) => setValue(v);

  const onPastePress = async () => {
    const paste = await Clipboard.getString();

    isURL(paste, (success, param) => {
      const _url = success ? param : `https://www.google.com/search?q=${paste}`;
      setUri(_url);

      if (success) setValue(paste);
    });
    Keyboard.dismiss();
  };

  const onUseLinkPress = () => {
    onGoBack({ type: "url_tag", value });
    navigation.dismissModal();
  };

  const onSubmitEditing = () => {
    if (value == "") return;

    isURL(value, (success, param) => {
      const _url = success ? param : `https://www.google.com/search?q=${value}`;
      setUri(_url);
    });
  };

  const onLoadProgress = ({ nativeEvent }) => {
    progress.value = nativeEvent.progress;

    if (nativeEvent.progress == 1)
      progressOpacity.value = withTiming(0, { duration: 800 }, (finished) => {
        if (finished) {
          progress.value = 0;
          progressOpacity.value = 1;
        }
      });
  };

  const onNavigationStateChange = ({ canGoBack, url }) => {
    if (!canGoBack) return;
    setValue(url);
  };

  const animatedStyle = useAnimatedStyle(() => ({
    width: interpolate(progress.value, [0, 1], [0, WIDTH], Extrapolate.CLAMP),
    opacity: progressOpacity.value,
  }));

  return (
    <FullSheetModal removePadding>
      <View style={styles.content}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginHorizontal: "2%",
            marginBottom: "4%",
          }}
        >
          <View
            style={{
              flex: 1,
              padding: "3%",
              flexDirection: "row",
              alignItems: "center",
              ...theme.styles.shadow_round,
            }}
          >
            <Animated.View
              style={[
                styles.progress,
                { backgroundColor: theme.white_alpha(0.1) },
                animatedStyle,
              ]}
            />
            <MainTextInput
              value={value}
              onChangeText={onChangeText}
              clearButtonMode="while-editing"
              placeholder="Type a URL or name"
              returnKeyType="search"
              selectTextOnFocus
              onSubmitEditing={onSubmitEditing}
              font="title-7"
              style={{ marginHorizontal: 8, flex: 1 }}
            />

            <IconButton source={icons.Paste} inset={2} onPress={onPastePress} />
          </View>
        </View>

        <WebView
          cacheEnabled
          source={{ uri }}
          onLoadProgress={onLoadProgress}
          allowsBackForwardNavigationGestures
          style={{ flex: 1, borderRadius: 8 }}
          onNavigationStateChange={onNavigationStateChange}
        />
      </View>

      <MotiView
        animate={{
          translateY: enabled ? 0 : HIDE_BUTTON,
        }}
        style={[styles.button, { bottom: insets.bottom }]}
      >
        <SolidButton
          haptic
          type="done"
          title={languageContent.buttons.use_this_link}
          onPress={onUseLinkPress}
        />
      </MotiView>
    </FullSheetModal>
  );
};
export default AddLinkModal;

const styles = StyleSheet.create({
  content: {
    flex: 1,
    height: "100%",
  },
  progress: {
    height: 40,
    borderRadius: 10,
    position: "absolute",
  },
  button: {
    width: "70%",
    alignSelf: "center",
    position: "absolute",
  },
});
