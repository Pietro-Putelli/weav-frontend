import { MotiView } from "moti";
import React, { memo, useMemo } from "react";
import { useLanguages, useReachability, useTheme } from "../../hooks";
import { MainText } from "../texts";

const ReachabilityView = ({ isConnected }) => {
  const theme = useTheme();
  const { status } = useReachability();
  const { languageContent } = useLanguages();

  const title = useMemo(() => {
    if (!status.locale) {
      return languageContent.connection_errors.no_internet;
    }
    return languageContent.connection_errors.no_server;
  }, [status]);

  return (
    <MotiView
      animate={{
        translateY: isConnected ? 60 : 0,
      }}
      transition={{
        type: "spring",
        damping: 16,
      }}
      style={{
        height: 24,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 12,
        backgroundColor: theme.colors.red,
        borderRadius: 10,
      }}
    >
      <MainText bold uppercase font="subtitle-4">
        {title}
      </MainText>
    </MotiView>
  );
};

export default memo(ReachabilityView);
