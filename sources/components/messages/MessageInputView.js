import { MotiView } from "moti";
import React, { forwardRef, memo, useEffect, useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";
import { useTheme } from "../../hooks";
import { icons } from "../../styles";
import { ICON_SIZES, MESSAGE_TEXT_INPUT_HEIGHT } from "../../styles/sizes";
import { isAndroidDevice } from "../../utility/functions";
import { isValidMessage } from "../../utility/validators";
import { FadeAnimatedView } from "../animations";
import { SquareImage } from "../images";
import { MessageTextInput } from "../inputs";
import { BounceView, LoaderView } from "../views";
import { RFValue } from "react-native-responsive-fontsize";

const PADDING = RFValue(12);
const isAndroid = isAndroidDevice();

const MessageInputView = forwardRef(
  ({ onSendMessage, onChange, isLoading, isEnabled }, ref) => {
    const theme = useTheme();

    const [message, setMessage] = useState("");

    const sendButtonDisabled = !isValidMessage(message);

    useEffect(() => {
      onChange?.(message);
    }, [message]);

    const onChangeText = (text) => {
      setMessage(text);
    };

    const _onSendMessage = () => {
      setMessage("");

      setTimeout(() => {
        onSendMessage(message);
      }, 10);
    };

    const containerStyle = useMemo(() => {
      return [theme.styles.shadow_round, { borderRadius: 20 }];
    }, []);

    const animateProps = useMemo(() => {
      return { opacity: isEnabled ? 1 : 0.6 };
    }, [isEnabled]);

    const externalContainerStyle = useMemo(() => {
      const backgroundColor = theme.colors.background;

      if (isAndroid) {
        return {
          ...styles.container,
          paddingTop: 0,
          backgroundColor,
        };
      }

      return {
        ...styles.container,
        backgroundColor,
      };
    }, []);

    return (
      <FadeAnimatedView style={externalContainerStyle}>
        <MotiView animate={animateProps} style={containerStyle}>
          <View style={styles.content}>
            <MessageTextInput
              ref={ref}
              value={message}
              isEnabled={isEnabled}
              onChangeText={onChangeText}
              style={styles.textInput}
            />

            <BounceView
              haptic
              activeScale={0.9}
              style={styles.send_button}
              disabled={sendButtonDisabled}
              onPress={() => _onSendMessage(message)}
            >
              <MotiView
                transition={{ type: "timing" }}
                animate={{ scale: isLoading ? 0 : 1 }}
                style={{
                  backgroundColor: theme.colors.main_accent,
                  borderRadius: 16,
                  padding: 9,
                }}
              >
                <SquareImage
                  inset={1}
                  side={ICON_SIZES.two}
                  source={icons.Paperplane}
                />
              </MotiView>

              <MotiView
                transition={{ type: "timing" }}
                animate={{ scale: !isLoading ? 0 : 1 }}
                style={[styles.send_button, styles.loader]}
              >
                <LoaderView percentage={0.8} />
              </MotiView>
            </BounceView>
          </View>
        </MotiView>
      </FadeAnimatedView>
    );
  }
);
export default memo(MessageInputView);

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  content: {
    minHeight: MESSAGE_TEXT_INPUT_HEIGHT,
    paddingVertical: PADDING,
    paddingHorizontal: "4%",
    flexDirection: "row",
    alignItems: "center",
  },
  loader: {
    position: "absolute",
  },
  send_button: {
    right: 8,
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    bottom: 6,
  },
  textInput: {
    marginTop: 2,
  },
});
