import { MotiView } from "moti";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Dimensions,
  Keyboard,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { useNavigation } from "react-native-navigation-hooks";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useDispatch } from "react-redux";
import { Analytics, analyticTypes } from "../../analytics";
import { shareReaction } from "../../backend/chat";
import { FadeAnimatedView } from "../../components/animations";
import { IconButton } from "../../components/buttons";
import { KeyboardAvoidingView } from "../../components/containers";
import { MainTextInput } from "../../components/inputs";
import { BounceView, LoaderView } from "../../components/views";
import { useLanguages, useTheme } from "../../hooks";
import { icons } from "../../styles";
import { isAndroidDevice } from "../../utility/functions";
import { removeAllNewEmptyLines } from "../../utility/strings";
import { isValidText } from "../../utility/validators";

const { width } = Dimensions.get("window");

const isAndroid = isAndroidDevice();

const EMOJI_SIDE = width / 8;

const EMOJIES = ["😂", "😍", "😯", "😩", "🥳", "😡", "🤯", "✌️"];

const ReactionModal = ({ moment, onDismiss }) => {
  const textInputRef = useRef();
  const navigation = useNavigation();
  const { languageContent } = useLanguages();
  const theme = useTheme();
  const dispatch = useDispatch();

  const [reply, setReply] = useState("");
  const [isSending, setIsSending] = useState(false);

  const { user, is_anonymous: isAnonymous } = moment;

  const sendButtonDisabled = !isValidText({ text: reply });

  useEffect(() => {
    setTimeout(() => {
      textInputRef?.current.focus();
    }, 100);
  }, []);

  const hide = (isSent) => {
    Keyboard.dismiss();

    navigation.dismissModal();

    if (isSent) {
      onDismiss?.();
    }
  };

  const onChangeText = (text) => {
    setReply(text);
  };

  const onSendPress = (emoji) => {
    setIsSending(true);

    if (isSending) {
      return;
    }

    let message = {
      moment_id: moment.id,
    };

    if (!emoji) {
      message.content = removeAllNewEmptyLines(reply);
    } else {
      message = {
        ...message,
        type: "emojie",
        content: emoji,
      };
    }

    Analytics.sendEvent(analyticTypes.END_MOMENT_REPLY);

    dispatch(shareReaction(message, hide));
  };

  const renderItem = useCallback(
    ({ item }) => {
      return (
        <BounceView
          activeScale={0.9}
          style={styles.emojiCell}
          onPress={() => onSendPress(item)}
        >
          <Text
            style={{ includeFontPadding: false, fontSize: EMOJI_SIDE * 0.85 }}
          >
            {item}
          </Text>
        </BounceView>
      );
    },
    [isSending]
  );

  const keyExtractor = useCallback((item) => item, []);

  const placeholder = useMemo(() => {
    return (
      languageContent.text_placeholders.reply_to +
      " " +
      (isAnonymous ? languageContent.anonymous : user.username)
    );
  }, [user]);

  const commonListProps = useMemo(() => {
    return {
      keyboardDismissMode: "none",
      keyboardShouldPersistTaps: "always",
      showsHorizontalScrollIndicator: false,
      keyExtractor,
    };
  }, []);

  const fadeViewProps = useMemo(() => {
    return {
      from: { opacity: 0 },
      animate: { opacity: reply.length > 0 ? 0 : 1 },
    };
  }, [reply]);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <TouchableWithoutFeedback onPress={() => hide()}>
          <SafeAreaView style={styles.safeAreaContent}>
            <FadeAnimatedView style={styles.emojiesListContainer}>
              <MotiView {...fadeViewProps}>
                <FlatList
                  numColumns={4}
                  data={EMOJIES}
                  scrollEnabled={false}
                  renderItem={renderItem}
                  contentContainerStyle={{ alignItems: "center" }}
                  {...commonListProps}
                />
              </MotiView>
            </FadeAnimatedView>
          </SafeAreaView>
        </TouchableWithoutFeedback>

        <KeyboardAvoidingView keyboardVerticalOffset={16}>
          {/* <MotiView {...fadeViewProps} style={styles.quickReplyContainer}>
            <FlatList
              horizontal
              data={REACTIONS_IT}
              renderItem={renderReactionItems}
              {...commonListProps}
            />
          </MotiView> */}

          <Animated.View
            entering={FadeInDown.damping(14).springify()}
            style={{
              flexDirection: "row",
              alignItems: "flex-end",
              marginBottom: isAndroid ? "4%" : "1%",
            }}
          >
            <MainTextInput
              multiline
              autoFocus
              font="title-6"
              value={reply}
              maxLength={256}
              ref={textInputRef}
              keyboardAppearance="dark"
              onChangeText={onChangeText}
              style={styles.textInput}
              placeholder={placeholder}
              placeholderTextColor={theme.white_alpha(0.6)}
            />

            <BounceView onPress={onSendPress} disabled={sendButtonDisabled}>
              <MotiView
                transition={{ type: "timing" }}
                animate={{ scale: isSending ? 0 : 1 }}
              >
                <IconButton disabledWithoutOpacity source={icons.Paperplane} />
              </MotiView>

              <MotiView
                transition={{ type: "timing" }}
                animate={{ scale: !isSending ? 0 : 1 }}
                style={styles.loader}
              >
                <LoaderView percentage={0.8} />
              </MotiView>
            </BounceView>
          </Animated.View>
        </KeyboardAvoidingView>
      </View>
    </View>
  );
};
export default ReactionModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.8)",
  },
  emojiCell: {
    margin: 16,
    width: EMOJI_SIDE,
    height: EMOJI_SIDE,
    alignItems: "center",
    justifyContent: "center",
  },
  loader: {
    position: "absolute",
  },
  textInput: {
    flex: 1,
    marginRight: 8,
    textAlignVertical: "top",
  },
  reactionCell: {
    padding: 12,
    paddingHorizontal: 20,
  },
  content: {
    flex: 1,
    paddingHorizontal: "3%",
    justifyContent: "flex-end",
  },
  safeAreaContent: {
    flex: 1,
  },
  quickReplyContainer: {
    marginBottom: "6%",
  },
  emojiesListContainer: {
    marginTop: "35%",
  },
});
