import { MotiView } from "moti";
import React, {
  forwardRef,
  memo,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { Keyboard, StyleSheet, View } from "react-native";
import { RFPercentage } from "react-native-responsive-fontsize";
import { useLanguages, useTheme } from "../../hooks";
import { icons } from "../../styles";
import { widthPercentage } from "../../styles/sizes";
import mergeRefs from "../../utility/mergeRefs";
import { IconButton } from "../buttons";
import { SquareImage } from "../images";
import { MainText } from "../texts";
import { BounceView, LoaderView } from "../views";
import MainTextInput from "./MainTextInput";

const CANCEL_WIDTH = widthPercentage(0.16);
const CONTAINER_HEIGHT = RFPercentage(7);

const SolidSearchBar = forwardRef(
  (
    {
      style,
      icon,
      isLoading = false,
      autFocus,
      onCancelPress,
      onBackPress,
      ...props
    },
    ref
  ) => {
    const innerRef = useRef();
    const theme = useTheme();
    const { languageContent } = useLanguages();

    const [cancelVisible, setCancelVisible] = useState(false);

    useImperativeHandle(ref, () => {
      return {
        hideCancel: () => {
          setCancelVisible(false);
        },
      };
    });

    useEffect(() => {
      if (autFocus) {
        innerRef.current?.focus();
      }
    }, []);

    const onChangeTextStatus = (isFocus) => {
      if (onCancelPress && isFocus) {
        setCancelVisible(isFocus);
      }
    };

    return (
      <View
        style={[
          {
            flexDirection: "row",
            alignItems: "center",
          },
          style,
        ]}
      >
        <View
          style={[
            {
              flex: 1,
              height: CONTAINER_HEIGHT,
              flexDirection: "row",
              alignItems: "center",
              paddingHorizontal: "3%",
            },
            theme.styles.shadow_round,
          ]}
        >
          <IconButton source={icon ?? icons.Search} disabled inset={3} />
          <MainTextInput
            onChangeTextStatus={onChangeTextStatus}
            ref={mergeRefs([innerRef, ref])}
            clearButtonMode="while-editing"
            style={{ flex: 1, marginLeft: "2%" }}
            {...props}
          />

          <LoaderView
            percentage={0.6}
            isLoading={isLoading}
            style={{ marginHorizontal: "2%" }}
          />
        </View>

        {onBackPress && (
          <BounceView
            onPress={onBackPress}
            style={{
              marginLeft: "3%",
              height: CONTAINER_HEIGHT,
              width: CONTAINER_HEIGHT,
              justifyContent: "center",
              alignItems: "center",
              ...theme.styles.shadow_round,
            }}
          >
            <SquareImage
              source={icons.Chevrons.Down}
              side={CONTAINER_HEIGHT * 0.4}
            />
          </BounceView>
        )}

        <MotiView
          transition={{ type: "timing" }}
          animate={{
            opacity: cancelVisible ? 1 : 0,
            width: cancelVisible ? CANCEL_WIDTH : 0,
          }}
          style={styles.cancel_container}
        >
          <BounceView
            onPress={() => {
              Keyboard.dismiss();
              setCancelVisible(false);
              onCancelPress?.();
            }}
            style={styles.cancel_title}
          >
            <MainText capitalize font="subtitle-3" style={styles.cancel_title}>
              {languageContent.actions.cancel}
            </MainText>
          </BounceView>
        </MotiView>
      </View>
    );
  }
);

export default memo(SolidSearchBar);

const styles = StyleSheet.create({
  cancel_container: {
    height: CONTAINER_HEIGHT,
    justifyContent: "center",
  },
  cancel_title: {
    marginLeft: 4,
    width: CANCEL_WIDTH,
  },
});
