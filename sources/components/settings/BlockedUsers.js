import React, { useCallback, useEffect, useState } from "react";
import { Dimensions, View } from "react-native";
import { ProfileEndpoints } from "../../backend/endpoints";
import { getWithAuth } from "../../backend/methods";
import { blockUser } from "../../backend/profile";
import { SolidButton } from "../../components/buttons";
import { HeaderFlatList } from "../../components/containers";
import { useLanguages, useTheme } from "../../hooks";
import { DoubleOptionPopupModal } from "../../modals";
import { ProfilePicture } from "../images";
import { MainText } from "../texts";

const { BLOCK_USER } = ProfileEndpoints;

const { width } = Dimensions.get("window");
const PROFILE_SIDE = width / 8;

const BlockedUsers = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [visible, setVisible] = useState(false);
  const [popup, setPopup] = useState({ title: "", user_id: undefined });

  const theme = useTheme();
  const { languageContent } = useLanguages();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    setIsLoading(true);

    getWithAuth(BLOCK_USER)
      .then(({ data }) => {
        setUsers(data);

        setIsLoading(false);
      })
      .catch((error) => {
        console.log("[get_block_user]", error);
      });
  };

  const onDonePress = useCallback(() => {
    blockUser(popup.user_id, () => {
      fetchUsers();
    });
  }, [popup]);

  const onPress = ({ username, id }) => {
    setVisible(true);

    setPopup({
      title: `${languageContent.actions.unblock} ${username}?`,
      user_id: id,
    });
  };

  const renderItem = useCallback(({ item }) => {
    return (
      <View
        style={[
          theme.styles.cell,
          {
            padding: "3%",
            flexDirection: "row",
            alignItems: "center",
            marginVertical: "1%",
          },
        ]}
      >
        <ProfilePicture source={item.picture} side={PROFILE_SIDE} />

        <MainText
          numberOfLines={1}
          font="subtitle"
          style={{ marginHorizontal: "4%", flex: 1 }}
        >
          {item.username}
        </MainText>

        <SolidButton
          type="delete"
          title="unblock"
          onPress={() => onPress(item)}
          style={{ width: "40%", height: 40 }}
        />
      </View>
    );
  }, []);

  return (
    <>
      <HeaderFlatList
        data={users}
        enabledAnimation
        isLoading={isLoading}
        renderItem={renderItem}
        headerProps={{ title: languageContent.blocked_users }}
      />

      <DoubleOptionPopupModal
        visible={visible}
        setVisible={setVisible}
        onDonePress={onDonePress}
        {...popup}
      />
    </>
  );
};
export default BlockedUsers;
