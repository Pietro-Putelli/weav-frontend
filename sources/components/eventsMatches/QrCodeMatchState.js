import { useMemo } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import QRCode from "react-native-qrcode-svg";
import { useEventActivity, useLanguages, useTheme } from "../../hooks";
import { BORDER_RADIUS } from "../../styles/sizes";
import { MainText } from "../texts";

const { width } = Dimensions.get("window");

const QR_CODE_SIDE = width * 0.45;
const QR_CODE_CONTAINER_SIDE = QR_CODE_SIDE * 1.3;

const QrCodeMatchState = () => {
  const theme = useTheme();

  const { match } = useEventActivity();

  const { languageContent } = useLanguages();

  const qrCodeValue = useMemo(() => {
    if (match) {
      return `${match.id}:${match.token}`;
    }
    return null;
  }, [match]);

  const qrCodeContainerStyle = useMemo(() => {
    return {
      backgroundColor: theme.colors.background,
      ...styles.qrCodeContainer,
    };
  }, []);

  if (!qrCodeValue) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={qrCodeContainerStyle}>
        <QRCode
          color="white"
          value={qrCodeValue}
          size={QR_CODE_SIDE}
          backgroundColor="transparent"
        />
      </View>

      <View style={styles.description}>
        <MainText bold font="title-8" align={"center"}>
          {languageContent.bring_and_get_drink}
        </MainText>
      </View>
    </View>
  );
};

export default QrCodeMatchState;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginTop: "10%",
    alignItems: "center",
  },
  qrCodeContainer: {
    width: QR_CODE_CONTAINER_SIDE,
    height: QR_CODE_CONTAINER_SIDE,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: BORDER_RADIUS,
  },
  description: {
    marginTop: "8%",
    marginHorizontal: "8%",
  },
});
