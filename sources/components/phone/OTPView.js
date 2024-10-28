import React, { memo, useEffect, useRef, useState } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import InputCode from "react-native-input-code";
import { useTheme } from "../../hooks";
import { SolidButton } from "../buttons";
import { MainText } from "../texts";
import { LoaderView } from "../views";
import { typographies } from "../../styles";

const { width } = Dimensions.get("window");

const LOTTIE_SIDE = width / 10;
const SQUARE_SIDE = width / 7;

const OTPView = ({
  title,
  isError,
  isModal,
  isLoading,
  setIsError,
  hideResend,
  hideKeyboard,
  onCodeFilled,
  onResendPress,
  resendLoading,
}) => {
  const theme = useTheme();

  const [code, setCode] = useState("");

  const ref = useRef();

  useEffect(() => {
    setTimeout(
      () => {
        ref.current?.focus();
      },
      isModal ? 0 : 500
    );

    if (isError) {
      setCode("");
    }
  }, [isError, hideKeyboard]);

  const onCodeChanged = (code) => {
    setCode(code);

    if (setIsError && code.length < 6) {
      setIsError(undefined);
    }

    if (code.length == 5) {
      setTimeout(() => {
        onCodeFilled?.(code);
      }, 200);
    }
  };

  return (
    <View style={styles.container}>
      {title && (
        <MainText
          uppercase
          font="subtitle-1"
          align="center"
          style={styles.description}
        >
          {title}
        </MainText>
      )}

      <View style={styles.content}>
        <InputCode
          code={code}
          ref={ref}
          length={5}
          onChangeCode={onCodeChanged}
          codeTextStyle={{
            ...styles.codeText,
            fontSize: typographies.fontSizes.subtitle,
            fontFamily: "Poppins",
          }}
          codeContainerStyle={[
            styles.codeContainerStyle,
            theme.styles.shadow_round,
          ]}
          codeContainerCaretStyle={[
            styles.codeContainerCaretStyle,
            theme.styles.shadow_round,
          ]}
        />
        {!hideResend && (
          <View style={styles.bottom}>
            <SolidButton
              haptic
              title="resend"
              onPress={onResendPress}
              isLoading={resendLoading}
            />
            <View style={styles.lotties_container}>
              <LoaderView
                isLoading={isLoading && !isError}
                style={styles.loader}
              />
            </View>
          </View>
        )}
      </View>
    </View>
  );
};
export default memo(OTPView);

const styles = StyleSheet.create({
  container: {
    width: width - 16,
    alignSelf: "center",
    justifyContent: "center",
  },
  content: {
    marginTop: 16,
  },
  description: {
    marginBottom: "4%",
    textAlign: "center",
    marginHorizontal: "4%",
  },
  otp: {
    height: 50,
    width: "100%",
    alignSelf: "center",
  },
  loader: {
    position: "absolute",
  },
  bottom: {
    marginTop: 16,
    paddingVertical: 8,
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: "3%",
    justifyContent: "space-between",
  },
  lotties_container: {
    width: "30%",
    alignItems: "flex-end",
    justifyContent: "center",
  },
  lottie: {
    width: LOTTIE_SIDE,
    height: LOTTIE_SIDE,
  },
  codeText: {
    borderWidth: 0,
    borderBottomWidth: 0,
  },
  codeContainerStyle: {
    borderWidth: 0,
    width: SQUARE_SIDE,
    height: SQUARE_SIDE,
  },
  codeContainerCaretStyle: {
    width: SQUARE_SIDE,
    height: SQUARE_SIDE,
    borderWidth: 0,
  },
});
