import { MotiView } from "moti";
import React, { memo } from "react";
import { Dimensions, View } from "react-native";
import { useLanguages } from "../../hooks";
import { insets } from "../../styles";
import SolidButton from "./SolidButton";

const { width } = Dimensions.get("window");
const X_TRANLATION = width / 2;

const FilterButtons = ({ isActive, onCleanPress, onDonePress }) => {
  const { languageContent } = useLanguages();

  return (
    <View
      style={{
        marginTop: "6%",
        flexDirection: "row",
        alignItems: "center",
        marginBottom: insets.bottom + 16,
      }}
    >
      <MotiView
        from={{ translateX: -X_TRANLATION }}
        animate={{ translateX: isActive ? -X_TRANLATION : 0 }}
        transition={{ type: "timing" }}
        style={{ flex: 1, marginRight: "3%" }}
      >
        <SolidButton
          title={languageContent.buttons.clear_filter}
          onPress={onCleanPress}
        />
      </MotiView>

      <View style={{ flex: 1 }}>
        <SolidButton title="done" type="done" onPress={onDonePress} />
      </View>
    </View>
  );
};

export default memo(FilterButtons);
