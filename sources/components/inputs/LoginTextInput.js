import { isEmpty } from "lodash";
import React, { forwardRef, memo, useEffect, useMemo, useRef } from "react";
import { StyleSheet, View } from "react-native";
import { useTheme } from "../../hooks";
import mergeRefs from "../../utility/mergeRefs";
import { FadeView, InputStatusView } from "../views";
import MainTextInput from "./MainTextInput";

const USERNAME_LENGTH = 32;

const LoginTextInput = forwardRef(
  (
    {
      title,
      type,
      phonePrefix,
      isUsernameValid,
      style,
      onChangePhonePrefix,
      autoFocus,
      ...props
    },
    ref
  ) => {
    const theme = useTheme();
    const textRef = useRef();

    const textInputRefs = mergeRefs([ref, textRef]);

    useEffect(() => {
      if (autoFocus && textRef) {
        setTimeout(() => {
          textRef.current?.focus();
        }, 500);
      }
    }, []);

    const containerStyle = useMemo(() => {
      return [styles.container, theme.styles.shadow_round];
    }, []);

    if (type == "username") {
      const isUsernameEmpty = isEmpty(props.value);

      return (
        <View
          style={[
            style,
            containerStyle,
            {
              flexDirection: "row",
              alignItems: "center",
            },
          ]}
        >
          <MainTextInput
            ref={textInputRefs}
            autoCapitalize={"none"}
            autoCorrect={false}
            placeholder="Username"
            style={{ flex: 1 }}
            maxLength={USERNAME_LENGTH}
            {...props}
          />
          <FadeView hidden={isUsernameEmpty}>
            <InputStatusView
              style={{ marginLeft: 8 }}
              valid={isUsernameValid}
            />
          </FadeView>
        </View>
      );
    }

    return (
      <View style={{ alignItems: "center", justifyContent: "center" }}>
        <View
          style={[
            style,
            containerStyle,
            { flexDirection: "row", alignItems: "center" },
          ]}
        >
          <MainTextInput
            maxLength={256}
            autoCorrect={false}
            style={{ flex: 1 }}
            ref={textInputRefs}
            {...props}
          />
        </View>
      </View>
    );
  }
);
export default memo(LoginTextInput);

const styles = StyleSheet.create({
  container: {
    padding: "4.5%",
    paddingHorizontal: "5%",
    justifyContent: "center",
  },
});
