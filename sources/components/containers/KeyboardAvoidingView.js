import * as React from "react";
import {
  Platform,
  KeyboardAvoidingView as _KeyboardAvoidingView,
} from "react-native";

function KeyboardAvoidingView({ children, ...props }) {
  return (
    <_KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : null}
      {...props}
    >
      {children}
    </_KeyboardAvoidingView>
  );
}

export default KeyboardAvoidingView;
