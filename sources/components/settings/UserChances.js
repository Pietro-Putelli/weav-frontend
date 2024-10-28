import React, { memo, useCallback, useState } from "react";
import { StyleSheet, View } from "react-native";
import { useNavigation } from "react-native-navigation-hooks/dist";
import { useLanguages, useSettings } from "../../hooks";
import { icons } from "../../styles";
import { widthPercentage } from "../../styles/sizes";
import { SolidButton } from "../buttons";
import { CheckableCell } from "../cells";
import { MainScrollView } from "../containers";
import { SquareImage } from "../images";
import { SeparatorTitle } from "../separators";
import { MainText } from "../texts";

const ICON_SIDE = widthPercentage(0.35);

const UserChances = () => {
  const { languageContent } = useLanguages();
  const navigation = useNavigation();

  const { settings, changeChance } = useSettings();

  const [states, setStates] = useState(settings.chance);

  const changeStates = (state) => {
    setStates({ ...states, ...state });
  };

  const dismiss = () => {
    navigation.pop();
  };

  const onSettingsChanged = () => {
    changeChance(states);
    dismiss();
  };

  const renderButton = useCallback(() => {
    return (
      <SolidButton
        onPress={onSettingsChanged}
        type="done"
        title="done"
        icon={icons.Done}
      />
    );
  }, [onSettingsChanged]);

  const onSexPress = useCallback(
    (sex) => {
      if (sex == states.sex) {
        sex = null;
      }

      changeStates({ sex });
    },
    [states]
  );

  const onSexInterestPress = useCallback(
    (interested) => {
      if (interested == states.interested) {
        interested = null;
      }

      changeStates({ interested });
    },
    [states]
  );

  return (
    <MainScrollView renderBottomContent={renderButton} title={"chances"}>
      <View style={styles.header}>
        <SquareImage
          coloredIcon
          side={ICON_SIDE}
          source={icons.ColoredChance}
        />

        <MainText style={styles.description} font="subtitle-1" align="center">
          {languageContent.chances_description}
        </MainText>
      </View>

      <SeparatorTitle marginTop noBottom>
        {languageContent.settings}
      </SeparatorTitle>

      <CheckableCell
        selected={states.disabled}
        onPress={() => {
          changeStates({ disabled: !states.disabled });
        }}
        title={languageContent.actions.enable_chances}
      />

      <CheckableCell
        selected={states.today}
        disabled={states.disabled}
        onPress={() => {
          changeStates({ today: !states.today });
        }}
        title={languageContent.allow_today_chance}
        subtitle={languageContent.today_chance_content}
      />

      <CheckableCell
        selected={states.event}
        disabled={states.disabled}
        onPress={() => {
          changeStates({ event: !states.event });
        }}
        title={languageContent.allow_event_chance}
        subtitle={languageContent.event_chance_content}
      />

      <SeparatorTitle marginTop noBottom>
        {languageContent.im + " " + languageContent.optional}
      </SeparatorTitle>

      <SexSelector
        onPress={onSexPress}
        selected={states.sex}
        disabled={states.disabled}
      />

      <SeparatorTitle marginTop noBottom>
        {languageContent.im_interested + " " + languageContent.optional}
      </SeparatorTitle>

      <SexSelector
        showBoth
        onPress={onSexInterestPress}
        disabled={states.disabled}
        selected={states.interested}
      />
    </MainScrollView>
  );
};

export default memo(UserChances);

const SexSelector = ({ onPress, showBoth, selected, disabled }) => {
  const { languageContent } = useLanguages();

  return (
    <View style={styles.sexContainer}>
      <SolidButton
        selected={selected == "female"}
        onPress={() => {
          onPress("female");
        }}
        flex
        marginRight
        disabled={disabled}
        title={languageContent[showBoth ? "females" : "female"]}
      />
      <SolidButton
        onPress={() => {
          onPress("male");
        }}
        flex
        selected={selected == "male"}
        disabled={disabled}
        title={languageContent[showBoth ? "males" : "male"]}
      />
      {showBoth && (
        <SolidButton
          selected={selected == "both"}
          onPress={() => {
            onPress("both");
          }}
          flex
          disabled={disabled}
          style={{ marginLeft: "3%" }}
          title={languageContent.both}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  header: { alignItems: "center" },
  description: {
    marginTop: "6%",
    marginHorizontal: "4%",
  },
  sexContainer: {
    marginTop: "3%",
    flexDirection: "row",
    alignItems: "center",
  },
});
