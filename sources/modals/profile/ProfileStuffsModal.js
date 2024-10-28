import React, { useCallback, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import BusinessAPI from "../../backend/business";
import { SolidButton } from "../../components/buttons";
import { SingleTitleCell } from "../../components/cells";
import { actiontypes } from "../../constants/";
import { SCREENS } from "../../constants/screens";
import { switchToBusiness } from "../../handlers/business";
import { switchingProfile } from "../../handlers/utility";
import { useLanguages, useUser } from "../../hooks";
import { pushNavigation, showSheetNavigation } from "../../navigation/actions";
import { icons } from "../../styles";
import ModalScreen from "../ModalScreen";

const { SETTINGS } = actiontypes;

const ProfileStuffsModal = ({ pushComponentId, ...props }) => {
  const [visible, setVisible] = useState();

  const dispatch = useDispatch();
  const { hasBusiness } = useUser();
  const { languageContent } = useLanguages();

  /* Props */

  const items = useMemo(() => {
    return [
      // {
      //   title: languageContent.my_events,
      //   icon: icons.Cocktail,
      //   to: SCREENS.UserEvents,
      // },
      {
        title: languageContent.my_friends,
        icon: icons.Friends,
        type: SETTINGS.FRIENDS_LIST,
      },
      {
        title: languageContent.favorites,
        icon: icons.Favourite,
        type: SETTINGS.LIKED_VENUES,
      },
      {
        title: languageContent.settings,
        icon: icons.Gear,
        type: SETTINGS.ADVANCED,
      },
    ];
  }, []);

  const actionButtonProps = useMemo(() => {
    if (hasBusiness) {
      return {
        title: languageContent.switch_to_business,
        icon: icons.Change,
      };
    }

    return {
      title: languageContent.create_business_profile,
      icon: icons.Add,
    };
  }, []);

  /* Callbacks */

  const onSwitchToBusinessPress = useCallback(() => {
    setVisible(false);

    if (hasBusiness) {
      setTimeout(() => {
        dispatch(switchToBusiness());
      }, 200);
    } else {
      /* Before creating a new business, synch with DB by checking if it already exists */
      dispatch(
        BusinessAPI.getOrCreate((business) => {
          if (business) {
            switchingProfile();
          } else {
            showSheetNavigation({
              screen: SCREENS.ChooseBusinessToCreate,
              passProps: { ...props },
            });
          }
        })
      );
    }
  }, []);

  const onPress = ({ type, title, to }) => {
    pushNavigation({
      componentId: pushComponentId,
      screen: to ?? SCREENS.Settings,
      passProps: { type, title, ...props },
    });

    setTimeout(() => {
      setVisible(false);
    }, 10);
  };

  return (
    <ModalScreen visible={visible} cursor>
      {items.map(({ title, icon, type, to }, index) => (
        <SingleTitleCell
          title={title}
          icon={icon}
          key={index}
          onPress={() => onPress({ type, to, title })}
        />
      ))}

      <SolidButton
        type="done"
        style={{ marginTop: "4%" }}
        onPress={onSwitchToBusinessPress}
        {...actionButtonProps}
      />
    </ModalScreen>
  );
};
export default ProfileStuffsModal;
