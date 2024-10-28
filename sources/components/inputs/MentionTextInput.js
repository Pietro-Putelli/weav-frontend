import React, { forwardRef, memo, useCallback, useRef } from "react";
import { TextInput } from "react-native";

import ParsedText from "react-native-parsed-text";
import { RFPercentage } from "react-native-responsive-fontsize";
import { useTheme } from "../../hooks";
import { fonts } from "../../styles";

const MAX_CHARACTERS_COUNT = 200;
const MIN_HEIGHT = RFPercentage(8);

const MentionTextInput = forwardRef(
  (
    {
      value,
      index,
      onChangeText,
      onMentioningChangeText,
      onEndTextInput,
      style,
      ...props
    },
    ref
  ) => {
    const theme = useTheme();

    const parts = useRef([]);
    const cursorPostion = useRef({ start: 0, end: 0 });
    const typingDelay = useRef(null);

    const handleTypingDelay = (value) => {
      clearTimeout(typingDelay.current);

      typingDelay.current = setTimeout(() => {
        onEndTextInput?.(value);
      }, 400);
    };

    if (ref && ref.current) {
      ref.current.addTag = () => {
        ref.current.focus();

        const { end, start } = cursorPostion.current;
        const addFactor = start == 0 ? 1 : 2;

        cursorPostion.current = {
          end: end,
          start: start,
        };

        const nonNullValue = value ?? "";

        onChange(`${nonNullValue}@`);
      };
    }

    const onChange = (text) => {
      onChangeText(text, parts.current);
      _onMentioningChangeText(text);

      if (onEndTextInput) {
        handleTypingDelay(text);
      }
    };

    const composeData = (words) => {
      let wordRelativeIndex = 0;

      return words.map((word, index) => {
        const hasToMention = word.includes("@");
        const wordAbsoluteIndex = index;
        const wordLength = word.length;
        if (index > 0) {
          wordRelativeIndex = wordRelativeIndex + words[index - 1].length + 1;
        }

        return {
          word,
          wordLength,
          hasToMention,
          wordAbsoluteIndex,
          wordRelativeIndex,
        };
      });
    };

    const checkIfCursorIsAtTheWord = (word, cursor) =>
      cursor.start >= word.wordRelativeIndex + 1 &&
      cursor.start <= word.wordRelativeIndex + word.wordLength;

    const _onMentioningChangeText = (text) => {
      const splittedText = text.split(" ");
      parts.current = composeData(splittedText);

      parts.current = parts.current.map((item) => {
        return {
          ...item,
          isCursorActive: checkIfCursorIsAtTheWord(item, cursorPostion.current),
        };
      });

      const wordAtCursor = parts.current.find((item) => item.isCursorActive);

      if (wordAtCursor && wordAtCursor.hasToMention) {
        const words = wordAtCursor.word.split("@");
        onMentioningChangeText?.(words[words.length - 1], parts.current);
      } else {
        onMentioningChangeText?.(null, parts.current);
      }
    };

    const onSelectionChange = useCallback(({ nativeEvent }) => {
      cursorPostion.current = nativeEvent.selection;
      parts.current = parts.current.map((item) => {
        return {
          ...item,
          isCursorActive: checkIfCursorIsAtTheWord(item, cursorPostion.current),
        };
      });
    }, []);

    return (
      <TextInput
        multiline
        ref={ref}
        style={[
          style,
          {
            minHeight: MIN_HEIGHT,
            textAlignVertical: "top",
            padding: 0,
            paddingTop: 0,
            fontFamily: fonts.Medium,
            color: "white",
            letterSpacing: 1.5,
          },
        ]}
        onChangeText={onChange}
        onSelectionChange={onSelectionChange}
        selectionColor={theme.colors.main_accent}
        placeholderTextColor={theme.white_alpha(0.3)}
        maxLength={MAX_CHARACTERS_COUNT}
        {...props}
      >
        <ParsedText
          style={style}
          parse={[
            {
              pattern: /@[A-Za-z0-9._-]*/,
              style: {
                ...style,
                fontWeight: "600",
                textDecorationLine: "underline",
                color: theme.colors.mention,
                fontFamily: fonts.Medium,
              },
            },
          ]}
        >
          {value}
        </ParsedText>
      </TextInput>
    );
  }
);

export default memo(MentionTextInput);
