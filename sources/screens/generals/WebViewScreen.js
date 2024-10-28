import React, { useCallback, useRef, useState } from "react";
import { View } from "react-native";
import WebView from "react-native-webview";
import { FadeAnimatedView } from "../../components/animations";
import { WebViewFooter } from "../../components/footers";
import { WebViewHeader } from "../../components/headers";
import { useTheme } from "../../hooks";
import { formatUrlSchema } from "../../utility/formatters";

const WebViewScreen = ({ url, isModal }) => {
  const theme = useTheme();
  const webViewRef = useRef();

  const formattedUrl = formatUrlSchema(url);

  const [progress, setProgress] = useState(0);

  const [options, setOptions] = useState({
    canGoBack: false,
    canGoForward: false,
  });

  const onLoadProgress = useCallback(({ nativeEvent }) => {
    setProgress(nativeEvent.progress);
  }, []);

  const onNavigate = useCallback((cmd) => {
    if (cmd == "next") {
      webViewRef.current.goForward();
    } else {
      webViewRef.current.goBack();
    }
  }, []);

  const onNavigationStateChange = useCallback(({ canGoBack, canGoForward }) => {
    setOptions({ canGoBack, canGoForward });
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <WebViewHeader isModal={isModal} url={url} progress={progress} />

      <FadeAnimatedView style={{ flex: 1 }} mode="fade" delay={300}>
        <WebView
          ref={webViewRef}
          onNavigationStateChange={onNavigationStateChange}
          onLoadProgress={onLoadProgress}
          source={{ uri: formattedUrl }}
          style={{ backgroundColor: theme.colors.background }}
        />
      </FadeAnimatedView>

      <WebViewFooter
        url={formattedUrl}
        options={options}
        onNavigate={onNavigate}
      />
    </View>
  );
};
export default WebViewScreen;
