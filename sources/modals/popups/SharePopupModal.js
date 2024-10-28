import Clipboard from "@react-native-clipboard/clipboard";
import React, { useMemo } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import Animated from "react-native-reanimated";
import { IconButton } from "../../components/buttons";
import { SquareImage } from "../../components/images";
import { MainText } from "../../components/texts";
import { BounceView } from "../../components/views";
import { useLanguages, useTheme } from "../../hooks";
import { icons } from "../../styles";
import { shareOnTelegram, shareOnWhatsApp } from "../../utility/shareApis";
import PopupModal from "./PopupModal";

const { width } = Dimensions.get("window");
const CONTAINER_WIDTH = width * 0.9;

const CELL_WIDTH = CONTAINER_WIDTH / 4;

const SHARE_ITEMS = [
  {
    title: "whatsapp",
    icon: icons.Whatsapp,
    backgroundColor: "#1dbf58",
  },
  {
    title: "telegram",
    icon: icons.Telegram,
    backgroundColor: "#2593cc",
  },
  {
    inset: 2,
    title: "copy",
    icon: icons.Copy,
    backgroundColor: "#0c856f",
  },
];

const SharePopupModal = ({ visible, setVisible, onDismiss }) => {
  const theme = useTheme();
  const { languageContent } = useLanguages();

  const containerStyle = useMemo(() => {
    return [styles.container, theme.styles.shadow_round];
  }, []);

  const dismiss = () => {
    setVisible(false);
  };

  const onItemPress = async (type) => {
    const text = languageContent.social_share_weav_message;

    if (type == "whatsapp") {
      shareOnWhatsApp({ text });
    } else if (type == "telegram") {
      shareOnTelegram({ text });
    } else {
      const link = "https://weav.it/download";

      Clipboard.setString(link);
    }
  };

  return (
    <PopupModal {...{ visible, setVisible, onDismiss }}>
      <Animated.View style={containerStyle}>
        <View style={styles.exitButton}>
          <IconButton onPress={dismiss} inset={1} source={icons.Cross} />
        </View>

        <View style={{ marginRight: 8 }}>
          <MainText bold align={"center"} font="title-4">
            {languageContent.share_popup_title}
          </MainText>
        </View>

        <View style={styles.shareContainer}>
          {SHARE_ITEMS.map((item, index) => {
            return (
              <BounceView
                haptic
                onPress={() => onItemPress(item.title)}
                style={styles.itemCell}
                key={index}
              >
                <View
                  style={{
                    ...styles.itemCellContent,
                    backgroundColor: item.backgroundColor,
                  }}
                >
                  <SquareImage
                    side={CELL_WIDTH * 0.35}
                    inset={item.inset}
                    source={item.icon}
                  />
                </View>

                <MainText
                  style={{ marginTop: 12 }}
                  align="center"
                  uppercase
                  font="subtitle-4"
                  bold
                >
                  {item.title}
                </MainText>
              </BounceView>
            );
          })}
        </View>
      </Animated.View>
    </PopupModal>
  );
};

export default SharePopupModal;

const styles = StyleSheet.create({
  container: {
    width: CONTAINER_WIDTH,
    padding: 24,
    paddingVertical: 32,
  },
  exitButton: {
    alignItems: "flex-end",
    width: "100%",
    right: -9,
    top: -14,
  },
  shareContainer: {
    marginTop: "12%",
    flexDirection: "row",
    justifyContent: "center",
  },
  itemCell: {
    width: CELL_WIDTH,
    height: CELL_WIDTH,
    marginRight: 8,
    alignItems: "center",
  },
  itemCellContent: {
    width: CELL_WIDTH * 0.8,
    height: CELL_WIDTH * 0.8,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: CELL_WIDTH / 2.2,
  },
});
