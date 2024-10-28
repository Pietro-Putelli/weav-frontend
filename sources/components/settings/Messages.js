import React, { memo } from "react";
import { useCurrentBusiness, useLanguages, useSettings } from "../../hooks";
import { CheckableCell } from "../cells";
import { MainScrollView } from "../containers";

const Messages = ({ title }) => {
  const { changeMessages } = useSettings();
  const { languageContent } = useLanguages();
  const { business } = useCurrentBusiness();

  return (
    <MainScrollView title={title}>
      <CheckableCell
        onPress={() => {
          changeMessages();
        }}
        selected={business.allow_chat}
        style={{ marginTop: 0 }}
        title={languageContent.allow_users_to_send_me_messages}
        subtitle={languageContent.allow_users_to_send_me_messages_content}
      />
    </MainScrollView>
  );
};

export default memo(Messages);
