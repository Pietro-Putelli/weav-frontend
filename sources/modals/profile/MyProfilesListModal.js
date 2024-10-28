import { isEmpty } from "lodash";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import BusinessAPI from "../../backend/business";
import { CheckmarkButton, SolidButton } from "../../components/buttons";
import { CacheableImageView } from "../../components/images";
import { SeparatorTitle } from "../../components/separators";
import { MainText } from "../../components/texts";
import { BounceView } from "../../components/views";
import { saveBusinessData } from "../../handlers/business";
import { switchToPersonalProfile } from "../../handlers/user";
import { switchingProfile } from "../../handlers/utility";
import { useCurrentBusiness, useTheme, useUser } from "../../hooks";
import { setMyBusinesses } from "../../store/slices/businessesReducer";
import { icons } from "../../styles";
import { widthPercentage } from "../../styles/sizes";
import ModalScreen from "../ModalScreen";

const PICTURE_SIDE = widthPercentage(0.1);

const MyProfilesListModal = ({ onCreateUserPress }) => {
  const { myBusinesses: businesses } = useCurrentBusiness();

  const theme = useTheme();
  const dispatch = useDispatch();

  const { hasProfile, hasBusiness, ...user } = useUser();

  const { isBusiness, business: currentBusiness } = useCurrentBusiness();

  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (isEmpty(businesses)) {
      dispatch(
        BusinessAPI.getMine({}, (data) => {
          if (data) {
            dispatch(setMyBusinesses(data));
          }
        })
      );
    }
  }, []);

  const onPress = (item) => {
    setTimeout(() => {
      setVisible(false);
    }, 100);

    switchingProfile();

    if (!item?.timetable) {
      dispatch(switchToPersonalProfile({ hasProfile, ...user }));
    } else {
      dispatch(saveBusinessData({ business: item }));
    }
  };

  const _onCreateUserPress = () => {
    setVisible(false);

    onCreateUserPress();
  };

  const renderItem = useCallback((item, selected) => {
    return (
      <BounceView
        disabledWithoutOpacity={selected}
        onPress={() => onPress(item)}
        key={item.id}
        style={[
          theme.styles.cell,
          {
            marginBottom: 12,
            alignItems: "center",
            flexDirection: "row",
            padding: 12,
            paddingHorizontal: 16,
          },
        ]}
      >
        <CacheableImageView
          source={item?.picture ?? item?.cover_source}
          style={{
            width: PICTURE_SIDE,
            height: PICTURE_SIDE,
            borderRadius: PICTURE_SIDE / 2.2,
          }}
        />

        <MainText
          numberOfLines={1}
          font="subtitle"
          style={{
            marginLeft: 16,
            marginRight: 8,
            flex: 1,
          }}
        >
          {item?.name}
        </MainText>

        <CheckmarkButton selected={selected} />
      </BounceView>
    );
  }, []);

  return (
    <ModalScreen cursor visible={visible}>
      {hasProfile ? (
        renderItem(user, !isBusiness)
      ) : (
        <SolidButton
          type="done"
          icon={icons.Add}
          title="create user profile"
          style={{ marginBottom: 12 }}
          onPress={_onCreateUserPress}
        />
      )}

      <SeparatorTitle>businesses</SeparatorTitle>

      {businesses.map((business) => {
        const selected = currentBusiness && business.id == currentBusiness?.id;

        return renderItem(business, selected);
      })}
    </ModalScreen>
  );
};

export default MyProfilesListModal;
