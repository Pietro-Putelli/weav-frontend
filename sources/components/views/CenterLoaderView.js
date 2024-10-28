import React, { memo } from "react";
import { StyleSheet, View } from "react-native";
import { BarIndicator } from "react-native-indicators";
import { widthPercentage } from "../../styles/sizes";
import { Modal } from "../containers";

const SIDE = widthPercentage(0.3);

const CenterLoaderView = ({ isLoading, setIsLoading }) => {
  return (
    <Modal visible={isLoading}>
      <View
        style={[
          StyleSheet.absoluteFillObject,
          {
            alignItems: "center",
            justifyContent: "center",
          },
        ]}
      >
        <View
          style={{
            width: SIDE,
            height: SIDE,
            borderRadius: 16,
            backgroundColor: "rgba(0,0,0,0.7)",
          }}
        >
          <BarIndicator size={SIDE / 3} count={3} color={"white"} />
        </View>
      </View>
    </Modal>
  );
};

export default memo(CenterLoaderView);
