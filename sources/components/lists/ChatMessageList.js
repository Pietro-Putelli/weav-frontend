import _ from "lodash";
import React, { forwardRef, memo, useMemo } from "react";
import { View } from "react-native";
import querylimits from "../../constants/querylimits";
import { insets } from "../../styles";
import { FadeAnimatedView } from "../animations";
import { KeyboardAccessoryView } from "../inputaccessoryview";
import { ChatMessagePlaceholder } from "../placeholders";
import { AdvancedFlatList } from "./index";
import { AnonymousChatView } from "../messages";

const ChatMessageList = forwardRef(
  (
    {
      messages,
      children,
      placeholderProps,
      isDiscussionChat,
      isAnonymous,
      ...props
    },
    ref
  ) => {
    const Placeholder = useMemo(() => {
      if (isDiscussionChat) {
        return View;
      }

      return ChatMessagePlaceholder;
    }, [isDiscussionChat]);

    const ListHeaderComponent = useMemo(() => {
      if (isAnonymous) {
        return <AnonymousChatView />;
      }

      return null;
    }, [isAnonymous]);

    const renderScrollable = (pan) => {
      return (
        <FadeAnimatedView
          delay={250}
          style={{ flex: 1, marginBottom: insets.bottom }}
        >
          <AdvancedFlatList
            ref={ref}
            inverted
            data={messages}
            enabledAnimation
            estimatedItemSize={50}
            onEndReachedThreshold={0.5}
            keyboardDismissMode="interactive"
            bulkCount={querylimits.TEN}
            ListHeaderComponent={ListHeaderComponent}
            extraData={[messages, isAnonymous]}
            {...props}
            {...pan}
          />

          {_.isEmpty(messages) && <Placeholder {...placeholderProps} />}
        </FadeAnimatedView>
      );
    };

    return (
      <KeyboardAccessoryView renderScrollable={renderScrollable}>
        {children}
      </KeyboardAccessoryView>
    );
  }
);

export default memo(ChatMessageList);
